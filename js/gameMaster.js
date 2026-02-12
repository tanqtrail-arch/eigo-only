/**
 * GameMaster Agent
 * - ゲーム進行を管理する
 * - スコア計算（ヒント数に応じて 300/200/100 点）
 * - 正誤判定
 * - 間違えた問題のストック（localStorage、レベル別）
 */
const GameMaster = (() => {
  const POINTS_BY_HINTS = { 1: 300, 2: 200, 3: 100 };
  const STORAGE_KEY_PREFIX = "eigo-only-review";

  let score = 0;
  let results = [];
  let isReviewMode = false;
  let currentLevel = null;

  function getStorageKey(level) {
    return level ? `${STORAGE_KEY_PREFIX}-${level}` : STORAGE_KEY_PREFIX;
  }

  function startGame(reviewMode, level) {
    score = 0;
    results = [];
    isReviewMode = !!reviewMode;
    currentLevel = level || null;

    if (reviewMode) {
      const reviewAnswers = getReviewStock(level);
      const reviewQuestions = QuestionMaster.getQuestionsByAnswers(reviewAnswers, level);
      QuestionMaster.prepareGame(reviewQuestions, level);
    } else {
      QuestionMaster.prepareGame(null, level);
    }
  }

  function checkAnswer(selectedAnswer) {
    const question = QuestionMaster.getCurrentQuestion();
    const correct = selectedAnswer === question.answer;
    const hintsUsed = QuestionMaster.getHintsRevealed();
    const points = correct ? POINTS_BY_HINTS[hintsUsed] : 0;

    score += points;

    results.push({
      answer: question.answer,
      questions: question.questions,
      translations: question.translations,
      keywords: question.keywords,
      correct,
      points,
      hintsUsed
    });

    const level = question.level;
    if (!correct) {
      addToReviewStock(question.answer, level);
    } else {
      removeFromReviewStock(question.answer, level);
    }

    return {
      correct,
      points,
      hintsUsed,
      answer: question.answer,
      questions: question.questions,
      translations: question.translations,
      keywords: question.keywords
    };
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
    getCurrentLevel,
    getMaxPossibleScore,
    getRank,
    hasReviewStock,
    getReviewStockCount
  };
})();
