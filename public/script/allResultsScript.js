    fetch("/results")
      .then(res => res.json())
      .then(data => {
        const div = document.getElementById("resultsTable");

        if (data.length === 0) {
          div.innerHTML = "<p>No records found.</p>";
          return;
        }

        const user = JSON.parse(localStorage.getItem("quizUser"));
        if(!user || !user.email){
            alert("You must be logged in to access the leaderboard");
            window.location.href = "/login";
        }

        let table = `<table class="result-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Email</th>
              <th>Score</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>`;

        data.forEach(user => {
          table += `
            <tr>
              <td>${user.rank}</td>
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td>${user.score}</td>
              <td>${user.result}</td>
            </tr>`;
        });

        table += "</tbody></table>";
        div.innerHTML = table;
      })
      .catch(() => {
        document.getElementById("resultsTable").innerText = "Error loading results.";
      });

    function logout() {
  localStorage.removeItem('quizUser');
  localStorage.removeItem('quizResult');
  window.location.href = '/login';
}