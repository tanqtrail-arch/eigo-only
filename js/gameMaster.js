/**
 * GameMaster Agent
 * - ゲーム進行を管理する
 * - スコア計算（ヒント数に応じて 300/200/100 点）
 * - コンボシステム（連続正解でポイント倍増）
 * - タイマー制（残り秒数ボーナス）
 * - ハイスコアランキング（レベル別）
 * - 称号システム
 * - デイリーチャレンジ
 * - 復習チャレンジモード
 */
const GameMaster = (() => {
  const POINTS_BY_HINTS = { 1: 300, 2: 200, 3: 100 };
  const STORAGE_KEY_PREFIX = "eigo-only-review";
  const HIGHSCORE_KEY_PREFIX = "eigo-only-highscore";
  const DAILY_KEY = "eigo-only-daily";
  const REVIEW_MASTERY_KEY_PREFIX = "eigo-only-mastery";
  const TIME_LIMIT = 30; // 秒
  const TIME_BONUS_MULTIPLIER = 3; // 残り秒 × この値 = タイムボーナス

  let score = 0;
  let results = [];
  let isReviewMode = false;
  let isDailyMode = false;
  let currentLevel = null;

  // コンボ
  let combo = 0;
  let maxCombo = 0;

  // タイマー
  let timerInterval = null;
  let timeRemaining = TIME_LIMIT;
  let timerCallback = null; // UIに毎秒通知するコールバック

  function getStorageKey(level) {
    return level ? `${STORAGE_KEY_PREFIX}-${level}` : STORAGE_KEY_PREFIX;
  }

  function startGame(reviewMode, level, dailyMode) {
    score = 0;
    results = [];
    combo = 0;
    maxCombo = 0;
    isReviewMode = !!reviewMode;
    isDailyMode = !!dailyMode;
    currentLevel = level || null;

    if (dailyMode) {
      const dailyQuestions = getDailyQuestions(level);
      QuestionMaster.prepareGame(dailyQuestions, level);
    } else if (reviewMode) {
      const reviewAnswers = getReviewStock(level);
      const reviewQuestions = QuestionMaster.getQuestionsByAnswers(reviewAnswers, level);
      QuestionMaster.prepareGame(reviewQuestions, level);
    } else {
      QuestionMaster.prepareGame(null, level);
    }
  }

  // --- タイマー ---
  function startTimer(callback) {
    stopTimer();
    timeRemaining = TIME_LIMIT;
    timerCallback = callback;
    timerInterval = setInterval(() => {
      timeRemaining--;
      if (timerCallback) timerCallback(timeRemaining);
      if (timeRemaining <= 0) {
        stopTimer();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function getTimeRemaining() {
    return timeRemaining;
  }

  function getTimeLimit() {
    return TIME_LIMIT;
  }

  // --- コンボ ---
  function getCombo() {
    return combo;
  }

  function getMaxCombo() {
    return maxCombo;
  }

  function getComboMultiplier() {
    if (combo >= 5) return 2.0;
    if (combo >= 3) return 1.5;
    if (combo >= 2) return 1.2;
    return 1.0;
  }

  function getNextComboMultiplier(wouldBeCombo) {
    if (wouldBeCombo >= 5) return 2.0;
    if (wouldBeCombo >= 3) return 1.5;
    if (wouldBeCombo >= 2) return 1.2;
    return 1.0;
  }

  function checkAnswer(selectedAnswer) {
    stopTimer();
    const question = QuestionMaster.getCurrentQuestion();
    const correct = selectedAnswer === question.answer;
    const hintsUsed = QuestionMaster.getHintsRevealed();

    let basePoints = correct ? POINTS_BY_HINTS[hintsUsed] : 0;
    let timeBonus = 0;
    let comboMultiplier = 1.0;
    let comboCount = 0;

    if (correct) {
      combo++;
      if (combo > maxCombo) maxCombo = combo;
      comboCount = combo;
      comboMultiplier = getComboMultiplier();
      timeBonus = Math.max(0, timeRemaining) * TIME_BONUS_MULTIPLIER;
    } else {
      combo = 0;
      comboCount = 0;
    }

    const totalPoints = correct ? Math.round(basePoints * comboMultiplier) + timeBonus : 0;
    score += totalPoints;

    const resultEntry = {
      answer: question.answer,
      questions: question.questions,
      translations: question.translations,
      keywords: question.keywords,
      correct,
      basePoints,
      timeBonus,
      comboMultiplier,
      comboCount,
      points: totalPoints,
      hintsUsed,
      timeRemaining: Math.max(0, timeRemaining)
    };
    results.push(resultEntry);

    const level = question.level;
    if (!correct) {
      addToReviewStock(question.answer, level);
      resetMastery(question.answer, level);
    } else {
      incrementMastery(question.answer, level);
      const mastery = getMasteryCount(question.answer, level);
      if (mastery >= 2) {
        removeFromReviewStock(question.answer, level);
      }
    }

    return resultEntry;
  }

  function getPointsForCurrentHints() {
    const hints = QuestionMaster.getHintsRevealed();
    return POINTS_BY_HINTS[hints];
  }

  function getScore() {
    return score;
  }

  function getResults() {
    return results;
  }

  function getIsReviewMode() {
    return isReviewMode;
  }

  function getIsDailyMode() {
    return isDailyMode;
  }

  function getCurrentLevel() {
    return currentLevel;
  }

  function getMaxPossibleScore() {
    return QuestionMaster.getProgress().total * 300;
  }

  function getRank() {
    const maxScore = getMaxPossibleScore();
    const percentage = score / maxScore;
    if (percentage >= 0.9) return { rank: "S", label: "英語マスター！", color: "#e63946" };
    if (percentage >= 0.7) return { rank: "A", label: "すごい！", color: "#e76f51" };
    if (percentage >= 0.5) return { rank: "B", label: "いい感じ！", color: "#2a9d8f" };
    if (percentage >= 0.3) return { rank: "C", label: "まあまあ！", color: "#457b9d" };
    return { rank: "D", label: "がんばろう！", color: "#6c757d" };
  }

  // --- 称号システム ---
  function getTitles() {
    const titles = [];
    const total = results.length;
    const correctCount = results.filter(r => r.correct).length;
    const allCorrect = correctCount === total;
    const allHint1 = results.every(r => r.correct && r.hintsUsed === 1);
    const avgTime = results.reduce((sum, r) => sum + r.timeRemaining, 0) / total;

    if (allHint1 && total > 0) {
      titles.push({ icon: "👁️", title: "ノーヒントの達人", desc: "全問ヒント1だけで正解！" });
    }
    if (allCorrect && total > 0) {
      titles.push({ icon: "💯", title: "パーフェクト", desc: "全問正解！" });
    }
    if (maxCombo >= 5) {
      titles.push({ icon: "🔥", title: "コンボマスター", desc: `最大${maxCombo}コンボ達成！` });
    } else if (maxCombo >= 3) {
      titles.push({ icon: "⚡", title: "コンボファイター", desc: `最大${maxCombo}コンボ！` });
    }
    if (avgTime >= 20 && allCorrect) {
      titles.push({ icon: "⏱️", title: "スピードスター", desc: "素早く全問正解！" });
    }
    if (isDailyMode && allCorrect) {
      titles.push({ icon: "📅", title: "デイリーチャンピオン", desc: "今日のチャレンジ制覇！" });
    }
    if (isReviewMode && allCorrect) {
      titles.push({ icon: "📖", title: "復習の鬼", desc: "苦手を全て克服！" });
    }
    return titles;
  }

  // --- ハイスコアランキング ---
  function getHighScoreKey(level) {
    return level ? `${HIGHSCORE_KEY_PREFIX}-${level}` : HIGHSCORE_KEY_PREFIX;
  }

  function getHighScores(level) {
    try {
      const key = getHighScoreKey(level);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function saveHighScore(level) {
    const key = getHighScoreKey(level);
    const scores = getHighScores(level);
    const today = new Date();
    const dateStr = `${today.getMonth() + 1}/${today.getDate()}`;
    const entry = {
      score: score,
      date: dateStr,
      combo: maxCombo,
      mode: isDailyMode ? "daily" : isReviewMode ? "review" : "normal"
    };
    scores.push(entry);
    scores.sort((a, b) => b.score - a.score);
    const top5 = scores.slice(0, 5);
    localStorage.setItem(key, JSON.stringify(top5));

    // 新記録かどうか
    const isNewRecord = top5[0].score === score && top5[0].date === dateStr;
    return isNewRecord;
  }

  // --- デイリーチャレンジ ---
  function getDailyQuestions(level) {
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    // 日付をシードとして使い、毎日違う3問を選ぶ
    let seed = 0;
    for (let i = 0; i < dateKey.length; i++) {
      seed = seed * 31 + dateKey.charCodeAt(i);
    }
    const allQ = QuestionMaster.getAllQuestionsForLevel(level);
    // シャッフルして3問選択
    const shuffled = [...allQ];
    for (let i = shuffled.length - 1; i > 0; i--) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const j = seed % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 3);
  }

  function getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }

  function isDailyCompleted(level) {
    try {
      const data = localStorage.getItem(DAILY_KEY);
      if (!data) return false;
      const record = JSON.parse(data);
      return record.date === getTodayKey() && record.levels && record.levels.includes(level);
    } catch {
      return false;
    }
  }

  function markDailyCompleted(level) {
    try {
      const data = localStorage.getItem(DAILY_KEY);
      let record = data ? JSON.parse(data) : { date: "", levels: [] };
      if (record.date !== getTodayKey()) {
        record = { date: getTodayKey(), levels: [] };
      }
      if (!record.levels.includes(level)) {
        record.levels.push(level);
      }
      localStorage.setItem(DAILY_KEY, JSON.stringify(record));
    } catch {}
  }

  // --- 復習マスタリー管理 ---
  function getMasteryKey(level) {
    return level ? `${REVIEW_MASTERY_KEY_PREFIX}-${level}` : REVIEW_MASTERY_KEY_PREFIX;
  }

  function getMasteryData(level) {
    try {
      const key = getMasteryKey(level);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  function getMasteryCount(answer, level) {
    const data = getMasteryData(level);
    return data[answer] || 0;
  }

  function incrementMastery(answer, level) {
    const key = getMasteryKey(level);
    const data = getMasteryData(level);
    data[answer] = (data[answer] || 0) + 1;
    localStorage.setItem(key, JSON.stringify(data));
  }

  function resetMastery(answer, level) {
    const key = getMasteryKey(level);
    const data = getMasteryData(level);
    data[answer] = 0;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // --- 復習ストック管理（レベル別） ---
  function getReviewStock(level) {
    try {
      const key = getStorageKey(level);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function addToReviewStock(answer, level) {
    const key = getStorageKey(level);
    const stock = getReviewStock(level);
    if (!stock.includes(answer)) {
      stock.push(answer);
      localStorage.setItem(key, JSON.stringify(stock));
    }
  }

  function removeFromReviewStock(answer, level) {
    const key = getStorageKey(level);
    const stock = getReviewStock(level);
    const updated = stock.filter(a => a !== answer);
    localStorage.setItem(key, JSON.stringify(updated));
  }

  function hasReviewStock(level) {
    return getReviewStock(level).length > 0;
  }

  function getReviewStockCount(level) {
    return getReviewStock(level).length;
  }

  return {
    startGame,
    checkAnswer,
    getPointsForCurrentHints,
    getScore,
    getResults,
    getIsReviewMode,
    getIsDailyMode,
    getCurrentLevel,
    getMaxPossibleScore,
    getRank,
    getTitles,
    hasReviewStock,
    getReviewStockCount,
    // タイマー
    startTimer,
    stopTimer,
    getTimeRemaining,
    getTimeLimit,
    // コンボ
    getCombo,
    getMaxCombo,
    getComboMultiplier,
    getNextComboMultiplier,
    // ハイスコア
    getHighScores,
    saveHighScore,
    // デイリー
    isDailyCompleted,
    markDailyCompleted,
    // マスタリー
    getMasteryCount
  };
})();
