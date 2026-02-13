/**
 * App - メインエントリポイント
 * - 3つのエージェントを統合する
 * - イベントリスナーを管理する
 * - タイマー制御
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
    GameMaster.stopTimer();
    selectedLevel = null;
    Renderer.renderStartScreen();
  }

  function startGameWithLevel(level) {
    selectedLevel = level;
    GameMaster.startGame(false, level, false);
    Renderer.renderQuiz();
    startQuestionTimer();
  }

  function startReviewWithLevel(level) {
    selectedLevel = level;
    GameMaster.startGame(true, level, false);
    Renderer.renderQuiz();
    startQuestionTimer();
  }

  function startDailyWithLevel(level) {
    selectedLevel = level;
    GameMaster.startGame(false, level, true);
    Renderer.renderQuiz();
    startQuestionTimer();
  }

  function startQuestionTimer() {
    const timeEl = document.getElementById("quiz-timer");
    const timeLimit = GameMaster.getTimeLimit();
    GameMaster.startTimer((timeLeft) => {
      Renderer.updateTimerDisplay(timeEl, timeLeft, timeLimit);
      // 残り5秒以下でタイマーを目立たせる
      if (timeLeft <= 5 && timeLeft > 0) {
        timeEl.classList.add("timer-pulse");
      }
      if (timeLeft <= 0) {
        timeEl.classList.remove("timer-pulse");
      }
    });
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
    // ヒントを開いてもタイマーは継続（リセットしない）
  }

  function nextQuestion() {
    const hasMore = QuestionMaster.nextQuestion();
    if (hasMore) {
      Renderer.renderQuiz();
      startQuestionTimer();
    } else {
      GameMaster.stopTimer();
      Renderer.renderFinal();
    }
  }

  init();

  return { handleAnswer, startGameWithLevel, startReviewWithLevel, startDailyWithLevel, revealHint };
})();
