/**
 * Renderer Agent
 * - 画面描画を担当する
 * - アコーディオン式ヒント表示
 * - キーワード赤字ハイライト
 * - タイマー表示
 * - コンボ表示
 * - 紙吹雪・シェイクエフェクト
 * - 称号・ランキング表示
 * - デイリーチャレンジ表示
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

  // キーワードをハイライトするヘルパー
  function highlightKeyword(text, keyword) {
    if (!keyword) return text;
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    return text.replace(regex, '<span class="kw-highlight">$1</span>');
  }

  // --- 紙吹雪エフェクト ---
  function showConfetti() {
    const container = document.getElementById("confetti-container");
    container.innerHTML = "";
    container.style.display = "block";
    const colors = ["#e63946", "#f4845f", "#2a9d8f", "#457b9d", "#ffd166", "#06d6a0", "#118ab2"];
    const shapes = ["square", "circle"];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      if (shape === "circle") piece.classList.add("confetti-circle");
      piece.style.left = Math.random() * 100 + "%";
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.5 + "s";
      piece.style.animationDuration = (1.5 + Math.random() * 1.5) + "s";
      container.appendChild(piece);
    }
    setTimeout(() => {
      container.style.display = "none";
      container.innerHTML = "";
    }, 3000);
  }

  // --- シェイクエフェクト ---
  function showShake() {
    const app = document.getElementById("app");
    app.classList.add("shake");
    setTimeout(() => app.classList.remove("shake"), 500);
  }

  // --- コンボポップアップ ---
  function showComboPopup(combo, multiplier) {
    if (combo < 2) return;
    const popup = document.getElementById("combo-popup");
    popup.innerHTML = `
      <div class="combo-number">${combo} COMBO!</div>
      <div class="combo-multiplier">x${multiplier}</div>
    `;
    popup.classList.add("combo-show");
    setTimeout(() => popup.classList.remove("combo-show"), 1200);
  }

  function renderStartScreen() {
    const levels = QuestionMaster.getLevels();
    const container = document.getElementById("level-buttons");
    container.innerHTML = "";

    Object.values(levels).forEach(level => {
      const wrapper = document.createElement("div");
      wrapper.className = "level-btn-wrapper";

      const btn = document.createElement("button");
      btn.className = "btn btn-level";
      btn.dataset.level = level.id;
      btn.innerHTML = `
        <span class="level-label">${level.label}</span>
        <span class="level-desc">${level.description}</span>
      `;
      btn.addEventListener("click", () => {
        window.app.startGameWithLevel(level.id);
      });
      wrapper.appendChild(btn);

      // デイリーチャレンジボタン
      const dailyCompleted = GameMaster.isDailyCompleted(level.id);
      const dailyBtn = document.createElement("button");
      dailyBtn.className = "btn btn-daily";
      if (dailyCompleted) {
        dailyBtn.innerHTML = `<span class="daily-icon">📅</span> 今日のチャレンジ <span class="daily-done">クリア済</span>`;
        dailyBtn.classList.add("daily-completed");
      } else {
        dailyBtn.innerHTML = `<span class="daily-icon">📅</span> 今日のチャレンジ（3問）`;
      }
      dailyBtn.addEventListener("click", () => {
        window.app.startDailyWithLevel(level.id);
      });
      wrapper.appendChild(dailyBtn);

      // 復習ボタン
      if (GameMaster.hasReviewStock(level.id)) {
        const count = GameMaster.getReviewStockCount(level.id);
        const reviewBtn = document.createElement("button");
        reviewBtn.className = "btn btn-review-level";
        reviewBtn.textContent = `復習する（${count}問）`;
        reviewBtn.addEventListener("click", () => {
          window.app.startReviewWithLevel(level.id);
        });
        wrapper.appendChild(reviewBtn);
      }

      // ハイスコア表示
      const highScores = GameMaster.getHighScores(level.id);
      if (highScores.length > 0) {
        const hsDiv = document.createElement("div");
        hsDiv.className = "level-highscore";
        hsDiv.innerHTML = `<span class="hs-icon">🏆</span> Best: ${highScores[0].score}pt`;
        wrapper.appendChild(hsDiv);
      }

      container.appendChild(wrapper);
    });

    showScreen("start");
  }

  function renderQuiz() {
    const progress = QuestionMaster.getProgress();
    const question = QuestionMaster.getCurrentQuestion();
    const score = GameMaster.getScore();
    const isReview = GameMaster.getIsReviewMode();
    const isDaily = GameMaster.getIsDailyMode();
    const level = GameMaster.getCurrentLevel();
    const levels = QuestionMaster.getLevels();
    const hintsRevealed = QuestionMaster.getHintsRevealed();
    const combo = GameMaster.getCombo();

    document.getElementById("quiz-progress").textContent =
      `Q${progress.current} / ${progress.total}`;
    document.getElementById("quiz-score").textContent =
      `Score: ${score}`;

    // モード表示
    const modeLabel = document.getElementById("quiz-mode");
    if (isDaily) {
      modeLabel.textContent = "デイリーチャレンジ";
      modeLabel.style.display = "inline-block";
      modeLabel.className = "quiz-mode quiz-daily";
    } else if (isReview) {
      modeLabel.textContent = "復習モード";
      modeLabel.style.display = "inline-block";
      modeLabel.className = "quiz-mode";
    } else {
      modeLabel.style.display = "none";
    }

    // レベル表示
    const levelLabel = document.getElementById("quiz-level");
    if (level && levels[level]) {
      levelLabel.textContent = levels[level].label;
      levelLabel.style.display = "inline-block";
    } else {
      levelLabel.style.display = "none";
    }

    // コンボ表示
    const comboEl = document.getElementById("combo-display");
    if (combo >= 2) {
      comboEl.textContent = `${combo} COMBO x${GameMaster.getComboMultiplier()}`;
      comboEl.style.display = "inline-block";
    } else {
      comboEl.style.display = "none";
    }

    // ポイント表示
    const currentPts = GameMaster.getPointsForCurrentHints();
    document.getElementById("hint-points").textContent = `いま答えると ${currentPts}pt`;

    // タイマー表示
    const timeEl = document.getElementById("quiz-timer");
    const timeLeft = GameMaster.getTimeRemaining();
    const timeLimit = GameMaster.getTimeLimit();
    updateTimerDisplay(timeEl, timeLeft, timeLimit);

    // ヒント表示（アコーディオン）
    const questionsEl = document.getElementById("question-list");
    questionsEl.innerHTML = "";

    question.questions.forEach((q, i) => {
      const li = document.createElement("li");
      li.className = "question-item fade-in";
      li.style.animationDelay = `${i * 0.15}s`;

      if (i < hintsRevealed) {
        li.innerHTML = `<span class="question-number">ヒント${i + 1}</span><span class="question-text">${q}</span>`;
      } else {
        li.classList.add("hint-locked");
        li.innerHTML = `<span class="question-number hint-number-locked">ヒント${i + 1}</span><span class="question-text hint-text-locked">タップして開く</span>`;
        li.addEventListener("click", () => {
          window.app.revealHint();
        });
      }
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

  function updateTimerDisplay(el, timeLeft, timeLimit) {
    const pct = (timeLeft / timeLimit) * 100;
    let timerClass = "timer-safe";
    if (timeLeft <= 5) timerClass = "timer-danger";
    else if (timeLeft <= 10) timerClass = "timer-warning";
    el.innerHTML = `
      <div class="timer-bar-bg">
        <div class="timer-bar-fill ${timerClass}" style="width: ${pct}%"></div>
      </div>
      <span class="timer-text">${timeLeft}秒</span>
    `;
  }

  function renderAnswer(result) {
    const resultEl = document.getElementById("answer-result");
    const detailEl = document.getElementById("answer-detail");

    if (result.correct) {
      resultEl.innerHTML = `<span class="correct">正解！</span>`;
      resultEl.className = "answer-result correct-bg";
      showConfetti();
      if (result.comboCount >= 2) {
        showComboPopup(result.comboCount, result.comboMultiplier);
      }
    } else {
      resultEl.innerHTML = `<span class="incorrect">不正解...</span>`;
      resultEl.className = "answer-result incorrect-bg";
      showShake();
    }

    let detailHTML = `<p class="answer-word">答え: <strong>${result.answer}</strong></p>`;
    if (result.correct) {
      let pointsBreakdown = `${result.basePoints}pt`;
      if (result.comboMultiplier > 1) {
        pointsBreakdown += ` x${result.comboMultiplier}`;
      }
      if (result.timeBonus > 0) {
        pointsBreakdown += ` +${result.timeBonus}pt(時間)`;
      }
      detailHTML += `<p class="answer-points">+${result.points}pt</p>`;
      detailHTML += `<p class="answer-points-detail">${pointsBreakdown}（ヒント${result.hintsUsed}で正解 / ${result.timeRemaining}秒残り）</p>`;
      if (result.comboCount >= 2) {
        detailHTML += `<p class="answer-combo">${result.comboCount} COMBO!</p>`;
      }
    }

    // 質問文の和訳（キーワードを赤字ハイライト）
    detailHTML += `<div class="translation-section">`;
    detailHTML += `<h3 class="section-title">ヒントと和訳</h3>`;
    result.questions.forEach((q, i) => {
      const kw = result.keywords[i];
      const highlightedEn = kw ? highlightKeyword(q, kw.word) : q;
      const highlightedJa = kw ? highlightKeyword(result.translations[i], kw.meaning) : result.translations[i];
      detailHTML += `
        <div class="translation-item">
          <p class="translation-en">${highlightedEn}</p>
          <p class="translation-ja">${highlightedJa}</p>
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
    const isDaily = GameMaster.getIsDailyMode();
    const level = GameMaster.getCurrentLevel();
    const levels = QuestionMaster.getLevels();
    const titles = GameMaster.getTitles();
    const maxCombo = GameMaster.getMaxCombo();

    // ハイスコア保存
    const isNewRecord = GameMaster.saveHighScore(level);

    // デイリー完了マーク
    if (isDaily) {
      GameMaster.markDailyCompleted(level);
    }

    const titleEl = document.getElementById("final-title-text");
    let titleText = isDaily ? "デイリーチャレンジ結果" : isReview ? "復習結果" : "結果発表";
    if (level && levels[level]) {
      titleText += ` - ${levels[level].label}`;
    }
    titleEl.textContent = titleText;

    // 新記録表示
    let newRecordHTML = "";
    if (isNewRecord) {
      newRecordHTML = `<div class="new-record">🎉 NEW RECORD! 🎉</div>`;
    }

    document.getElementById("final-score").innerHTML = `
      ${newRecordHTML}
      <div class="rank" style="color: ${rank.color}">${rank.rank}</div>
      <div class="rank-label">${rank.label}</div>
      <div class="score-display">${score} pt</div>
      <div class="max-combo-display">最大コンボ: ${maxCombo}</div>
    `;

    // 称号表示
    const titlesEl = document.getElementById("final-titles");
    if (titles.length > 0) {
      let titlesHTML = '<div class="titles-section"><h3 class="section-title">獲得した称号</h3>';
      titles.forEach(t => {
        titlesHTML += `
          <div class="title-badge">
            <span class="title-icon">${t.icon}</span>
            <div class="title-info">
              <span class="title-name">${t.title}</span>
              <span class="title-desc">${t.desc}</span>
            </div>
          </div>
        `;
      });
      titlesHTML += '</div>';
      titlesEl.innerHTML = titlesHTML;
      titlesEl.style.display = "block";
    } else {
      titlesEl.style.display = "none";
    }

    // 内訳
    let breakdownHTML = '<div class="breakdown-list">';
    results.forEach((r, i) => {
      const icon = r.correct ? "&#x2B55;" : "&#x274C;";
      let detailParts = [];
      if (r.correct) {
        detailParts.push(`ヒント${r.hintsUsed}`);
        if (r.comboCount >= 2) detailParts.push(`${r.comboCount}コンボ`);
        if (r.timeBonus > 0) detailParts.push(`+${r.timeBonus}時間pt`);
      }
      breakdownHTML += `
        <div class="breakdown-item ${r.correct ? 'item-correct' : 'item-incorrect'}">
          <span class="breakdown-icon">${icon}</span>
          <span class="breakdown-answer">Q${i + 1}: ${r.answer}</span>
          <span class="breakdown-hints">${detailParts.join(" / ")}</span>
          <span class="breakdown-points">${r.correct ? '+' + r.points + 'pt' : '0pt'}</span>
        </div>
      `;
    });
    breakdownHTML += "</div>";
    document.getElementById("final-breakdown").innerHTML = breakdownHTML;

    // ハイスコアランキング
    const rankingEl = document.getElementById("final-ranking");
    const highScores = GameMaster.getHighScores(level);
    if (highScores.length > 0) {
      let rankHTML = '<div class="ranking-section"><h3 class="section-title">🏆 ランキング TOP5</h3>';
      highScores.forEach((hs, i) => {
        const medals = ["🥇", "🥈", "🥉"];
        const medal = i < 3 ? medals[i] : `${i + 1}.`;
        const isCurrent = hs.score === score && isNewRecord && i === 0;
        rankHTML += `
          <div class="ranking-item ${isCurrent ? 'ranking-current' : ''}">
            <span class="ranking-medal">${medal}</span>
            <span class="ranking-score">${hs.score}pt</span>
            <span class="ranking-combo">最大${hs.combo}コンボ</span>
            <span class="ranking-date">${hs.date}</span>
          </div>
        `;
      });
      rankHTML += '</div>';
      rankingEl.innerHTML = rankHTML;
      rankingEl.style.display = "block";
    } else {
      rankingEl.style.display = "none";
    }

    // 復習ボタン表示
    const reviewBtn = document.getElementById("btn-review-final");
    if (GameMaster.hasReviewStock(level)) {
      const count = GameMaster.getReviewStockCount(level);
      reviewBtn.textContent = `間違えた問題を復習する（${count}問）`;
      reviewBtn.style.display = "block";
    } else {
      reviewBtn.style.display = "none";
    }

    // 正解エフェクト
    const correctCount = results.filter(r => r.correct).length;
    if (correctCount === results.length && results.length > 0) {
      showConfetti();
    }

    showScreen("final");
  }

  return {
    showScreen,
    renderStartScreen,
    renderQuiz,
    renderAnswer,
    renderFinal,
    updateTimerDisplay,
    showConfetti,
    showShake,
    showComboPopup
  };
})();
