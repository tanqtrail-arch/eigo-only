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
    }
  ];

  let currentQuestions = [];
  let currentIndex = 0;
  let currentHintLevel = 0;

  const MAX_HINTS = 3;
  const QUESTIONS_PER_GAME = 10;

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
