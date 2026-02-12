/**
 * Renderer Agent
 * - 画面描画を担当する
 * - 画面切り替え、アニメーション、DOM操作
 */
const Renderer = (() => {
  const screens = {
    start: document.getElementById("screen-start"),
    quiz: document.getElementById("screen-quiz"),
    answer: document.getElementById("screen-answer"),
    final: document.getElementById("screen-final")
  };

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
  }

  function renderStartScreen() {
    const reviewBtn = document.getElementById("btn-review");
    if (GameMaster.hasReviewStock()) {
      const count = GameMaster.getReviewStockCount();
      reviewBtn.textContent = `復習する（${count}問）`;
      reviewBtn.style.display = "block";
    } else {
      reviewBtn.style.display = "none";
    }
    showScreen("start");
  }

  function renderQuiz() {
    const progress = QuestionMaster.getProgress();
    const question = QuestionMaster.getCurrentQuestion();
    const score = GameMaster.getScore();
    const isReview = GameMaster.getIsReviewMode();

    document.getElementById("quiz-progress").textContent =
      `Q${progress.current} / ${progress.total}`;
    document.getElementById("quiz-score").textContent =
      `Score: ${score}`;

    // 復習モード表示
    const modeLabel = document.getElementById("quiz-mode");
    if (isReview) {
      modeLabel.textContent = "復習モード";
      modeLabel.style.display = "inline-block";
    } else {
      modeLabel.style.display = "none";
    }

    // 3つの英語質問文を表示
    const questionsEl = document.getElementById("question-list");
    questionsEl.innerHTML = "";
    question.questions.forEach((q, i) => {
      const li = document.createElement("li");
      li.className = "question-item fade-in";
      li.style.animationDelay = `${i * 0.15}s`;
      li.innerHTML = `<span class="question-number">Q${i + 1}</span><span class="question-text">${q}</span>`;
      questionsEl.appendChild(li);
    });

    // 4択を表示
    const choicesEl = document.getElementById("choices");
    choicesEl.innerHTML = "";
    question.shuffledChoices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.className = "btn btn-choice";
      btn.textContent = choice;
      btn.style.animationDelay = `${i * 0.1}s`;
      btn.addEventListener("click", () => {
        if (!btn.disabled) {
          document.querySelectorAll(".btn-choice").forEach(b => b.disabled = true);
          window.app.handleAnswer(choice);
        }
      });
      choicesEl.appendChild(btn);
    });

    showScreen("quiz");
  }

  function renderAnswer(result) {
    const resultEl = document.getElementById("answer-result");
    const detailEl = document.getElementById("answer-detail");

    if (result.correct) {
      resultEl.innerHTML = `<span class="correct">正解！</span>`;
      resultEl.className = "answer-result correct-bg";
    } else {
      resultEl.innerHTML = `<span class="incorrect">不正解...</span>`;
      resultEl.className = "answer-result incorrect-bg";
    }

    let detailHTML = `<p class="answer-word">答え: <strong>${result.answer}</strong></p>`;
    if (result.correct) {
      detailHTML += `<p class="answer-points">+${result.points}pt</p>`;
    }

    // 質問文の和訳
    detailHTML += `<div class="translation-section">`;
    detailHTML += `<h3 class="section-title">質問文と和訳</h3>`;
    result.questions.forEach((q, i) => {
      detailHTML += `
        <div class="translation-item">
          <p class="translation-en">${q}</p>
          <p class="translation-ja">${result.translations[i]}</p>
        </div>
      `;
    });
    detailHTML += `</div>`;

    // キーワード解説
    detailHTML += `<div class="keyword-section">`;
    detailHTML += `<h3 class="section-title">ポイント英単語</h3>`;
    result.keywords.forEach(kw => {
      detailHTML += `
        <div class="keyword-item">
          <span class="keyword-word">${kw.word}</span>
          <span class="keyword-meaning">${kw.meaning}</span>
          <p class="keyword-note">${kw.note}</p>
        </div>
      `;
    });
    detailHTML += `</div>`;

    detailEl.innerHTML = detailHTML;

    // 次へボタンのテキスト
    const progress = QuestionMaster.getProgress();
    const btnNext = document.getElementById("btn-next");
    if (progress.current >= progress.total) {
      btnNext.textContent = "結果を見る";
    } else {
      btnNext.textContent = "次の問題へ";
    }

    showScreen("answer");
  }

  function renderFinal() {
    const score = GameMaster.getScore();
    const maxScore = GameMaster.getMaxPossibleScore();
    const rank = GameMaster.getRank();
    const results = GameMaster.getResults();
    const isReview = GameMaster.getIsReviewMode();

    const titleEl = document.getElementById("final-title-text");
    titleEl.textContent = isReview ? "復習結果" : "結果発表";

    document.getElementById("final-score").innerHTML = `
      <div class="rank" style="color: ${rank.color}">${rank.rank}</div>
      <div class="rank-label">${rank.label}</div>
      <div class="score-display">${score} / ${maxScore} pt</div>
    `;

    let breakdownHTML = '<div class="breakdown-list">';
    results.forEach((r, i) => {
      const icon = r.correct ? "&#x2B55;" : "&#x274C;";
      breakdownHTML += `
        <div class="breakdown-item ${r.correct ? 'item-correct' : 'item-incorrect'}">
          <span class="breakdown-icon">${icon}</span>
          <span class="breakdown-answer">Q${i + 1}: ${r.answer}</span>
          <span class="breakdown-points">${r.correct ? '+' + r.points + 'pt' : '0pt'}</span>
        </div>
      `;
    });
    breakdownHTML += "</div>";
    document.getElementById("final-breakdown").innerHTML = breakdownHTML;

    // 復習ボタン表示
    const reviewBtn = document.getElementById("btn-review-final");
    if (GameMaster.hasReviewStock()) {
      const count = GameMaster.getReviewStockCount();
      reviewBtn.textContent = `間違えた問題を復習する（${count}問）`;
      reviewBtn.style.display = "block";
    } else {
      reviewBtn.style.display = "none";
    }

    showScreen("final");
  }

  return {
    showScreen,
    renderStartScreen,
    renderQuiz,
    renderAnswer,
    renderFinal
  };
})();
