  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailEl = document.getElementById("logEmail");
    const passEl = document.getElementById("logPassword");

    const email = emailEl.value.trim();
    const password = passEl.value;
    let valid = true;

    [emailEl, passEl].forEach(el => el.classList.remove("error-border"));
    ["logEmailError", "logPasswordError"].forEach(id => {
      document.getElementById(id).textContent = "";
    });

    if (!email) {
      document.getElementById("logEmailError").textContent = "Email is required.";
      emailEl.classList.add("error-border");
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      document.getElementById("logEmailError").textContent = "Enter a valid email.";
      emailEl.classList.add("error-border");
      valid = false;
    }

    if (!password) {
      document.getElementById("logPasswordError").textContent = "Password is required.";
      passEl.classList.add("error-border");
      valid = false;
    }

    if (!valid) return;

    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const user = await res.json();
      localStorage.setItem('quizUser', JSON.stringify(user));
      window.location.href = "/questions";
    } else {
      const err = await res.json();
      document.getElementById("logEmailError").textContent = err.message || "Login failed";
      emailEl.classList.add("error-border");
    }
  });