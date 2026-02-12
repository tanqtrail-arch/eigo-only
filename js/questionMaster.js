/**
 * QuestionMaster Agent
 * - お題を管理し、ヒントを段階的に提供する
 * - 各問題に3段階の英語ヒント（難→易）と日本語4択を持つ
 */
const QuestionMaster = (() => {
  const allQuestions = [
    {
      answer: "りんご",
      hints: [
        "This pomaceous fruit of the Rosaceae family has been cultivated across temperate regions for millennia, featuring prominently in mythology and cultural narratives worldwide.",
        "A round fruit that grows on trees. It can be red, green, or yellow. Very crunchy when fresh.",
        "A red fruit. You can make juice or pie with it. \"An __ a day keeps the doctor away.\""
      ],
      choices: ["りんご", "みかん", "バナナ", "もも"]
    },
    {
      answer: "猫",
      hints: [
        "This domesticated carnivorous mammal, belonging to the family Felidae, has been a companion to humans since ancient Egyptian civilization.",
        "A small animal kept as a pet. It has soft fur, whiskers, and sharp claws. It likes to sleep a lot.",
        "A cute pet that says \"meow.\" It catches mice. It loves fish."
      ],
      choices: ["犬", "猫", "うさぎ", "ハムスター"]
    },
    {
      answer: "富士山",
      hints: [
        "This stratovolcano, standing as the highest peak of an island nation, was designated a UNESCO World Heritage Site in 2013 for its cultural significance.",
        "The tallest mountain in Japan. It is a beautiful volcano with snow on top. Many people climb it in summer.",
        "The most famous mountain in Japan. It is very tall and has a perfect shape. You can see it from Tokyo on a clear day."
      ],
      choices: ["エベレスト", "富士山", "阿蘇山", "高尾山"]
    },
    {
      answer: "寿司",
      hints: [
        "This culinary preparation, originating from Southeast Asian preservation techniques, involves vinegared rice combined with various toppings, predominantly seafood.",
        "A famous Japanese food. It is rice with raw fish on top. People eat it with soy sauce and wasabi.",
        "Japanese food with rice and fish. You can eat it at a restaurant where plates go around on a belt."
      ],
      choices: ["ラーメン", "天ぷら", "寿司", "うどん"]
    },
    {
      answer: "傘",
      hints: [
        "This collapsible canopy device, supported by a central shaft with radiating ribs, serves as portable protection against precipitation and solar radiation.",
        "You carry this when it rains. You open it above your head to stay dry. You can fold it and put it in your bag.",
        "You use this in the rain. It keeps you dry. You hold it with one hand and open it up."
      ],
      choices: ["帽子", "傘", "レインコート", "長靴"]
    },
    {
      answer: "ピアノ",
      hints: [
        "This keyboard instrument, invented by Bartolomeo Cristofori around 1700, produces sound through hammers striking tensioned strings within a resonant chamber.",
        "A large musical instrument with black and white keys. You press the keys with your fingers to make music.",
        "A big instrument with many keys. It is black and white. Many children learn to play this."
      ],
      choices: ["ギター", "バイオリン", "ピアノ", "ドラム"]
    },
    {
      answer: "月",
      hints: [
        "This celestial body, Earth's sole natural satellite, exerts gravitational influence causing oceanic tidal phenomena and has been the destination of human exploration missions.",
        "You can see it in the sky at night. It changes shape during the month. Astronauts visited it in 1969.",
        "A bright round thing in the night sky. It changes from full to thin. Rabbits live there in Japanese stories."
      ],
      choices: ["太陽", "月", "星", "地球"]
    },
    {
      answer: "自転車",
      hints: [
        "This human-powered, pedal-driven vehicle with two inline wheels, invented in the 19th century, remains one of the most efficient means of terrestrial locomotion.",
        "A vehicle with two wheels. You sit on it and push pedals with your feet to move forward. No engine needed.",
        "You ride it with two wheels. You push pedals to go. Kids learn to ride it without training wheels."
      ],
      choices: ["自動車", "バイク", "自転車", "スケートボード"]
    },
    {
      answer: "桜",
      hints: [
        "These ornamental flowering trees of the genus Prunus are emblematic of transience in East Asian philosophy, with their ephemeral blossoming celebrated through seasonal festivities.",
        "Beautiful pink flowers that bloom in spring in Japan. People have parties under these trees. The petals fall like snow.",
        "Pink flowers in spring. Japanese people eat and drink under these trees. The flowers only last about one week."
      ],
      choices: ["バラ", "桜", "ひまわり", "チューリップ"]
    },
    {
      answer: "電車",
      hints: [
        "This rail-based mass transit vehicle, propelled by electrical power, constitutes a fundamental component of urban transportation infrastructure in densely populated metropolitan areas.",
        "A long vehicle that runs on rails and carries many passengers. It stops at stations. Very common in big cities in Japan.",
        "People ride this to go to work or school. It runs on tracks. It stops at many stations. Very crowded in the morning."
      ],
      choices: ["バス", "タクシー", "電車", "飛行機"]
    },
    {
      answer: "虹",
      hints: [
        "This meteorological phenomenon manifests as a multicolored circular arc caused by refraction, reflection, and dispersion of electromagnetic radiation within water droplets.",
        "A colorful arc that appears in the sky after rain. It has seven colors. You can see it when the sun comes out while it's still raining.",
        "A beautiful thing with many colors in the sky. You see it after rain. Red, orange, yellow, green, blue... seven colors!"
      ],
      choices: ["雷", "虹", "雲", "オーロラ"]
    },
    {
      answer: "カメラ",
      hints: [
        "This optical device captures electromagnetic radiation to produce a permanent visual record, evolving from the camera obscura principle through chemical and now digital processes.",
        "A device used to take photos. You look through it, press a button, and it captures the moment. Now most are digital.",
        "You use this to take pictures. Press the button and click! Everyone has one in their phone now."
      ],
      choices: ["テレビ", "カメラ", "望遠鏡", "ビデオ"]
    },
    {
      answer: "地図",
      hints: [
        "This symbolic representation of spatial relationships among geographic features employs scale reduction and projection systems to render three-dimensional terrain onto a planar surface.",
        "A drawing that shows roads, cities, mountains, and rivers. You use it to find places. Now people use a digital version on phones.",
        "A picture that shows where places are. It helps you find the way. Google has a very famous one on your phone."
      ],
      choices: ["地図", "カレンダー", "時刻表", "辞書"]
    },
    {
      answer: "チョコレート",
      hints: [
        "This confection, derived from fermented and roasted Theobroma cacao seeds, was consumed as a bitter beverage by Mesoamerican civilizations before European sweetening adaptations.",
        "A sweet brown food made from cacao. It melts in your mouth. Very popular as a gift on Valentine's Day in Japan.",
        "A sweet brown candy. Kids love it. In Japan, girls give it to boys on February 14th."
      ],
      choices: ["クッキー", "ケーキ", "アイスクリーム", "チョコレート"]
    },
    {
      answer: "時計",
      hints: [
        "This chronometric instrument, measuring temporal progression through mechanical or electronic oscillation, has evolved from sundials and water clocks to atomic precision devices.",
        "A device that shows the time. It has numbers and hands that move in a circle. You wear one on your wrist.",
        "It tells you the time. It has numbers 1 to 12. You wear it on your arm or hang it on the wall."
      ],
      choices: ["時計", "カレンダー", "砂時計", "温度計"]
    },
    {
      answer: "サッカー",
      hints: [
        "This globally preeminent association football sport, governed by FIFA, involves twenty-two competitors contesting possession of a spherical ball across a rectangular pitch.",
        "A popular sport played with a round ball. Two teams of eleven players try to kick the ball into a goal.",
        "A sport where you kick a ball into a goal. The World Cup is the biggest event. You cannot use your hands."
      ],
      choices: ["野球", "サッカー", "バスケットボール", "テニス"]
    },
    {
      answer: "冷蔵庫",
      hints: [
        "This thermoelectric appliance maintains perishable commodities at sub-ambient temperatures, employing vapor-compression or absorption refrigeration cycles within an insulated enclosure.",
        "A large machine in the kitchen that keeps food cold. It has a door that you open to put food inside. It runs all day and night.",
        "A big white box in the kitchen. It keeps food cold so it doesn't go bad. Milk, eggs, and vegetables go inside."
      ],
      choices: ["電子レンジ", "冷蔵庫", "洗濯機", "エアコン"]
    },
    {
      answer: "ペンギン",
      hints: [
        "These flightless aquatic avians of the family Spheniscidae inhabit predominantly Southern Hemisphere regions, exhibiting remarkable thermoregulatory adaptations to frigid environments.",
        "A bird that cannot fly but swims very well. It is black and white and walks in a funny way. It lives in cold places.",
        "A cute black and white bird. It lives near ice. It cannot fly but loves to swim. It walks funny."
      ],
      choices: ["ペンギン", "フラミンゴ", "アヒル", "ワシ"]
    },
    {
      answer: "太陽",
      hints: [
        "This G-type main-sequence star at the gravitational center of our planetary system sustains terrestrial life through thermonuclear fusion of hydrogen into helium.",
        "The big star at the center of our solar system. It gives us light and heat. Without it, Earth would be frozen and dark.",
        "The bright thing in the sky during the day. It is very hot. It rises in the east and sets in the west."
      ],
      choices: ["月", "太陽", "火星", "北極星"]
    },
    {
      answer: "消しゴム",
      hints: [
        "This stationery implement, typically composed of vulcanized rubber or vinyl polymer, removes graphite markings from paper through frictional abrasion.",
        "A small object used with a pencil. When you make a mistake in writing, you use this to remove the pencil marks from paper.",
        "You use this when you write something wrong with a pencil. It is small and white. Rub it on the paper and the writing goes away."
      ],
      choices: ["鉛筆", "定規", "消しゴム", "ノート"]
    },
    {
      answer: "新幹線",
      hints: [
        "This high-velocity rail network, inaugurated in 1964 between Tokyo and Osaka, pioneered dedicated passenger rail infrastructure capable of exceeding 300 kilometers per hour.",
        "The fastest train in Japan. It connects major cities like Tokyo and Osaka. It has a long, pointed nose and is very comfortable.",
        "A very fast Japanese train. It looks like a bullet. It is white and blue. You can go from Tokyo to Osaka in about 2 hours."
      ],
      choices: ["地下鉄", "モノレール", "新幹線", "路面電車"]
    },
    {
      answer: "図書館",
      hints: [
        "This institutional repository facilitates public access to organized collections of literary, academic, and multimedia resources, serving as a communal nexus for intellectual engagement.",
        "A building full of books. You can borrow books for free and read them there. You must be quiet inside.",
        "A place with many books. You can borrow them and read. You must return them later. Be quiet here!"
      ],
      choices: ["本屋", "学校", "図書館", "博物館"]
    },
    {
      answer: "餃子",
      hints: [
        "These crescent-shaped dumplings, originating from Chinese culinary tradition, encase a filling of minced meat and vegetables within a thin wheat-flour wrapper, prepared by various cooking methods.",
        "A popular food from China that is also loved in Japan. Small pieces of meat and vegetables are wrapped in thin dough and cooked.",
        "Small food with meat inside thin dough. You can fry them, boil them, or steam them. Dip in soy sauce and eat!"
      ],
      choices: ["シュウマイ", "餃子", "春巻き", "肉まん"]
    },
    {
      answer: "眼鏡",
      hints: [
        "This corrective optical apparatus, comprising paired lenses mounted in a supportive frame, compensates for refractive errors in the visual system of the wearer.",
        "A device with two lenses in a frame that you wear on your face. It helps people who cannot see clearly to see better.",
        "You wear these on your face to see better. They have two round glass parts. They sit on your nose and ears."
      ],
      choices: ["サングラス", "望遠鏡", "眼鏡", "コンタクトレンズ"]
    },
    {
      answer: "お正月",
      hints: [
        "This annual celebration, commencing on the first day of the Gregorian calendar, constitutes the most culturally significant holiday observance in Japanese society.",
        "The most important holiday in Japan, celebrated at the beginning of the year. People visit shrines, eat special food, and children get money.",
        "January 1st in Japan. People eat mochi and osechi. Children get otoshidama. Families visit a shrine together."
      ],
      choices: ["クリスマス", "お正月", "ひな祭り", "七夕"]
    },
    {
      answer: "イルカ",
      hints: [
        "This highly intelligent cetacean mammal, belonging to the family Delphinidae, exhibits sophisticated echolocation capabilities and complex social behaviors within aquatic environments.",
        "A smart sea animal that swims very fast and jumps out of the water. It is friendly to humans and makes clicking sounds.",
        "A smart and friendly animal that lives in the sea. It jumps out of the water. You can see them at aquariums."
      ],
      choices: ["クジラ", "サメ", "イルカ", "アザラシ"]
    },
    {
      answer: "エレベーター",
      hints: [
        "This vertical conveyance apparatus, employing counterweighted traction or hydraulic systems, facilitates passenger and freight transportation between discrete building levels.",
        "A small room that moves up and down inside a building. You press a button to choose your floor. The doors open and close.",
        "A box that goes up and down in a building. You push a button and it takes you to another floor. The doors open by themselves."
      ],
      choices: ["エスカレーター", "エレベーター", "階段", "はしご"]
    },
    {
      answer: "蜂蜜",
      hints: [
        "This viscous, supersaturated sugar solution is produced by Apis mellifera through enzymatic transformation of floral nectar, stored within hexagonal beeswax chambers.",
        "A sweet, golden liquid made by bees. They collect it from flowers. People put it on bread or in tea. It never goes bad.",
        "A very sweet yellow liquid. Bees make it from flowers. You can put it on pancakes or in hot drinks."
      ],
      choices: ["砂糖", "メープルシロップ", "ジャム", "蜂蜜"]
    },
    {
      answer: "恐竜",
      hints: [
        "These archosaurian reptiles dominated terrestrial ecosystems throughout the Mesozoic Era before a mass extinction event at the Cretaceous-Paleogene boundary approximately 66 million years ago.",
        "Giant reptiles that lived millions of years ago. Some were very big and ate meat. They all disappeared a long time ago.",
        "Very big animals that lived long, long ago. T-Rex is the most famous one. You can see their bones in museums."
      ],
      choices: ["恐竜", "ドラゴン", "ワニ", "ゴジラ"]
    },
    {
      answer: "風呂",
      hints: [
        "This bathing ritual, deeply embedded in Japanese cultural practice, involves immersion in heated water within a dedicated domestic or communal facility for hygienic and therapeutic purposes.",
        "A place in Japanese homes where you wash your body and then sit in hot water to relax. Japanese people do this every evening.",
        "A hot water tub in a Japanese house. You wash first, then sit in the hot water. It feels very good after a long day."
      ],
      choices: ["プール", "風呂", "シャワー", "温泉"]
    }
  ];

  let currentQuestions = [];
  let currentIndex = 0;
  let currentHintLevel = 0;

  const MAX_HINTS = 3;
  const QUESTIONS_PER_GAME = 7;

  function prepareGame() {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    currentQuestions = shuffled.slice(0, QUESTIONS_PER_GAME);
    // Shuffle choices for each question
    currentQuestions.forEach(q => {
      q.shuffledChoices = [...q.choices].sort(() => Math.random() - 0.5);
    });
    currentIndex = 0;
    currentHintLevel = 0;
  }

  function getCurrentQuestion() {
    return currentQuestions[currentIndex];
  }

  function getCurrentHint() {
    const q = currentQuestions[currentIndex];
    return q.hints[currentHintLevel];
  }

  function getHintLevel() {
    return currentHintLevel;
  }

  function nextHint() {
    if (currentHintLevel < MAX_HINTS - 1) {
      currentHintLevel++;
      return true;
    }
    return false;
  }

  function nextQuestion() {
    currentIndex++;
    currentHintLevel = 0;
    return currentIndex < currentQuestions.length;
  }

  function getProgress() {
    return {
      current: currentIndex + 1,
      total: currentQuestions.length
    };
  }

  function isLastHint() {
    return currentHintLevel >= MAX_HINTS - 1;
  }

  return {
    prepareGame,
    getCurrentQuestion,
    getCurrentHint,
    getHintLevel,
    nextHint,
    nextQuestion,
    getProgress,
    isLastHint,
    MAX_HINTS
  };
})();
