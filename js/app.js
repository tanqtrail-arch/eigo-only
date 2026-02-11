/**
 * App - メインエントリポイント
 * - 3つのエージェントを統合する
 * - イベントリスナーを管理する
 */
window.app = (() => {
  function init() {
    document.getElementById("btn-start").addEventListener("click", startGame);
    document.getElementById("btn-next-hint").addEventListener("click", showNextHint);
    document.getElementById("btn-next").addEventListener("click", nextQuestion);
    document.getElementById("btn-retry").addEventListener("click", startGame);
  }

  function startGame() {
    GameMaster.startGame();
    Renderer.renderQuiz();
  }

  function showNextHint() {
    QuestionMaster.nextHint();
    Renderer.renderQuiz();
  }

  function handleAnswer(choice) {
    const result = GameMaster.checkAnswer(choice);
    setTimeout(() => {
      Renderer.renderAnswer(result);
    }, 300);
  }

  function nextQuestion() {
    const hasMore = QuestionMaster.nextQuestion();
    if (hasMore) {
      Renderer.renderQuiz();
    } else {
      Renderer.renderFinal();
    }
  }

  init();

  return { handleAnswer };
})();
