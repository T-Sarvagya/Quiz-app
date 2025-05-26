document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("quizForm");
  const container = document.getElementById("questionsContainer");
  const errorDiv = document.getElementById("error");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const btnSpinner = document.getElementById("btnSpinner");

  let questions = [];

  function setupDragAndDrop() {
    document.querySelectorAll(".draggable").forEach(item => {
      item.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", item.dataset.value);
        e.dataTransfer.setData("origin", item.parentElement.id);
      });
    });

    document.querySelectorAll(".dropzone, .drag-options").forEach(zone => {
      zone.addEventListener("dragover", e => e.preventDefault());

      zone.addEventListener("drop", e => {
        e.preventDefault();
        const value = e.dataTransfer.getData("text/plain");
        const originId = e.dataTransfer.getData("origin");
        const dropZone = e.target.closest(".dropzone, .drag-options");
        const dropContainer = dropZone.querySelector(".dropped-items") || dropZone;

        const existing = [...dropContainer.querySelectorAll(".draggable")].find(el => el.dataset.value === value);
        if (existing) return;

        const origin = document.getElementById(originId);
        const item = [...origin.children].find(el => el.dataset.value === value);
        if (item) dropContainer.appendChild(item);
      });
    });
  }

  try {
    const res = await fetch("/random");
    questions = await res.json();

    container.innerHTML = `<h2>Answer All Questions</h2>`;

    questions.forEach((q, index) => {
      const qId = String(q.id);
      const block = document.createElement("div");
      block.classList.add("question-block");

      let html = `<p>${index + 1}. ${q.question} <span style="color:red">*</span></p>`;

      if (q.type === "single" || q.type === "multiple") {
        const inputType = q.type === "multiple" ? "checkbox" : "radio";
        html += q.options.map(opt => `
          <label>
            <input type="${inputType}" name="${qId}" value="${opt}" /> ${opt}
          </label><br />
        `).join('');
      }

      if (q.type === "drag") {
        html += `
          <div class="drag-options" id="${qId}-options">
            ${q.dragOptions.map(opt => `<div class="draggable" draggable="true" data-value="${opt}">${opt}</div>`).join('')}
          </div>
          <div class="dropzones">
            ${q.categories.map(cat => `
              <div class="dropzone" data-category="${cat}">
                <strong>${cat}</strong>
                <div class="dropped-items" id="${qId}-${cat}"></div>
              </div>
            `).join('')}
          </div>
        `;
      }

      block.innerHTML = html;
      container.appendChild(block);
    });

    setupDragAndDrop();

  } catch (err) {
    container.innerHTML = "<p style='color:red;'>Failed to load questions.</p>";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorDiv.textContent = "";
    submitBtn.disabled = true;
    btnText.textContent = "Submitting...";
    btnSpinner.style.display = "inline-block";

    const user = JSON.parse(localStorage.getItem("quizUser"));
    const name = user?.name || "";
    const email = user?.email || "";

    if (!name || !email) {
      errorDiv.textContent = "You must be logged in to take the quiz.";
      resetButton();
      return;
    }

    const answers = {};
    let valid = true;

    questions.forEach((q) => {
      const qId = String(q.id);

      if (q.type === "single") {
        const selected = document.querySelector(`input[name="${qId}"]:checked`);
        if (!selected) valid = false;
        else answers[qId] = selected.value;

      } else if (q.type === "multiple") {
        const selected = [...document.querySelectorAll(`input[name="${qId}"]:checked`)];
        if (selected.length === 0) valid = false;
        else answers[qId] = selected.map(el => el.value);

      } else if (q.type === "drag") {
        const map = {};
        q.categories.forEach(cat => {
          const zone = document.getElementById(`${qId}-${cat}`);
          if (!zone) {
            map[cat] = [];
          } else {
            const dropped = [...zone.querySelectorAll(".draggable")].map(el => el.dataset.value);
            map[cat] = dropped;
          }
        });
        const hasAny = Object.values(map).some(arr => arr.length > 0);
        if (!hasAny) valid = false;
        else answers[qId] = map;
      }
    });

    if (!valid) {
      errorDiv.textContent = "All questions are mandatory.";
      resetButton();
      return;
    }

    try {
      const res = await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, answers })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("quizUser", JSON.stringify({ name, email }));
        localStorage.setItem("quizResult", JSON.stringify(data));
        window.location.href = "/result";
      } else {
        errorDiv.textContent = data.message || "Submission error.";
      }
    } catch (err) {
      errorDiv.textContent = "Server error.";
    } finally {
      resetButton();
    }
  });

  function resetButton() {
    submitBtn.disabled = false;
    btnText.textContent = "Submit Quiz";
    btnSpinner.style.display = "none";
  }
});