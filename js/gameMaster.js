/**
 * GameMaster Agent
 * - ゲーム進行を管理する
 * - スコア計算（早く答えるほど高得点）
 * - 正誤判定
 */
const GameMaster = (() => {
  // Hint Level 1 で正解 = 300点, Level 2 = 200点, Level 3 = 100点
  const SCORE_BY_HINT = [300, 200, 100];

  let score = 0;
  let results = []; // { question, correct, points, hintLevel }

  function startGame() {
    score = 0;
    results = [];
    QuestionMaster.prepareGame();
  }

  function checkAnswer(selectedAnswer) {
    const question = QuestionMaster.getCurrentQuestion();
    const correct = selectedAnswer === question.answer;
    const hintLevel = QuestionMaster.getHintLevel();
    const points = correct ? SCORE_BY_HINT[hintLevel] : 0;

    score += points;

    results.push({
      answer: question.answer,
      hints: question.hints,
      correct,
      points,
      hintLevel: hintLevel + 1
    });

    return { correct, points, answer: question.answer };
  }

  function getScore() {
    return score;
  }

  function getResults() {
    return results;
  }

  function getMaxPossibleScore() {
    return QuestionMaster.getProgress().total * SCORE_BY_HINT[0];
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

  return {
    startGame,
    checkAnswer,
    getScore,
    getResults,
    getMaxPossibleScore,
    getRank
  };
})();
