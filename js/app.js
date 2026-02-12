/**
 * App - メインエントリポイント
 * - 3つのエージェントを統合する
 * - イベントリスナーを管理する
 */
window.app = (() => {
  function init() {
    document.getElementById("btn-start").addEventListener("click", () => startGame(false));
    document.getElementById("btn-review").addEventListener("click", () => startGame(true));
    document.getElementById("btn-next").addEventListener("click", nextQuestion);
    document.getElementById("btn-retry").addEventListener("click", goToStart);
    document.getElementById("btn-review-final").addEventListener("click", () => startGame(true));

    // 初回表示時に復習ボタンの状態を更新
    Renderer.renderStartScreen();
  }

  function goToStart() {
    Renderer.renderStartScreen();
  }

  function startGame(reviewMode) {
    GameMaster.startGame(reviewMode);
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
