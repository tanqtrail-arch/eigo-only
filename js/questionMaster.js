/**
 * QuestionMaster Agent
 * - お題を管理し、英語の質問文を3つ提供する
 * - 各問題に3つの英語質問文（中3レベル）+ 和訳 + キーワード解説を持つ
 */
const QuestionMaster = (() => {
  const allQuestions = [
    {
      answer: "りんご",
      questions: [
        "What round fruit can be red, green, or yellow?",
        "What fruit do you use to make juice or pie?",
        "What fruit 'keeps the doctor away'?"
      ],
      translations: [
        "赤、緑、黄色になれる丸い果物は何？",
        "ジュースやパイを作るのに使う果物は何？",
        "「お医者さんを遠ざける」果物は何？"
      ],
      keywords: [
        { word: "round", meaning: "丸い", note: "形を表す形容詞。a round ball（丸いボール）" },
        { word: "fruit", meaning: "果物", note: "食べ物の種類。複数形は fruits" },
        { word: "keep ~ away", meaning: "〜を遠ざける", note: "keep + 目的語 + away の形で使う" }
      ],
      choices: ["りんご", "みかん", "バナナ", "もも"]
    },
    {
      answer: "猫",
      questions: [
        "What pet says 'meow' and catches mice?",
        "What animal has soft fur and sharp claws?",
        "What pet loves to sleep and eat fish?"
      ],
      translations: [
        "「ニャー」と鳴いてネズミを捕まえるペットは何？",
        "柔らかい毛と鋭い爪を持つ動物は何？",
        "寝ることと魚を食べることが好きなペットは何？"
      ],
      keywords: [
        { word: "catch", meaning: "捕まえる", note: "catch - caught - caught と変化する不規則動詞" },
        { word: "fur", meaning: "毛皮・体毛", note: "動物の柔らかい毛のこと" },
        { word: "sharp", meaning: "鋭い", note: "反対語は dull（鈍い）" }
      ],
      choices: ["犬", "猫", "うさぎ", "ハムスター"]
    },
    {
      answer: "富士山",
      questions: [
        "What is the tallest mountain in Japan?",
        "What famous mountain can you see from Tokyo on a clear day?",
        "What mountain has a beautiful shape with snow on top?"
      ],
      translations: [
        "日本で一番高い山は何？",
        "晴れた日に東京から見える有名な山は何？",
        "頂上に雪がある美しい形の山は何？"
      ],
      keywords: [
        { word: "tallest", meaning: "一番高い", note: "tall の最上級。tall - taller - tallest" },
        { word: "clear", meaning: "晴れた・澄んだ", note: "天気や空気がきれいな状態" },
        { word: "shape", meaning: "形", note: "物の外見の形を表す名詞" }
      ],
      choices: ["エベレスト", "富士山", "阿蘇山", "高尾山"]
    },
    {
      answer: "寿司",
      questions: [
        "What Japanese food is made with rice and raw fish?",
        "What do you eat with soy sauce and wasabi?",
        "What food can you eat at a restaurant where plates go around?"
      ],
      translations: [
        "お米と生の魚で作る日本の食べ物は何？",
        "醤油とわさびと一緒に食べるものは何？",
        "お皿が回るレストランで食べられる食べ物は何？"
      ],
      keywords: [
        { word: "raw", meaning: "生の", note: "調理していない状態。raw fish（生魚）" },
        { word: "soy sauce", meaning: "醤油", note: "soy は「大豆」という意味" },
        { word: "plate", meaning: "皿", note: "食べ物を載せるお皿" }
      ],
      choices: ["ラーメン", "天ぷら", "寿司", "うどん"]
    },
    {
      answer: "傘",
      questions: [
        "What do you use to stay dry when it rains?",
        "What can you fold and put in your bag?",
        "What do you hold above your head in the rain?"
      ],
      translations: [
        "雨のとき濡れないために使うものは何？",
        "たたんでカバンに入れられるものは何？",
        "雨の中、頭の上にかざすものは何？"
      ],
      keywords: [
        { word: "stay dry", meaning: "濡れないでいる", note: "stay + 形容詞 で「〜のままでいる」" },
        { word: "fold", meaning: "たたむ", note: "折りたたむ動作を表す動詞" },
        { word: "above", meaning: "〜の上に", note: "位置を表す前置詞。on より離れた上" }
      ],
      choices: ["帽子", "傘", "レインコート", "長靴"]
    },
    {
      answer: "ピアノ",
      questions: [
        "What instrument has black and white keys?",
        "What do you play by pressing keys with your fingers?",
        "What big instrument do many children learn to play?"
      ],
      translations: [
        "黒と白の鍵盤がある楽器は何？",
        "指で鍵盤を押して演奏するものは何？",
        "多くの子供が習う大きな楽器は何？"
      ],
      keywords: [
        { word: "key", meaning: "鍵盤・鍵", note: "ピアノの鍵盤。カギという意味もある" },
        { word: "press", meaning: "押す", note: "ボタンや鍵盤を押す動作" },
        { word: "instrument", meaning: "楽器", note: "音楽を演奏する道具" }
      ],
      choices: ["ギター", "バイオリン", "ピアノ", "ドラム"]
    },
    {
      answer: "月",
      questions: [
        "What bright thing can you see in the night sky?",
        "What changes shape from full to thin every month?",
        "Where do rabbits live in Japanese stories?"
      ],
      translations: [
        "夜空に見える明るいものは何？",
        "毎月、満月から三日月へ形が変わるものは何？",
        "日本の昔話でうさぎが住んでいる場所はどこ？"
      ],
      keywords: [
        { word: "bright", meaning: "明るい", note: "光を発するものに使う形容詞" },
        { word: "change", meaning: "変わる", note: "change shape で「形が変わる」" },
        { word: "full", meaning: "満ちた", note: "full moon で「満月」" }
      ],
      choices: ["太陽", "月", "星", "地球"]
    },
    {
      answer: "自転車",
      questions: [
        "What do you ride by pushing pedals with your feet?",
        "What vehicle has two wheels but no engine?",
        "What do kids learn to ride without training wheels?"
      ],
      translations: [
        "足でペダルをこいで乗るものは何？",
        "二つの車輪があるけどエンジンがない乗り物は何？",
        "子供が補助輪なしで乗れるように練習するものは何？"
      ],
      keywords: [
        { word: "pedal", meaning: "ペダル", note: "足で踏んで動かす部品" },
        { word: "wheel", meaning: "車輪", note: "丸いタイヤの部分" },
        { word: "training wheels", meaning: "補助輪", note: "自転車の練習用の小さい車輪" }
      ],
      choices: ["自動車", "バイク", "自転車", "スケートボード"]
    },
    {
      answer: "桜",
      questions: [
        "What pink flowers bloom in spring in Japan?",
        "What tree do Japanese people eat and drink under?",
        "What flowers only last about one week?"
      ],
      translations: [
        "日本の春に咲くピンクの花は何？",
        "日本人がその下で飲み食いする木は何？",
        "約1週間しかもたない花は何？"
      ],
      keywords: [
        { word: "bloom", meaning: "咲く", note: "花が開くこと。春の表現でよく使う" },
        { word: "last", meaning: "続く・もつ", note: "期間を表す動詞。How long does it last?" },
        { word: "spring", meaning: "春", note: "四季の一つ。バネという意味もある" }
      ],
      choices: ["バラ", "桜", "ひまわり", "チューリップ"]
    },
    {
      answer: "電車",
      questions: [
        "What do people ride to go to work or school on tracks?",
        "What vehicle stops at many stations?",
        "What is very crowded in the morning in Japan?"
      ],
      translations: [
        "線路の上を走って通勤・通学に使う乗り物は何？",
        "たくさんの駅に止まる乗り物は何？",
        "日本の朝、とても混雑する乗り物は何？"
      ],
      keywords: [
        { word: "track", meaning: "線路", note: "電車が走るレール" },
        { word: "station", meaning: "駅", note: "電車が止まる場所" },
        { word: "crowded", meaning: "混雑した", note: "人がたくさんいる状態" }
      ],
      choices: ["バス", "タクシー", "電車", "飛行機"]
    },
    {
      answer: "虹",
      questions: [
        "What colorful thing appears in the sky after rain?",
        "What has seven colors like red, orange, yellow, green, and blue?",
        "What can you see when the sun comes out while it's raining?"
      ],
      translations: [
        "雨の後に空に現れるカラフルなものは何？",
        "赤、オレンジ、黄、緑、青など7色あるものは何？",
        "雨が降っているのに太陽が出たとき見えるものは何？"
      ],
      keywords: [
        { word: "appear", meaning: "現れる", note: "見えるようになること。反対は disappear" },
        { word: "colorful", meaning: "カラフルな", note: "color + ful で「色が豊かな」" },
        { word: "while", meaning: "〜の間に", note: "2つのことが同時に起こるとき使う" }
      ],
      choices: ["雷", "虹", "雲", "オーロラ"]
    },
    {
      answer: "カメラ",
      questions: [
        "What do you use to take pictures?",
        "What do you press a button on to capture a moment?",
        "What does everyone have in their phone now for photos?"
      ],
      translations: [
        "写真を撮るために使うものは何？",
        "ボタンを押して瞬間を記録するものは何？",
        "今ではみんなのスマホに入っている、写真用のものは何？"
      ],
      keywords: [
        { word: "take a picture", meaning: "写真を撮る", note: "take は「撮る」の意味で使う" },
        { word: "capture", meaning: "捉える・記録する", note: "瞬間や映像を記録すること" },
        { word: "moment", meaning: "瞬間", note: "ある一つの時点を表す名詞" }
      ],
      choices: ["テレビ", "カメラ", "望遠鏡", "ビデオ"]
    },
    {
      answer: "地図",
      questions: [
        "What shows you where places are?",
        "What helps you find the way when you are lost?",
        "What does Google have on your phone to show roads and cities?"
      ],
      translations: [
        "場所がどこにあるか教えてくれるものは何？",
        "迷ったとき道を見つける助けになるものは何？",
        "道路や街を表示するためにGoogleがスマホに入れているものは何？"
      ],
      keywords: [
        { word: "place", meaning: "場所", note: "場所・位置を表す名詞" },
        { word: "find the way", meaning: "道を見つける", note: "道順を知ること" },
        { word: "lost", meaning: "迷った", note: "道がわからない状態。get lost で「迷う」" }
      ],
      choices: ["地図", "カレンダー", "時刻表", "辞書"]
    },
    {
      answer: "チョコレート",
      questions: [
        "What sweet brown candy do kids love?",
        "What do girls give boys on February 14th in Japan?",
        "What is made from cacao and melts in your mouth?"
      ],
      translations: [
        "子供が大好きな甘くて茶色いお菓子は何？",
        "日本で2月14日に女の子が男の子にあげるものは何？",
        "カカオから作られて口の中で溶けるものは何？"
      ],
      keywords: [
        { word: "sweet", meaning: "甘い", note: "味を表す形容詞。反対は bitter（苦い）" },
        { word: "melt", meaning: "溶ける", note: "固体が液体になること" },
        { word: "give", meaning: "あげる", note: "give - gave - given と変化する不規則動詞" }
      ],
      choices: ["クッキー", "ケーキ", "アイスクリーム", "チョコレート"]
    },
    {
      answer: "時計",
      questions: [
        "What tells you the time with numbers 1 to 12?",
        "What do you wear on your arm to know the time?",
        "What do you hang on the wall that has two hands?"
      ],
      translations: [
        "1から12の数字で時間を教えてくれるものは何？",
        "時間を知るために腕につけるものは何？",
        "壁に掛ける、2本の針があるものは何？"
      ],
      keywords: [
        { word: "tell the time", meaning: "時間を教える", note: "tell は「教える・伝える」" },
        { word: "wear", meaning: "身につける", note: "服やアクセサリーを着けること" },
        { word: "hand", meaning: "針", note: "時計の針。「手」という意味もある" }
      ],
      choices: ["時計", "カレンダー", "砂時計", "温度計"]
    },
    {
      answer: "サッカー",
      questions: [
        "What sport do you play by kicking a ball into a goal?",
        "What sport has the World Cup as its biggest event?",
        "In what sport can you NOT use your hands?"
      ],
      translations: [
        "ボールをゴールに蹴り入れるスポーツは何？",
        "ワールドカップが最大のイベントであるスポーツは何？",
        "手を使ってはいけないスポーツは何？"
      ],
      keywords: [
        { word: "kick", meaning: "蹴る", note: "足でボールを蹴る動作" },
        { word: "goal", meaning: "ゴール", note: "得点する場所。目標という意味もある" },
        { word: "sport", meaning: "スポーツ", note: "運動・競技を表す名詞" }
      ],
      choices: ["野球", "サッカー", "バスケットボール", "テニス"]
    },
    {
      answer: "冷蔵庫",
      questions: [
        "What big machine in the kitchen keeps food cold?",
        "Where do you put milk, eggs, and vegetables to keep them fresh?",
        "What runs all day and night to stop food from going bad?"
      ],
      translations: [
        "台所にある食べ物を冷たく保つ大きな機械は何？",
        "牛乳、卵、野菜を新鮮に保つためにどこに入れる？",
        "食べ物が腐らないように一日中動いているものは何？"
      ],
      keywords: [
        { word: "keep", meaning: "保つ", note: "keep + O + 形容詞 で「Oを〜に保つ」" },
        { word: "fresh", meaning: "新鮮な", note: "食べ物が良い状態であること" },
        { word: "go bad", meaning: "腐る", note: "食べ物が悪くなること" }
      ],
      choices: ["電子レンジ", "冷蔵庫", "洗濯機", "エアコン"]
    },
    {
      answer: "ペンギン",
      questions: [
        "What black and white bird cannot fly but loves to swim?",
        "What cute bird lives near ice and walks in a funny way?",
        "What bird can you see at aquariums swimming very fast?"
      ],
      translations: [
        "飛べないけど泳ぐのが好きな白黒の鳥は何？",
        "氷の近くに住んでいて面白い歩き方をするかわいい鳥は何？",
        "水族館でとても速く泳いでいるのを見られる鳥は何？"
      ],
      keywords: [
        { word: "fly", meaning: "飛ぶ", note: "fly - flew - flown と変化する不規則動詞" },
        { word: "swim", meaning: "泳ぐ", note: "swim - swam - swum と変化する不規則動詞" },
        { word: "funny", meaning: "おかしい・面白い", note: "笑いを誘うようなおかしさ" }
      ],
      choices: ["ペンギン", "フラミンゴ", "アヒル", "ワシ"]
    },
    {
      answer: "太陽",
      questions: [
        "What is the bright thing in the sky during the day?",
        "What rises in the east and sets in the west?",
        "What gives us light and heat every day?"
      ],
      translations: [
        "昼間、空にある明るいものは何？",
        "東から昇って西に沈むものは何？",
        "毎日私たちに光と熱を与えてくれるものは何？"
      ],
      keywords: [
        { word: "rise", meaning: "昇る", note: "rise - rose - risen。太陽が昇ること" },
        { word: "set", meaning: "沈む", note: "太陽が沈むこと。The sun sets.（日が沈む）" },
        { word: "heat", meaning: "熱", note: "温かさ・暑さを表す名詞" }
      ],
      choices: ["月", "太陽", "火星", "北極星"]
    },
    {
      answer: "消しゴム",
      questions: [
        "What do you use when you write something wrong with a pencil?",
        "What small white thing can rub out pencil marks?",
        "What do you always find in a pencil case at school?"
      ],
      translations: [
        "鉛筆で間違えて書いたとき何を使う？",
        "鉛筆の跡を消せる小さくて白いものは何？",
        "学校の筆箱の中に必ずあるものは何？"
      ],
      keywords: [
        { word: "wrong", meaning: "間違った", note: "正しくない状態。反対は right" },
        { word: "rub out", meaning: "こすって消す", note: "rub は「こする」という動詞" },
        { word: "pencil case", meaning: "筆箱", note: "文房具を入れるケース" }
      ],
      choices: ["鉛筆", "定規", "消しゴム", "ノート"]
    },
    {
      answer: "新幹線",
      questions: [
        "What is the fastest train in Japan?",
        "What train looks like a bullet and is white and blue?",
        "How can you go from Tokyo to Osaka in about 2 hours?"
      ],
      translations: [
        "日本で一番速い電車は何？",
        "弾丸のような形で白と青色の電車は何？",
        "東京から大阪まで約2時間で行ける方法は何？"
      ],
      keywords: [
        { word: "fastest", meaning: "一番速い", note: "fast の最上級。fast - faster - fastest" },
        { word: "bullet", meaning: "弾丸", note: "bullet train で「新幹線」" },
        { word: "about", meaning: "約・だいたい", note: "おおよその数を表すときに使う" }
      ],
      choices: ["地下鉄", "モノレール", "新幹線", "路面電車"]
    },
    {
      answer: "図書館",
      questions: [
        "Where can you borrow books for free?",
        "What building has many books and you must be quiet in?",
        "Where do you go to read and study after school?"
      ],
      translations: [
        "無料で本を借りられる場所はどこ？",
        "たくさんの本があって静かにしなければならない建物は何？",
        "放課後に読書や勉強をしに行く場所はどこ？"
      ],
      keywords: [
        { word: "borrow", meaning: "借りる", note: "無料で借りる。有料で借りるは rent" },
        { word: "quiet", meaning: "静かな", note: "音を立てない状態。Be quiet!（静かに！）" },
        { word: "for free", meaning: "無料で", note: "お金がかからないこと" }
      ],
      choices: ["本屋", "学校", "図書館", "博物館"]
    },
    {
      answer: "餃子",
      questions: [
        "What small food has meat inside thin dough?",
        "What can you fry, boil, or steam and dip in soy sauce?",
        "What popular food came from China and is loved in Japan too?"
      ],
      translations: [
        "薄い皮の中に肉が入っている小さな食べ物は何？",
        "焼いたり茹でたり蒸したりして醤油につけて食べるものは何？",
        "中国から来て日本でも愛されている人気の食べ物は何？"
      ],
      keywords: [
        { word: "dough", meaning: "生地", note: "パンや餃子の皮の材料。発音は「ドウ」" },
        { word: "fry", meaning: "焼く・揚げる", note: "油を使って調理すること" },
        { word: "dip", meaning: "つける", note: "ソースなどにちょっとつける動作" }
      ],
      choices: ["シュウマイ", "餃子", "春巻き", "肉まん"]
    },
    {
      answer: "眼鏡",
      questions: [
        "What do you wear on your face to see better?",
        "What has two round glass parts and sits on your nose?",
        "What helps people who cannot see clearly?"
      ],
      translations: [
        "よく見えるように顔につけるものは何？",
        "丸いガラスが2つあって鼻の上に乗せるものは何？",
        "はっきり見えない人を助けるものは何？"
      ],
      keywords: [
        { word: "wear", meaning: "かける・身につける", note: "メガネや服など身につけるもの全般に使う" },
        { word: "clearly", meaning: "はっきりと", note: "clear の副詞形。I can see clearly.（はっきり見える）" },
        { word: "glasses", meaning: "眼鏡", note: "2枚のレンズがあるので複数形で使う" }
      ],
      choices: ["サングラス", "望遠鏡", "眼鏡", "コンタクトレンズ"]
    },
    {
      answer: "お正月",
      questions: [
        "What is the most important holiday in Japan on January 1st?",
        "When do children get otoshidama (money) from their family?",
        "What holiday do people celebrate by eating mochi and visiting shrines?"
      ],
      translations: [
        "1月1日の日本で最も大切な祝日は何？",
        "子供が家族からお年玉をもらうのはいつ？",
        "お餅を食べて神社にお参りして祝う祝日は何？"
      ],
      keywords: [
        { word: "holiday", meaning: "祝日", note: "お休みの日。vacation より短い休み" },
        { word: "celebrate", meaning: "祝う", note: "お祝いすること" },
        { word: "shrine", meaning: "神社", note: "日本の宗教施設。temple は「お寺」" }
      ],
      choices: ["クリスマス", "お正月", "ひな祭り", "七夕"]
    },
    {
      answer: "イルカ",
      questions: [
        "What smart sea animal jumps out of the water?",
        "What friendly animal can you see doing tricks at aquariums?",
        "What sea animal makes clicking sounds and swims very fast?"
      ],
      translations: [
        "水の中から飛び出す賢い海の動物は何？",
        "水族館で芸をしているのを見られるフレンドリーな動物は何？",
        "カチカチという音を出してとても速く泳ぐ海の動物は何？"
      ],
      keywords: [
        { word: "smart", meaning: "賢い", note: "頭が良い。clever とほぼ同じ意味" },
        { word: "friendly", meaning: "フレンドリーな", note: "friend + ly で「友好的な」" },
        { word: "trick", meaning: "芸・技", note: "do tricks で「芸をする」" }
      ],
      choices: ["クジラ", "サメ", "イルカ", "アザラシ"]
    },
    {
      answer: "エレベーター",
      questions: [
        "What goes up and down inside a building?",
        "What do you ride when you don't want to use the stairs?",
        "What has buttons for each floor and doors that open by themselves?"
      ],
      translations: [
        "建物の中で上下に動くものは何？",
        "階段を使いたくないとき乗るものは何？",
        "各階のボタンがあってドアが自動で開くものは何？"
      ],
      keywords: [
        { word: "floor", meaning: "階", note: "建物の階数。1st floor（1階）" },
        { word: "stairs", meaning: "階段", note: "常に複数形で使う" },
        { word: "by themselves", meaning: "自動で・ひとりでに", note: "by oneself で「自分で」" }
      ],
      choices: ["エスカレーター", "エレベーター", "階段", "はしご"]
    },
    {
      answer: "蜂蜜",
      questions: [
        "What sweet yellow liquid do bees make from flowers?",
        "What can you put on pancakes or in hot drinks?",
        "What natural food is very sweet and never goes bad?"
      ],
      translations: [
        "ハチが花から作る甘くて黄色い液体は何？",
        "パンケーキや温かい飲み物に入れられるものは何？",
        "とても甘くて絶対に腐らない天然の食べ物は何？"
      ],
      keywords: [
        { word: "bee", meaning: "ハチ", note: "蜂蜜を作る昆虫" },
        { word: "liquid", meaning: "液体", note: "水のように流れる状態のもの" },
        { word: "natural", meaning: "天然の・自然の", note: "人工ではない、自然のままの" }
      ],
      choices: ["砂糖", "メープルシロップ", "ジャム", "蜂蜜"]
    },
    {
      answer: "恐竜",
      questions: [
        "What very big animals lived millions of years ago?",
        "What is T-Rex the most famous example of?",
        "What animals' bones can you see in museums?"
      ],
      translations: [
        "何百万年も前に生きていたとても大きな動物は何？",
        "ティラノサウルスが最も有名な例であるものは何？",
        "博物館で骨を見ることができる動物は何？"
      ],
      keywords: [
        { word: "million", meaning: "百万", note: "millions of 〜 で「何百万もの〜」" },
        { word: "bone", meaning: "骨", note: "体の中の硬い部分" },
        { word: "museum", meaning: "博物館", note: "歴史や自然を学べる施設" }
      ],
      choices: ["恐竜", "ドラゴン", "ワニ", "ゴジラ"]
    },
    {
      answer: "風呂",
      questions: [
        "Where do Japanese people wash and sit in hot water every evening?",
        "What do you use to relax in hot water after a long day?",
        "Where do you wash your body first, then sit in a tub?"
      ],
      translations: [
        "日本人が毎晩体を洗ってお湯に浸かる場所はどこ？",
        "長い1日の後にお湯でリラックスするために使うものは何？",
        "最初に体を洗って、それから湯船に浸かる場所はどこ？"
      ],
      keywords: [
        { word: "wash", meaning: "洗う", note: "体や物を洗う動作" },
        { word: "relax", meaning: "リラックスする", note: "くつろぐこと" },
        { word: "tub", meaning: "湯船", note: "お湯を溜める入れ物。bathtub とも言う" }
      ],
      choices: ["プール", "風呂", "シャワー", "温泉"]
    }
  ];

  let currentQuestions = [];
  let currentIndex = 0;

  const QUESTIONS_PER_GAME = 7;

  function prepareGame(questionList) {
    if (questionList) {
      // 復習モード: 指定された問題リストを使用
      currentQuestions = [...questionList].sort(() => Math.random() - 0.5);
    } else {
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      currentQuestions = shuffled.slice(0, QUESTIONS_PER_GAME);
    }
    // Shuffle choices for each question
    currentQuestions.forEach(q => {
      q.shuffledChoices = [...q.choices].sort(() => Math.random() - 0.5);
    });
    currentIndex = 0;
  }

  function getCurrentQuestion() {
    return currentQuestions[currentIndex];
  }

  function nextQuestion() {
    currentIndex++;
    return currentIndex < currentQuestions.length;
  }

  function getProgress() {
    return {
      current: currentIndex + 1,
      total: currentQuestions.length
    };
  }

  function getQuestionsByAnswers(answers) {
    return allQuestions.filter(q => answers.includes(q.answer));
  }

  return {
    prepareGame,
    getCurrentQuestion,
    nextQuestion,
    getProgress,
    getQuestionsByAnswers
  };
})();
