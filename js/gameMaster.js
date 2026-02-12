/**
 * GameMaster Agent
 * - ゲーム進行を管理する
 * - スコア計算（正解 = 100点）
 * - 正誤判定
 * - 間違えた問題のストック（localStorage）
 */
const GameMaster = (() => {
  const POINTS_PER_CORRECT = 100;
  const STORAGE_KEY = "eigo-only-review";

  let score = 0;
  let results = [];
  let isReviewMode = false;

  function startGame(reviewMode) {
    score = 0;
    results = [];
    isReviewMode = !!reviewMode;

    if (reviewMode) {
      const reviewAnswers = getReviewStock();
      const reviewQuestions = QuestionMaster.getQuestionsByAnswers(reviewAnswers);
      QuestionMaster.prepareGame(reviewQuestions);
    } else {
      QuestionMaster.prepareGame();
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

    // 間違えた問題をストックに追加
    if (!correct) {
      addToReviewStock(question.answer);
    } else {
      // 正解したら復習ストックから削除
      removeFromReviewStock(question.answer);
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

  // --- 復習ストック管理 ---
  function getReviewStock() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function addToReviewStock(answer) {
    const stock = getReviewStock();
    if (!stock.includes(answer)) {
      stock.push(answer);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stock));
    }
  }

  function removeFromReviewStock(answer) {
    const stock = getReviewStock();
    const updated = stock.filter(a => a !== answer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function hasReviewStock() {
    return getReviewStock().length > 0;
  }

  function getReviewStockCount() {
    return getReviewStock().length;
  }

  return {
    startGame,
    checkAnswer,
    getScore,
    getResults,
    getIsReviewMode,
    getMaxPossibleScore,
    getRank,
    hasReviewStock,
    getReviewStockCount
  };
})();
