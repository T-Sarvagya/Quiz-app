document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("quizUser"));
  if (!user) {
    alert("You must be logged in to access questions section");
    window.location.href = "/login";
    return;
  }


  document.getElementById("quizForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const answers = {
      q1: document.querySelector('input[name="q1"]:checked'),
      q2: document.querySelector('input[name="q2"]:checked'),
      q3: document.querySelector('input[name="q3"]:checked')
    };

    const errorDiv = document.getElementById("error");
    errorDiv.textContent = "";

   /* for (let key in answers) {
      if (!answers[key]) {
        errorDiv.textContent = "All questions are mandatory";
        return;
      }
    }*/

 /*   const submission = {
      name: user.name,
      email: user.email,
      answers: {
        q1: answers.q1.value,
        q2: answers.q2.value,
        q3: answers.q3.value
      }
    };*/


    // Capture selected checkbox values (q4)
    const selectedQ4 = [...document.querySelectorAll('input[name="q4"]:checked')].map(cb => cb.value);

    if (selectedQ4.length === 0) {
      errorDiv.textContent = "All questions are mandatory.";
      return;
    }

    // Collect dragged items into drop zones
    const dropData = {};
    document.querySelectorAll('.drop-box').forEach(box => {
      const category = box.dataset.category;
      const items = [...box.querySelectorAll('.draggable')].map(d => d.id);
      dropData[category] = items;
    });

    // Validate- all items used
    const totalDragged = Object.values(dropData).flat().length;
    if (totalDragged !== 4) {
      errorDiv.textContent = "Please match all technologies in the drag-and-drop question.";
      return;
    }

    // Build final answer payload
    const submission = {
      name: user.name,
      email: user.email,
      answers: {
        q1: answers.q1.value,
        q2: answers.q2.value,
        q3: answers.q3.value,
        q4: selectedQ4,
        q5: dropData
      }
    };

    const res = await fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(submission)
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("quizResult", JSON.stringify(data));
      window.location.href = "/result";
    } else {
      errorDiv.textContent = "Error submitting form";
    }
  });

  // Drag and Drop logic
  const draggables = document.querySelectorAll('.draggable');
  const dropBoxes = document.querySelectorAll('.drop-box');

  draggables.forEach(item => {
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', item.id);
    });
  });

  dropBoxes.forEach(box => {
    box.addEventListener('dragover', (e) => {
      e.preventDefault();
      box.classList.add('highlight');
    });

    box.addEventListener('dragleave', () => {
      box.classList.remove('highlight');
    });

    box.addEventListener('drop', (e) => {
      e.preventDefault();
      box.classList.remove('highlight');
      const draggedId = e.dataTransfer.getData('text/plain');
      const draggedElement = document.getElementById(draggedId);
      box.appendChild(draggedElement);
    });
  });

});
