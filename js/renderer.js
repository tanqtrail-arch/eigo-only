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

  function renderQuiz() {
    const progress = QuestionMaster.getProgress();
    const question = QuestionMaster.getCurrentQuestion();
    const hint = QuestionMaster.getCurrentHint();
    const hintLevel = QuestionMaster.getHintLevel();
    const score = GameMaster.getScore();

    document.getElementById("quiz-progress").textContent =
      `Q${progress.current} / ${progress.total}`;
    document.getElementById("quiz-score").textContent =
      `Score: ${score}`;
    document.getElementById("hint-level").textContent =
      `Hint Level ${hintLevel + 1} / ${QuestionMaster.MAX_HINTS}`;

    // Update hint level indicator style
    const hintLevelEl = document.getElementById("hint-level");
    hintLevelEl.className = "hint-level level-" + (hintLevel + 1);

    // Render hint with animation
    const hintText = document.getElementById("hint-text");
    hintText.classList.remove("fade-in");
    void hintText.offsetWidth; // trigger reflow
    hintText.textContent = hint;
    hintText.classList.add("fade-in");

    // Show/hide next hint button
    const btnNextHint = document.getElementById("btn-next-hint");
    if (QuestionMaster.isLastHint()) {
      btnNextHint.style.display = "none";
    } else {
      btnNextHint.style.display = "block";
      const nextLevel = hintLevel + 2;
      btnNextHint.textContent =
        nextLevel === 2 ? "もう少しヒントを見る (-100pt)" : "最後のヒント (-200pt)";
    }

    // Render choices
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
    detailEl.innerHTML = detailHTML;

    // Check if this was the last question
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
          <span class="breakdown-hint">Hint Lv.${r.hintLevel}</span>
        </div>
      `;
    });
    breakdownHTML += "</div>";
    document.getElementById("final-breakdown").innerHTML = breakdownHTML;

    showScreen("final");
  }

  return {
    showScreen,
    renderQuiz,
    renderAnswer,
    renderFinal
  };
})();
