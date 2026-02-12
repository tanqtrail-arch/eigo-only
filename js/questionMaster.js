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
    },
    {
      level: "jh3",
      answer: "サッカー",
      questions: [
        "What sport has the World Cup as its biggest event?",
        "In what sport can you NOT use your hands?",
        "What sport do you play by kicking a ball into a goal?"
      ],
      translations: [
        "ワールドカップが最大のイベントであるスポーツは何？",
        "手を使ってはいけないスポーツは何？",
        "ボールをゴールに蹴り入れるスポーツは何？"
      ],
      keywords: [
        { word: "World Cup", meaning: "ワールドカップ", note: "世界最大のサッカー大会" },
        { word: "hand", meaning: "手", note: "体の一部。左右にある" },
        { word: "kick", meaning: "蹴る", note: "足でボールを蹴る動作" }
      ],
      choices: ["野球", "サッカー", "バスケットボール", "テニス"]
    },
    {
      level: "jh3",
      answer: "冷蔵庫",
      questions: [
        "What runs all day and night to stop food from going bad?",
        "Where do you put milk, eggs, and vegetables to keep them fresh?",
        "What big machine in the kitchen keeps food cold?"
      ],
      translations: [
        "食べ物が腐らないように一日中動いているものは何？",
        "牛乳、卵、野菜を新鮮に保つためにどこに入れる？",
        "台所にある食べ物を冷たく保つ大きな機械は何？"
      ],
      keywords: [
        { word: "go bad", meaning: "腐る", note: "食べ物が悪くなること" },
        { word: "fresh", meaning: "新鮮な", note: "食べ物が良い状態であること" },
        { word: "kitchen", meaning: "台所", note: "料理をする場所" }
      ],
      choices: ["電子レンジ", "冷蔵庫", "洗濯機", "エアコン"]
    },
    {
      level: "jh3",
      answer: "ペンギン",
      questions: [
        "What bird can you see at aquariums swimming very fast?",
        "What cute bird lives near ice and walks in a funny way?",
        "What black and white bird cannot fly but loves to swim?"
      ],
      translations: [
        "水族館でとても速く泳いでいるのを見られる鳥は何？",
        "氷の近くに住んでいて面白い歩き方をするかわいい鳥は何？",
        "飛べないけど泳ぐのが好きな白黒の鳥は何？"
      ],
      keywords: [
        { word: "aquarium", meaning: "水族館", note: "海の生き物を見られる施設" },
        { word: "funny", meaning: "おかしい・面白い", note: "笑いを誘うようなおかしさ" },
        { word: "fly", meaning: "飛ぶ", note: "fly - flew - flown と変化する不規則動詞" }
      ],
      choices: ["ペンギン", "フラミンゴ", "アヒル", "ワシ"]
    },
    {
      level: "jh3",
      answer: "太陽",
      questions: [
        "What gives us light and heat every day?",
        "What rises in the east and sets in the west?",
        "What is the bright thing in the sky during the day?"
      ],
      translations: [
        "毎日私たちに光と熱を与えてくれるものは何？",
        "東から昇って西に沈むものは何？",
        "昼間、空にある明るいものは何？"
      ],
      keywords: [
        { word: "heat", meaning: "熱", note: "温かさ・暑さを表す名詞" },
        { word: "rise", meaning: "昇る", note: "rise - rose - risen。太陽が昇ること" },
        { word: "bright", meaning: "明るい", note: "光を発するものに使う形容詞" }
      ],
      choices: ["月", "太陽", "火星", "北極星"]
    },
    {
      level: "jh3",
      answer: "消しゴム",
      questions: [
        "What do you always find in a pencil case at school?",
        "What small white thing can rub out pencil marks?",
        "What do you use when you write something wrong with a pencil?"
      ],
      translations: [
        "学校の筆箱の中に必ずあるものは何？",
        "鉛筆の跡を消せる小さくて白いものは何？",
        "鉛筆で間違えて書いたとき何を使う？"
      ],
      keywords: [
        { word: "pencil case", meaning: "筆箱", note: "文房具を入れるケース" },
        { word: "rub out", meaning: "こすって消す", note: "rub は「こする」という動詞" },
        { word: "wrong", meaning: "間違った", note: "正しくない状態。反対は right" }
      ],
      choices: ["鉛筆", "定規", "消しゴム", "ノート"]
    },
    {
      level: "jh3",
      answer: "新幹線",
      questions: [
        "How can you go from Tokyo to Osaka in about 2 hours?",
        "What train looks like a bullet and is white and blue?",
        "What is the fastest train in Japan?"
      ],
      translations: [
        "東京から大阪まで約2時間で行ける方法は何？",
        "弾丸のような形で白と青色の電車は何？",
        "日本で一番速い電車は何？"
      ],
      keywords: [
        { word: "about", meaning: "約・だいたい", note: "おおよその数を表すときに使う" },
        { word: "bullet", meaning: "弾丸", note: "bullet train で「新幹線」" },
        { word: "fastest", meaning: "一番速い", note: "fast の最上級。fast - faster - fastest" }
      ],
      choices: ["地下鉄", "モノレール", "新幹線", "路面電車"]
    },
    {
      level: "jh3",
      answer: "図書館",
      questions: [
        "What building has many books and you must be quiet in?",
        "Where do you go to read and study after school?",
        "Where can you borrow books for free?"
      ],
      translations: [
        "たくさんの本があって静かにしなければならない建物は何？",
        "放課後に読書や勉強をしに行く場所はどこ？",
        "無料で本を借りられる場所はどこ？"
      ],
      keywords: [
        { word: "quiet", meaning: "静かな", note: "音を立てない状態。Be quiet!（静かに！）" },
        { word: "after school", meaning: "放課後", note: "学校が終わった後の時間" },
        { word: "borrow", meaning: "借りる", note: "無料で借りる。有料で借りるは rent" }
      ],
      choices: ["本屋", "学校", "図書館", "博物館"]
    },
    {
      level: "jh3",
      answer: "餃子",
      questions: [
        "What popular food came from China and is loved in Japan too?",
        "What can you fry, boil, or steam and dip in soy sauce?",
        "What small food has meat inside thin dough?"
      ],
      translations: [
        "中国から来て日本でも愛されている人気の食べ物は何？",
        "焼いたり茹でたり蒸したりして醤油につけて食べるものは何？",
        "薄い皮の中に肉が入っている小さな食べ物は何？"
      ],
      keywords: [
        { word: "popular", meaning: "人気の", note: "多くの人に好かれていること" },
        { word: "fry", meaning: "焼く・揚げる", note: "油を使って調理すること" },
        { word: "dough", meaning: "生地", note: "パンや餃子の皮の材料。発音は「ドウ」" }
      ],
      choices: ["シュウマイ", "餃子", "春巻き", "肉まん"]
    },
    {
      level: "jh3",
      answer: "眼鏡",
      questions: [
        "What helps people who cannot see clearly?",
        "What has two round glass parts and sits on your nose?",
        "What do you wear on your face to see better?"
      ],
      translations: [
        "はっきり見えない人を助けるものは何？",
        "丸いガラスが2つあって鼻の上に乗せるものは何？",
        "よく見えるように顔につけるものは何？"
      ],
      keywords: [
        { word: "clearly", meaning: "はっきりと", note: "clear の副詞形。I can see clearly.（はっきり見える）" },
        { word: "glass", meaning: "ガラス・レンズ", note: "透明な素材。glasses で「眼鏡」" },
        { word: "wear", meaning: "かける・身につける", note: "メガネや服など身につけるもの全般に使う" }
      ],
      choices: ["サングラス", "望遠鏡", "眼鏡", "コンタクトレンズ"]
    },
    {
      level: "jh3",
      answer: "お正月",
      questions: [
        "What holiday do people celebrate by eating mochi and visiting shrines?",
        "When do children get otoshidama (money) from their family?",
        "What is the most important holiday in Japan on January 1st?"
      ],
      translations: [
        "お餅を食べて神社にお参りして祝う祝日は何？",
        "子供が家族からお年玉をもらうのはいつ？",
        "1月1日の日本で最も大切な祝日は何？"
      ],
      keywords: [
        { word: "celebrate", meaning: "祝う", note: "お祝いすること" },
        { word: "shrine", meaning: "神社", note: "日本の宗教施設。temple は「お寺」" },
        { word: "holiday", meaning: "祝日", note: "お休みの日。vacation より短い休み" }
      ],
      choices: ["クリスマス", "お正月", "ひな祭り", "七夕"]
    },
    {
      level: "jh3",
      answer: "イルカ",
      questions: [
        "What sea animal makes clicking sounds and swims very fast?",
        "What friendly animal can you see doing tricks at aquariums?",
        "What smart sea animal jumps out of the water?"
      ],
      translations: [
        "カチカチという音を出してとても速く泳ぐ海の動物は何？",
        "水族館で芸をしているのを見られるフレンドリーな動物は何？",
        "水の中から飛び出す賢い海の動物は何？"
      ],
      keywords: [
        { word: "clicking", meaning: "カチカチという", note: "click は「カチッと鳴る」" },
        { word: "trick", meaning: "芸・技", note: "do tricks で「芸をする」" },
        { word: "smart", meaning: "賢い", note: "頭が良い。clever とほぼ同じ意味" }
      ],
      choices: ["クジラ", "サメ", "イルカ", "アザラシ"]
    },
    {
      level: "jh3",
      answer: "エレベーター",
      questions: [
        "What has buttons for each floor and doors that open by themselves?",
        "What do you ride when you don't want to use the stairs?",
        "What goes up and down inside a building?"
      ],
      translations: [
        "各階のボタンがあってドアが自動で開くものは何？",
        "階段を使いたくないとき乗るものは何？",
        "建物の中で上下に動くものは何？"
      ],
      keywords: [
        { word: "by themselves", meaning: "自動で・ひとりでに", note: "by oneself で「自分で」" },
        { word: "stairs", meaning: "階段", note: "常に複数形で使う" },
        { word: "floor", meaning: "階", note: "建物の階数。1st floor（1階）" }
      ],
      choices: ["エスカレーター", "エレベーター", "階段", "はしご"]
    },
    {
      level: "jh3",
      answer: "蜂蜜",
      questions: [
        "What natural food is very sweet and never goes bad?",
        "What can you put on pancakes or in hot drinks?",
        "What sweet yellow liquid do bees make from flowers?"
      ],
      translations: [
        "とても甘くて絶対に腐らない天然の食べ物は何？",
        "パンケーキや温かい飲み物に入れられるものは何？",
        "ハチが花から作る甘くて黄色い液体は何？"
      ],
      keywords: [
        { word: "natural", meaning: "天然の・自然の", note: "人工ではない、自然のままの" },
        { word: "pancake", meaning: "パンケーキ", note: "薄く焼いたケーキ" },
        { word: "bee", meaning: "ハチ", note: "蜂蜜を作る昆虫" }
      ],
      choices: ["砂糖", "メープルシロップ", "ジャム", "蜂蜜"]
    },
    {
      level: "jh3",
      answer: "恐竜",
      questions: [
        "What animals' bones can you see in museums?",
        "What is T-Rex the most famous example of?",
        "What very big animals lived millions of years ago?"
      ],
      translations: [
        "博物館で骨を見ることができる動物は何？",
        "ティラノサウルスが最も有名な例であるものは何？",
        "何百万年も前に生きていたとても大きな動物は何？"
      ],
      keywords: [
        { word: "bone", meaning: "骨", note: "体の中の硬い部分" },
        { word: "museum", meaning: "博物館", note: "歴史や自然を学べる施設" },
        { word: "million", meaning: "百万", note: "millions of 〜 で「何百万もの〜」" }
      ],
      choices: ["恐竜", "ドラゴン", "ワニ", "ゴジラ"]
    },
    {
      level: "jh3",
      answer: "風呂",
      questions: [
        "Where do you wash your body first, then sit in a tub?",
        "What do you use to relax in hot water after a long day?",
        "Where do Japanese people wash and sit in hot water every evening?"
      ],
      translations: [
        "最初に体を洗って、それから湯船に浸かる場所はどこ？",
        "長い1日の後にお湯でリラックスするために使うものは何？",
        "日本人が毎晩体を洗ってお湯に浸かる場所はどこ？"
      ],
      keywords: [
        { word: "tub", meaning: "湯船", note: "お湯を溜める入れ物。bathtub とも言う" },
        { word: "relax", meaning: "リラックスする", note: "くつろぐこと" },
        { word: "wash", meaning: "洗う", note: "体や物を洗う動作" }
      ],
      choices: ["プール", "風呂", "シャワー", "温泉"]
    }
  ];

  let currentQuestions = [];
  let currentIndex = 0;
  let currentLevel = null;
  let hintsRevealed = 1;

  const QUESTIONS_PER_GAME = 7;

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

  return {
    getLevels,
    prepareGame,
    getCurrentQuestion,
    nextQuestion,
    revealNextHint,
    getHintsRevealed,
    getProgress,
    getCurrentLevel,
    getQuestionsByAnswers
  };
})();
