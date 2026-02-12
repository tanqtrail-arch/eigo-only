/**
 * App - メインエントリポイント
 * - 3つのエージェントを統合する
 * - イベントリスナーを管理する
 */
window.app = (() => {
  let selectedLevel = null;

  function init() {
    document.getElementById("btn-next").addEventListener("click", nextQuestion);
    document.getElementById("btn-retry").addEventListener("click", () => {
      if (selectedLevel) {
        startGameWithLevel(selectedLevel);
      } else {
        goToStart();
      }
    });
    document.getElementById("btn-review-final").addEventListener("click", () => {
      if (selectedLevel) {
        startReviewWithLevel(selectedLevel);
      }
    });
    document.getElementById("btn-back-home").addEventListener("click", goToStart);

    Renderer.renderStartScreen();
  }

  function goToStart() {
    selectedLevel = null;
    Renderer.renderStartScreen();
  }

  function startGameWithLevel(level) {
    selectedLevel = level;
    GameMaster.startGame(false, level);
    Renderer.renderQuiz();
  }

  function startReviewWithLevel(level) {
    selectedLevel = level;
    GameMaster.startGame(true, level);
    Renderer.renderQuiz();
  }

  function handleAnswer(choice) {
    const result = GameMaster.checkAnswer(choice);
    setTimeout(() => {
      Renderer.renderAnswer(result);
    }, 300);
  }

  function revealHint() {
    QuestionMaster.revealNextHint();
    Renderer.renderQuiz();
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

  return { handleAnswer, startGameWithLevel, startReviewWithLevel, revealHint };
})();
