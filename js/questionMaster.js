/**
 * QuestionMaster Agent
 * - お題を管理し、ヒントを3つ提供する
 * - Q1=曖昧 → Q3=答えに直結 の段階ヒント
 * - レベル別: 小4 / 中1 / 中3
 */
const QuestionMaster = (() => {
  const LEVELS = {
    es4: { id: "es4", label: "小学4年", description: "かんたんな英語でチャレンジ！" },
    jh1: { id: "jh1", label: "中学1年", description: "基本の英文を読んでみよう！" },
    jh3: { id: "jh3", label: "中学3年", description: "長めの英文にチャレンジ！" }
  };

  // Q1=曖昧ヒント, Q2=中間ヒント, Q3=答えに直結するヒント
  const allQuestions = [
    // ===========================
    // 小学4年レベル (es4)
    // ===========================
    {
      level: "es4",
      answer: "りんご",
      questions: [
        "A round fruit.",
        "You eat it every day.",
        "It is red or green."
      ],
      translations: [
        "丸い果物。",
        "毎日食べるもの。",
        "赤か緑の色をしている。"
      ],
      keywords: [
        { word: "round", meaning: "丸い", note: "形を表す言葉。a round ball（丸いボール）" },
        { word: "eat", meaning: "食べる", note: "食べ物を口に入れること" },
        { word: "red", meaning: "赤い", note: "色を表す言葉。Red light（赤信号）" }
      ],
      choices: ["りんご", "みかん", "バナナ", "もも"]
    },
    {
      level: "es4",
      answer: "犬",
      questions: [
        "It can run fast.",
        "A popular pet.",
        "It says 'woof woof'."
      ],
      translations: [
        "速く走れる。",
        "人気のペット。",
        "「ワンワン」と鳴く。"
      ],
      keywords: [
        { word: "fast", meaning: "速い", note: "スピードが速いこと" },
        { word: "pet", meaning: "ペット", note: "家で飼う動物のこと" },
        { word: "woof", meaning: "ワン（犬の鳴き声）", note: "犬の鳴き声を表す英語" }
      ],
      choices: ["猫", "犬", "うさぎ", "ハムスター"]
    },
    {
      level: "es4",
      answer: "太陽",
      questions: [
        "You see it in the day.",
        "It is very hot.",
        "Yellow and bright in the sky."
      ],
      translations: [
        "昼間に見える。",
        "とても熱い。",
        "空にある黄色くて明るいもの。"
      ],
      keywords: [
        { word: "day", meaning: "昼・日", note: "明るい時間のこと" },
        { word: "hot", meaning: "熱い・暑い", note: "温度が高いこと" },
        { word: "bright", meaning: "明るい", note: "光っている様子" }
      ],
      choices: ["月", "太陽", "星", "雲"]
    },
    {
      level: "es4",
      answer: "猫",
      questions: [
        "It sleeps a lot.",
        "It likes fish.",
        "It says 'meow'."
      ],
      translations: [
        "たくさん寝る。",
        "魚が好き。",
        "「ニャー」と鳴く。"
      ],
      keywords: [
        { word: "sleep", meaning: "寝る", note: "目を閉じて休むこと" },
        { word: "fish", meaning: "魚", note: "水の中に住む生き物" },
        { word: "meow", meaning: "ニャー（猫の鳴き声）", note: "猫の鳴き声を表す英語" }
      ],
      choices: ["犬", "猫", "うさぎ", "鳥"]
    },
    {
      level: "es4",
      answer: "サッカー",
      questions: [
        "A very popular sport.",
        "You cannot use your hands.",
        "You kick a ball into a goal."
      ],
      translations: [
        "とても人気のスポーツ。",
        "手を使えない。",
        "ボールをゴールに蹴り入れる。"
      ],
      keywords: [
        { word: "sport", meaning: "スポーツ", note: "体を動かす遊びや競技" },
        { word: "hand", meaning: "手", note: "体の一部。左右にある" },
        { word: "kick", meaning: "蹴る", note: "足でボールを蹴ること" }
      ],
      choices: ["野球", "サッカー", "バスケ", "テニス"]
    },
    {
      level: "es4",
      answer: "ピアノ",
      questions: [
        "A big instrument.",
        "You play music on it.",
        "It has black and white keys."
      ],
      translations: [
        "大きな楽器。",
        "音楽を演奏する。",
        "黒と白の鍵盤がある。"
      ],
      keywords: [
        { word: "big", meaning: "大きい", note: "サイズが大きいこと" },
        { word: "music", meaning: "音楽", note: "歌やメロディーのこと" },
        { word: "key", meaning: "鍵盤", note: "ピアノの白と黒の部分" }
      ],
      choices: ["ギター", "バイオリン", "ピアノ", "ドラム"]
    },
    {
      level: "es4",
      answer: "傘",
      questions: [
        "It keeps you dry.",
        "You hold it above your head.",
        "You use it in the rain."
      ],
      translations: [
        "濡れないようにする。",
        "頭の上にかざす。",
        "雨の日に使う。"
      ],
      keywords: [
        { word: "dry", meaning: "乾いた", note: "濡れていない状態" },
        { word: "hold", meaning: "持つ", note: "手で持つこと" },
        { word: "rain", meaning: "雨", note: "空から水が降ること" }
      ],
      choices: ["帽子", "傘", "レインコート", "長靴"]
    },
    {
      level: "es4",
      answer: "アイスクリーム",
      questions: [
        "It melts fast.",
        "You eat it in summer.",
        "It is cold and sweet."
      ],
      translations: [
        "すぐ溶ける。",
        "夏に食べる。",
        "冷たくて甘い。"
      ],
      keywords: [
        { word: "melt", meaning: "溶ける", note: "固いものが柔らかくなること" },
        { word: "summer", meaning: "夏", note: "暑い季節" },
        { word: "cold", meaning: "冷たい", note: "温度が低いこと" }
      ],
      choices: ["ケーキ", "アイスクリーム", "チョコレート", "プリン"]
    },
    {
      level: "es4",
      answer: "自転車",
      questions: [
        "No engine needed.",
        "It has two wheels.",
        "You ride it with your feet."
      ],
      translations: [
        "エンジンはいらない。",
        "車輪が2つある。",
        "足を使って乗る。"
      ],
      keywords: [
        { word: "engine", meaning: "エンジン", note: "機械を動かす力を作るもの" },
        { word: "wheel", meaning: "車輪", note: "丸いタイヤの部分" },
        { word: "ride", meaning: "乗る", note: "自転車や馬に乗ること" }
      ],
      choices: ["自動車", "バイク", "自転車", "スケートボード"]
    },
    {
      level: "es4",
      answer: "学校",
      questions: [
        "Teachers are there.",
        "You study with friends.",
        "You go there every day to learn."
      ],
      translations: [
        "先生がいる。",
        "友達と勉強する。",
        "毎日学びに行く場所。"
      ],
      keywords: [
        { word: "teacher", meaning: "先生", note: "教えてくれる人" },
        { word: "friend", meaning: "友達", note: "仲の良い人" },
        { word: "learn", meaning: "学ぶ", note: "新しいことを知ること" }
      ],
      choices: ["公園", "学校", "図書館", "病院"]
    },
    {
      level: "es4",
      answer: "月",
      questions: [
        "You see it at night.",
        "It changes its shape.",
        "It shines in the dark sky."
      ],
      translations: [
        "夜に見える。",
        "形が変わる。",
        "暗い空で光る。"
      ],
      keywords: [
        { word: "night", meaning: "夜", note: "暗い時間のこと" },
        { word: "shape", meaning: "形", note: "丸、三角などの形のこと" },
        { word: "shine", meaning: "光る", note: "明るく光ること" }
      ],
      choices: ["太陽", "月", "星", "雲"]
    },
    {
      level: "es4",
      answer: "魚",
      questions: [
        "It lives in water.",
        "Cats like to eat it.",
        "It can swim but cannot walk."
      ],
      translations: [
        "水の中に住んでいる。",
        "猫が食べるのが好き。",
        "泳げるけど歩けない。"
      ],
      keywords: [
        { word: "water", meaning: "水", note: "飲んだり泳いだりする液体" },
        { word: "like", meaning: "好き", note: "〜が好きという意味" },
        { word: "swim", meaning: "泳ぐ", note: "水の中で動くこと" }
      ],
      choices: ["鳥", "魚", "カエル", "カメ"]
    },
    {
      level: "es4",
      answer: "本",
      questions: [
        "It has many pages.",
        "You read it.",
        "There are many in a library."
      ],
      translations: [
        "ページがたくさんある。",
        "読むもの。",
        "図書館にたくさんある。"
      ],
      keywords: [
        { word: "page", meaning: "ページ", note: "本の1枚1枚のこと" },
        { word: "read", meaning: "読む", note: "文字を見て理解すること" },
        { word: "library", meaning: "図書館", note: "本を借りられる場所" }
      ],
      choices: ["ノート", "新聞", "本", "雑誌"]
    },
    {
      level: "es4",
      answer: "虹",
      questions: [
        "It appears after rain.",
        "It has many colors.",
        "It looks like a big arch in the sky."
      ],
      translations: [
        "雨のあとに出る。",
        "たくさんの色がある。",
        "空に大きなアーチのように見える。"
      ],
      keywords: [
        { word: "appear", meaning: "現れる", note: "見えるようになること" },
        { word: "color", meaning: "色", note: "赤、青、黄色などのこと" },
        { word: "arch", meaning: "アーチ", note: "弓のような形のこと" }
      ],
      choices: ["雲", "虹", "雷", "オーロラ"]
    },
    {
      level: "es4",
      answer: "雪",
      questions: [
        "It is white and soft.",
        "It falls from the sky.",
        "You can make a snowman with it."
      ],
      translations: [
        "白くて柔らかい。",
        "空から降ってくる。",
        "これで雪だるまを作れる。"
      ],
      keywords: [
        { word: "white", meaning: "白い", note: "色を表す言葉" },
        { word: "fall", meaning: "降る・落ちる", note: "上から下に落ちること" },
        { word: "snowman", meaning: "雪だるま", note: "snow（雪）+ man（人）" }
      ],
      choices: ["雨", "雪", "氷", "霜"]
    },

    // ===========================
    // 中学1年レベル (jh1)
    // ===========================
    {
      level: "jh1",
      answer: "りんご",
      questions: [
        "People say it keeps the doctor away.",
        "You can make juice with this fruit.",
        "This fruit is red or green."
      ],
      translations: [
        "これがあればお医者さんいらずと言われます。",
        "この果物でジュースを作れます。",
        "この果物は赤か緑です。"
      ],
      keywords: [
        { word: "doctor", meaning: "医者", note: "病気を治してくれる人" },
        { word: "juice", meaning: "ジュース", note: "果物から作る飲み物" },
        { word: "fruit", meaning: "果物", note: "食べ物の種類を表す言葉" }
      ],
      choices: ["りんご", "みかん", "バナナ", "もも"]
    },
    {
      level: "jh1",
      answer: "猫",
      questions: [
        "It has soft fur and a long tail.",
        "This animal sleeps many hours every day.",
        "This pet says 'meow' and likes fish."
      ],
      translations: [
        "柔らかい毛と長いしっぽがあります。",
        "この動物は毎日何時間も寝ます。",
        "このペットは「ニャー」と鳴いて魚が好きです。"
      ],
      keywords: [
        { word: "soft", meaning: "柔らかい", note: "さわり心地が良い様子" },
        { word: "sleep", meaning: "寝る", note: "目を閉じて休むこと" },
        { word: "meow", meaning: "ニャー（猫の鳴き声）", note: "猫の鳴き声を表す英語" }
      ],
      choices: ["犬", "猫", "うさぎ", "ハムスター"]
    },
    {
      level: "jh1",
      answer: "富士山",
      questions: [
        "It has snow on top in winter.",
        "You can see it from Tokyo on a clear day.",
        "This is the tallest mountain in Japan."
      ],
      translations: [
        "冬には頂上に雪があります。",
        "晴れた日に東京から見えます。",
        "日本で一番高い山です。"
      ],
      keywords: [
        { word: "snow", meaning: "雪", note: "冬に空から降る白いもの" },
        { word: "clear", meaning: "晴れた", note: "空がきれいな状態" },
        { word: "tallest", meaning: "一番高い", note: "tall（高い）の最上級の形" }
      ],
      choices: ["エベレスト", "富士山", "阿蘇山", "高尾山"]
    },
    {
      level: "jh1",
      answer: "寿司",
      questions: [
        "You eat it with soy sauce.",
        "You can eat it at a restaurant with plates that go around.",
        "This food is made with rice and fish."
      ],
      translations: [
        "醤油と一緒に食べます。",
        "お皿が回転するレストランで食べられます。",
        "この食べ物はお米と魚で作られます。"
      ],
      keywords: [
        { word: "soy sauce", meaning: "醤油", note: "soy は「大豆」という意味" },
        { word: "restaurant", meaning: "レストラン", note: "食事をするお店" },
        { word: "rice", meaning: "お米・ごはん", note: "日本の主食" }
      ],
      choices: ["ラーメン", "天ぷら", "寿司", "うどん"]
    },
    {
      level: "jh1",
      answer: "桜",
      questions: [
        "The flowers only last about one week.",
        "People eat and drink under these trees.",
        "These pink flowers bloom in spring."
      ],
      translations: [
        "花は約1週間しかもちません。",
        "この木の下で飲み食いします。",
        "春に咲くピンクの花です。"
      ],
      keywords: [
        { word: "last", meaning: "続く・もつ", note: "期間を表す動詞" },
        { word: "under", meaning: "〜の下で", note: "位置を表す言葉" },
        { word: "bloom", meaning: "咲く", note: "花が開くこと" }
      ],
      choices: ["バラ", "桜", "ひまわり", "チューリップ"]
    },
    {
      level: "jh1",
      answer: "電車",
      questions: [
        "It is very crowded in the morning in Japan.",
        "It stops at many stations.",
        "People ride this to go to work or school."
      ],
      translations: [
        "日本の朝はとても混んでいます。",
        "たくさんの駅に止まります。",
        "通勤・通学に乗ります。"
      ],
      keywords: [
        { word: "crowded", meaning: "混雑した", note: "人がたくさんいる状態" },
        { word: "station", meaning: "駅", note: "電車が止まる場所" },
        { word: "ride", meaning: "乗る", note: "乗り物に乗ること" }
      ],
      choices: ["バス", "タクシー", "電車", "飛行機"]
    },
    {
      level: "jh1",
      answer: "チョコレート",
      questions: [
        "It is made from cacao beans.",
        "Girls give this to boys on February 14th in Japan.",
        "This sweet candy is brown."
      ],
      translations: [
        "カカオ豆から作られます。",
        "日本で2月14日に女の子が男の子にあげます。",
        "この甘いお菓子は茶色です。"
      ],
      keywords: [
        { word: "bean", meaning: "豆", note: "小さくて丸い食べ物" },
        { word: "give", meaning: "あげる", note: "人に何かを渡すこと" },
        { word: "sweet", meaning: "甘い", note: "味を表す言葉。反対は bitter（苦い）" }
      ],
      choices: ["クッキー", "ケーキ", "アイスクリーム", "チョコレート"]
    },
    {
      level: "jh1",
      answer: "時計",
      questions: [
        "You can wear it on your arm.",
        "It has two hands and numbers 1 to 12.",
        "This tells you the time."
      ],
      translations: [
        "腕につけられます。",
        "2本の針と1から12の数字があります。",
        "時間を教えてくれます。"
      ],
      keywords: [
        { word: "wear", meaning: "身につける", note: "服や時計をつけること" },
        { word: "hand", meaning: "針", note: "時計の針のこと。「手」の意味もある" },
        { word: "time", meaning: "時間", note: "何時何分を表すもの" }
      ],
      choices: ["時計", "カレンダー", "砂時計", "温度計"]
    },
    {
      level: "jh1",
      answer: "ペンギン",
      questions: [
        "It lives in cold places and walks in a cute way.",
        "It cannot fly but it can swim well.",
        "This bird is black and white."
      ],
      translations: [
        "寒い場所に住んでいてかわいい歩き方をします。",
        "飛べないけど泳ぎが上手です。",
        "この鳥は白黒です。"
      ],
      keywords: [
        { word: "cold", meaning: "寒い", note: "温度が低いこと" },
        { word: "fly", meaning: "飛ぶ", note: "空を飛ぶこと" },
        { word: "black and white", meaning: "白黒の", note: "2色を表す表現" }
      ],
      choices: ["ペンギン", "フラミンゴ", "アヒル", "ワシ"]
    },
    {
      level: "jh1",
      answer: "消しゴム",
      questions: [
        "This small white thing is in your pencil case.",
        "It can erase pencil marks.",
        "You use this when you make a mistake with a pencil."
      ],
      translations: [
        "筆箱の中にある小さくて白いものです。",
        "鉛筆の跡を消せます。",
        "鉛筆で間違えたとき使います。"
      ],
      keywords: [
        { word: "pencil case", meaning: "筆箱", note: "文房具を入れるケース" },
        { word: "erase", meaning: "消す", note: "書いたものを消すこと" },
        { word: "mistake", meaning: "間違い", note: "正しくないこと。make a mistake（間違える）" }
      ],
      choices: ["鉛筆", "定規", "消しゴム", "ノート"]
    },
    {
      level: "jh1",
      answer: "図書館",
      questions: [
        "It is a quiet building with many shelves.",
        "Students go there to study and do homework.",
        "You can borrow books for free at this place."
      ],
      translations: [
        "たくさんの棚がある静かな建物です。",
        "生徒が勉強や宿題をしに行きます。",
        "無料で本を借りられる場所です。"
      ],
      keywords: [
        { word: "quiet", meaning: "静かな", note: "音がしない状態" },
        { word: "homework", meaning: "宿題", note: "home（家）+ work（仕事）" },
        { word: "borrow", meaning: "借りる", note: "返す前提で借りること" }
      ],
      choices: ["学校", "図書館", "本屋", "博物館"]
    },
    {
      level: "jh1",
      answer: "カメラ",
      questions: [
        "Everyone has this in their smartphone now.",
        "You press a button to use it.",
        "You use this to take pictures."
      ],
      translations: [
        "今はみんなのスマホにこれがあります。",
        "ボタンを押して使います。",
        "写真を撮るために使います。"
      ],
      keywords: [
        { word: "smartphone", meaning: "スマートフォン", note: "みんなが持っている電話" },
        { word: "button", meaning: "ボタン", note: "押すもの" },
        { word: "picture", meaning: "写真・絵", note: "take a picture で「写真を撮る」" }
      ],
      choices: ["テレビ", "カメラ", "ラジオ", "ビデオ"]
    },
    {
      level: "jh1",
      answer: "地図",
      questions: [
        "Travelers always carry this with them.",
        "It shows streets and buildings.",
        "You look at this to find a place."
      ],
      translations: [
        "旅行者はいつもこれを持っています。",
        "道路や建物が載っています。",
        "場所を見つけるためにこれを見ます。"
      ],
      keywords: [
        { word: "traveler", meaning: "旅行者", note: "旅をする人" },
        { word: "street", meaning: "通り・道", note: "車や人が通る道" },
        { word: "find", meaning: "見つける", note: "探しているものを見つけること" }
      ],
      choices: ["教科書", "辞書", "地図", "ガイドブック"]
    },
    {
      level: "jh1",
      answer: "新幹線",
      questions: [
        "This goes very fast between big cities.",
        "It looks like a long white and blue snake.",
        "This is the fastest train in Japan."
      ],
      translations: [
        "大きな都市の間をとても速く走ります。",
        "長い白と青のヘビのように見えます。",
        "日本で一番速い電車です。"
      ],
      keywords: [
        { word: "fast", meaning: "速い", note: "スピードが速いこと" },
        { word: "between", meaning: "〜の間", note: "2つのものの間" },
        { word: "fastest", meaning: "一番速い", note: "fast の最上級" }
      ],
      choices: ["バス", "地下鉄", "新幹線", "飛行機"]
    },
    {
      level: "jh1",
      answer: "お弁当",
      questions: [
        "Your mother or father makes this for you in the morning.",
        "You open a box and eat it at lunchtime.",
        "This is a Japanese lunch box with rice and side dishes."
      ],
      translations: [
        "朝、お父さんやお母さんが作ってくれます。",
        "昼に箱を開けて食べます。",
        "ごはんとおかずが入った日本のランチボックスです。"
      ],
      keywords: [
        { word: "morning", meaning: "朝", note: "一日の始まりの時間" },
        { word: "lunchtime", meaning: "昼食の時間", note: "お昼ごはんの時間" },
        { word: "side dish", meaning: "おかず", note: "ごはんと一緒に食べるもの" }
      ],
      choices: ["おにぎり", "お弁当", "サンドイッチ", "カップラーメン"]
    },

    // ===========================
    // 中学3年レベル (jh3)
    // ===========================
    {
      level: "jh3",
      answer: "りんご",
      questions: [
        "What fruit 'keeps the doctor away'?",
        "What fruit do you use to make juice or pie?",
        "What round fruit can be red, green, or yellow?"
      ],
      translations: [
        "「お医者さんを遠ざける」果物は何？",
        "ジュースやパイを作るのに使う果物は何？",
        "赤、緑、黄色になれる丸い果物は何？"
      ],
      keywords: [
        { word: "keep ~ away", meaning: "〜を遠ざける", note: "keep + 目的語 + away の形で使う" },
        { word: "pie", meaning: "パイ", note: "果物や肉を入れて焼いた料理" },
        { word: "round", meaning: "丸い", note: "形を表す形容詞。a round ball（丸いボール）" }
      ],
      choices: ["りんご", "みかん", "バナナ", "もも"]
    },
    {
      level: "jh3",
      answer: "猫",
      questions: [
        "What animal has soft fur and sharp claws?",
        "What pet loves to sleep and eat fish?",
        "What pet says 'meow' and catches mice?"
      ],
      translations: [
        "柔らかい毛と鋭い爪を持つ動物は何？",
        "寝ることと魚を食べることが好きなペットは何？",
        "「ニャー」と鳴いてネズミを捕まえるペットは何？"
      ],
      keywords: [
        { word: "sharp", meaning: "鋭い", note: "反対語は dull（鈍い）" },
        { word: "fur", meaning: "毛皮・体毛", note: "動物の柔らかい毛のこと" },
        { word: "catch", meaning: "捕まえる", note: "catch - caught - caught と変化する不規則動詞" }
      ],
      choices: ["犬", "猫", "うさぎ", "ハムスター"]
    },
    {
      level: "jh3",
      answer: "富士山",
      questions: [
        "What mountain has a beautiful shape with snow on top?",
        "What famous mountain can you see from Tokyo on a clear day?",
        "What is the tallest mountain in Japan?"
      ],
      translations: [
        "頂上に雪がある美しい形の山は何？",
        "晴れた日に東京から見える有名な山は何？",
        "日本で一番高い山は何？"
      ],
      keywords: [
        { word: "shape", meaning: "形", note: "物の外見の形を表す名詞" },
        { word: "clear", meaning: "晴れた・澄んだ", note: "天気や空気がきれいな状態" },
        { word: "tallest", meaning: "一番高い", note: "tall の最上級。tall - taller - tallest" }
      ],
      choices: ["エベレスト", "富士山", "阿蘇山", "高尾山"]
    },
    {
      level: "jh3",
      answer: "寿司",
      questions: [
        "What do you eat with soy sauce and wasabi?",
        "What food can you eat at a restaurant where plates go around?",
        "What Japanese food is made with rice and raw fish?"
      ],
      translations: [
        "醤油とわさびと一緒に食べるものは何？",
        "お皿が回るレストランで食べられる食べ物は何？",
        "お米と生の魚で作る日本の食べ物は何？"
      ],
      keywords: [
        { word: "soy sauce", meaning: "醤油", note: "soy は「大豆」という意味" },
        { word: "plate", meaning: "皿", note: "食べ物を載せるお皿" },
        { word: "raw", meaning: "生の", note: "調理していない状態。raw fish（生魚）" }
      ],
      choices: ["ラーメン", "天ぷら", "寿司", "うどん"]
    },
    {
      level: "jh3",
      answer: "傘",
      questions: [
        "What can you fold and put in your bag?",
        "What do you hold above your head in the rain?",
        "What do you use to stay dry when it rains?"
      ],
      translations: [
        "たたんでカバンに入れられるものは何？",
        "雨の中、頭の上にかざすものは何？",
        "雨のとき濡れないために使うものは何？"
      ],
      keywords: [
        { word: "fold", meaning: "たたむ", note: "折りたたむ動作を表す動詞" },
        { word: "above", meaning: "〜の上に", note: "位置を表す前置詞。on より離れた上" },
        { word: "stay dry", meaning: "濡れないでいる", note: "stay + 形容詞 で「〜のままでいる」" }
      ],
      choices: ["帽子", "傘", "レインコート", "長靴"]
    },
    {
      level: "jh3",
      answer: "ピアノ",
      questions: [
        "What big instrument do many children learn to play?",
        "What do you play by pressing keys with your fingers?",
        "What instrument has black and white keys?"
      ],
      translations: [
        "多くの子供が習う大きな楽器は何？",
        "指で鍵盤を押して演奏するものは何？",
        "黒と白の鍵盤がある楽器は何？"
      ],
      keywords: [
        { word: "instrument", meaning: "楽器", note: "音楽を演奏する道具" },
        { word: "press", meaning: "押す", note: "ボタンや鍵盤を押す動作" },
        { word: "key", meaning: "鍵盤・鍵", note: "ピアノの鍵盤。カギという意味もある" }
      ],
      choices: ["ギター", "バイオリン", "ピアノ", "ドラム"]
    },
    {
      level: "jh3",
      answer: "月",
      questions: [
        "Where do rabbits live in Japanese stories?",
        "What changes shape from full to thin every month?",
        "What bright thing can you see in the night sky?"
      ],
      translations: [
        "日本の昔話でうさぎが住んでいる場所はどこ？",
        "毎月、満月から三日月へ形が変わるものは何？",
        "夜空に見える明るいものは何？"
      ],
      keywords: [
        { word: "rabbit", meaning: "うさぎ", note: "耳が長い小さな動物" },
        { word: "change", meaning: "変わる", note: "change shape で「形が変わる」" },
        { word: "bright", meaning: "明るい", note: "光を発するものに使う形容詞" }
      ],
      choices: ["太陽", "月", "星", "地球"]
    },
    {
      level: "jh3",
      answer: "自転車",
      questions: [
        "What do kids learn to ride without training wheels?",
        "What vehicle has two wheels but no engine?",
        "What do you ride by pushing pedals with your feet?"
      ],
      translations: [
        "子供が補助輪なしで乗れるように練習するものは何？",
        "二つの車輪があるけどエンジンがない乗り物は何？",
        "足でペダルをこいで乗るものは何？"
      ],
      keywords: [
        { word: "training wheels", meaning: "補助輪", note: "自転車の練習用の小さい車輪" },
        { word: "vehicle", meaning: "乗り物", note: "人や物を運ぶ道具" },
        { word: "pedal", meaning: "ペダル", note: "足で踏んで動かす部品" }
      ],
      choices: ["自動車", "バイク", "自転車", "スケートボード"]
    },
    {
      level: "jh3",
      answer: "桜",
      questions: [
        "What flowers only last about one week?",
        "What tree do Japanese people eat and drink under?",
        "What pink flowers bloom in spring in Japan?"
      ],
      translations: [
        "約1週間しかもたない花は何？",
        "日本人がその下で飲み食いする木は何？",
        "日本の春に咲くピンクの花は何？"
      ],
      keywords: [
        { word: "last", meaning: "続く・もつ", note: "期間を表す動詞。How long does it last?" },
        { word: "under", meaning: "〜の下で", note: "位置を表す前置詞" },
        { word: "bloom", meaning: "咲く", note: "花が開くこと。春の表現でよく使う" }
      ],
      choices: ["バラ", "桜", "ひまわり", "チューリップ"]
    },
    {
      level: "jh3",
      answer: "電車",
      questions: [
        "What is very crowded in the morning in Japan?",
        "What vehicle stops at many stations?",
        "What do people ride to go to work or school on tracks?"
      ],
      translations: [
        "日本の朝、とても混雑する乗り物は何？",
        "たくさんの駅に止まる乗り物は何？",
        "線路の上を走って通勤・通学に使う乗り物は何？"
      ],
      keywords: [
        { word: "crowded", meaning: "混雑した", note: "人がたくさんいる状態" },
        { word: "station", meaning: "駅", note: "電車が止まる場所" },
        { word: "track", meaning: "線路", note: "電車が走るレール" }
      ],
      choices: ["バス", "タクシー", "電車", "飛行機"]
    },
    {
      level: "jh3",
      answer: "虹",
      questions: [
        "What can you see when the sun comes out while it's raining?",
        "What has seven colors like red, orange, yellow, green, and blue?",
        "What colorful thing appears in the sky after rain?"
      ],
      translations: [
        "雨が降っているのに太陽が出たとき見えるものは何？",
        "赤、オレンジ、黄、緑、青など7色あるものは何？",
        "雨の後に空に現れるカラフルなものは何？"
      ],
      keywords: [
        { word: "while", meaning: "〜の間に", note: "2つのことが同時に起こるとき使う" },
        { word: "seven", meaning: "7", note: "数字の7。seven colors（7色）" },
        { word: "appear", meaning: "現れる", note: "見えるようになること。反対は disappear" }
      ],
      choices: ["雷", "虹", "雲", "オーロラ"]
    },
    {
      level: "jh3",
      answer: "カメラ",
      questions: [
        "What does everyone have in their phone now for photos?",
        "What do you press a button on to capture a moment?",
        "What do you use to take pictures?"
      ],
      translations: [
        "今ではみんなのスマホに入っている、写真用のものは何？",
        "ボタンを押して瞬間を記録するものは何？",
        "写真を撮るために使うものは何？"
      ],
      keywords: [
        { word: "phone", meaning: "電話・スマホ", note: "smartphone の略" },
        { word: "capture", meaning: "捉える・記録する", note: "瞬間や映像を記録すること" },
        { word: "take a picture", meaning: "写真を撮る", note: "take は「撮る」の意味で使う" }
      ],
      choices: ["テレビ", "カメラ", "望遠鏡", "ビデオ"]
    },
    {
      level: "jh3",
      answer: "地図",
      questions: [
        "What helps you find the way when you are lost?",
        "What does Google have on your phone to show roads and cities?",
        "What shows you where places are?"
      ],
      translations: [
        "迷ったとき道を見つける助けになるものは何？",
        "道路や街を表示するためにGoogleがスマホに入れているものは何？",
        "場所がどこにあるか教えてくれるものは何？"
      ],
      keywords: [
        { word: "lost", meaning: "迷った", note: "道がわからない状態。get lost で「迷う」" },
        { word: "road", meaning: "道路", note: "車や人が通る道" },
        { word: "place", meaning: "場所", note: "場所・位置を表す名詞" }
      ],
      choices: ["地図", "カレンダー", "時刻表", "辞書"]
    },
    {
      level: "jh3",
      answer: "チョコレート",
      questions: [
        "What is made from cacao and melts in your mouth?",
        "What do girls give boys on February 14th in Japan?",
        "What sweet brown candy do kids love?"
      ],
      translations: [
        "カカオから作られて口の中で溶けるものは何？",
        "日本で2月14日に女の子が男の子にあげるものは何？",
        "子供が大好きな甘くて茶色いお菓子は何？"
      ],
      keywords: [
        { word: "melt", meaning: "溶ける", note: "固体が液体になること" },
        { word: "give", meaning: "あげる", note: "give - gave - given と変化する不規則動詞" },
        { word: "sweet", meaning: "甘い", note: "味を表す形容詞。反対は bitter（苦い）" }
      ],
      choices: ["クッキー", "ケーキ", "アイスクリーム", "チョコレート"]
    },
    {
      level: "jh3",
      answer: "時計",
      questions: [
        "What do you hang on the wall that has two hands?",
        "What do you wear on your arm to know the time?",
        "What tells you the time with numbers 1 to 12?"
      ],
      translations: [
        "壁に掛ける、2本の針があるものは何？",
        "時間を知るために腕につけるものは何？",
        "1から12の数字で時間を教えてくれるものは何？"
      ],
      keywords: [
        { word: "hang", meaning: "掛ける", note: "壁などにぶら下げること" },
        { word: "wear", meaning: "身につける", note: "服やアクセサリーを着けること" },
        { word: "tell the time", meaning: "時間を教える", note: "tell は「教える・伝える」" }
      ],
      choices: ["時計", "カレンダー", "砂時計", "温度計"]
    }
  ];

  let currentQuestions = [];
  let currentIndex = 0;
  let currentLevel = null;
  let hintsRevealed = 1;

  const QUESTIONS_PER_GAME = 5;

  function getLevels() {
    return LEVELS;
  }

  function prepareGame(questionList, level) {
    currentLevel = level || null;

    if (questionList) {
      currentQuestions = [...questionList].sort(() => Math.random() - 0.5);
    } else if (level) {
      const levelQuestions = allQuestions.filter(q => q.level === level);
      const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5);
      currentQuestions = shuffled.slice(0, QUESTIONS_PER_GAME);
    } else {
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      currentQuestions = shuffled.slice(0, QUESTIONS_PER_GAME);
    }
    currentQuestions.forEach(q => {
      q.shuffledChoices = [...q.choices].sort(() => Math.random() - 0.5);
    });
    currentIndex = 0;
    hintsRevealed = 1;
  }

  function getCurrentQuestion() {
    return currentQuestions[currentIndex];
  }

  function nextQuestion() {
    currentIndex++;
    hintsRevealed = 1;
    return currentIndex < currentQuestions.length;
  }

  function revealNextHint() {
    if (hintsRevealed < 3) {
      hintsRevealed++;
    }
    return hintsRevealed;
  }

  function getHintsRevealed() {
    return hintsRevealed;
  }

  function getProgress() {
    return {
      current: currentIndex + 1,
      total: currentQuestions.length
    };
  }

  function getCurrentLevel() {
    return currentLevel;
  }

  function getQuestionsByAnswers(answers, level) {
    let pool = allQuestions;
    if (level) {
      pool = pool.filter(q => q.level === level);
    }
    return pool.filter(q => answers.includes(q.answer));
  }

  function getAllQuestionsForLevel(level) {
    return allQuestions.filter(q => q.level === level);
  }

  return {
    getLevels,
    prepareGame,
    getCurrentQuestion,
    nextQuestion,
    revealNextHint,
    getHintsRevealed,
    getProgress,
    getCurrentLevel,
    getQuestionsByAnswers,
    getAllQuestionsForLevel
  };
})();
