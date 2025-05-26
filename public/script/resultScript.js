document.addEventListener("DOMContentLoaded", () => {
  const result = JSON.parse(localStorage.getItem("quizResult"));
  const user = JSON.parse(localStorage.getItem("quizUser"));

  if (!result || !user) {
    alert("Result data missing. Please take the quiz first.");
    window.location.href = "/questions";
    return;
  }

  document.getElementById("name").textContent = user.name;
  document.getElementById("email").textContent = user.email;
  document.getElementById("score").textContent = `${result.score} / 5`;
  document.getElementById("rank").textContent = result.rank || "-";
  document.getElementById("status").textContent = result.passed ? "Pass" : "Fail";

});
