/**
 * GameMaster Agent
 * - ゲーム進行を管理する
 * - スコア計算（正解 = 100点）
 * - 正誤判定
 * - 間違えた問題のストック（localStorage、レベル別）
 */
const GameMaster = (() => {
  const POINTS_PER_CORRECT = 100;
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
    const points = correct ? POINTS_PER_CORRECT : 0;

    score += points;

    results.push({
      answer: question.answer,
      questions: question.questions,
      translations: question.translations,
      keywords: question.keywords,
      correct,
      points
    });

    const level = question.level;
    // 間違えた問題をストックに追加
    if (!correct) {
      addToReviewStock(question.answer, level);
    } else {
      // 正解したら復習ストックから削除
      removeFromReviewStock(question.answer, level);
    }

    return {
      correct,
      points,
      answer: question.answer,
      questions: question.questions,
      translations: question.translations,
      keywords: question.keywords
    };
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
    return QuestionMaster.getProgress().total * POINTS_PER_CORRECT;
  }

  function getRank() {
    const maxScore = getMaxPossibleScore();
    const percentage = score / maxScore;
    if (percentage >= 0.9) return { rank: "S", label: "英語マスター！", color: "#ffd700" };
    if (percentage >= 0.7) return { rank: "A", label: "すごい！", color: "#ff6b6b" };
    if (percentage >= 0.5) return { rank: "B", label: "いい感じ！", color: "#4ecdc4" };
    if (percentage >= 0.3) return { rank: "C", label: "まあまあ！", color: "#45b7d1" };
    return { rank: "D", label: "がんばろう！", color: "#96ceb4" };
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
