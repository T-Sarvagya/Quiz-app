const result = JSON.parse(localStorage.getItem("quizResult"));
    if (result) {
      document.getElementById("userName").textContent = result.name;
      document.getElementById("userEmail").textContent = result.email;
      document.getElementById("userScore").textContent = result.score;
      document.getElementById("userRank").textContent = result.rank;
      document.getElementById("userStatus").textContent = result.result;
    } else {
      document.querySelector(".result-card").innerHTML = "<p>Result not found. Please take the quiz again.</p>";
    }

    function logout() {
  localStorage.removeItem('quizUser');
  localStorage.removeItem('quizResult');
  window.location.href = '/login';
}