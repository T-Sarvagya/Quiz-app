 document.getElementById("registerForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameEl = document.getElementById("regName");
      const emailEl = document.getElementById("regEmail");
      const passEl = document.getElementById("regPassword");
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

      const name = nameEl.value.trim();
      const email = emailEl.value.trim();
      const password = passEl.value;
      let valid = true;

      [nameEl, emailEl, passEl].forEach(el => el.classList.remove("error-border"));
      ["regNameError", "regEmailError", "regPasswordError"].forEach(id => {
        document.getElementById(id).textContent = "";
      });

      if (!name) {
        document.getElementById("regNameError").textContent = "Name is required.";
        nameEl.classList.add("error-border");
        valid = false;
      } else if (!/^[A-Za-z\s]+$/.test(name)) {
        document.getElementById("regNameError").textContent = "Name must only contain letters.";
        nameEl.classList.add("error-border");
        valid = false;
      }

      if (!email) {
        document.getElementById("regEmailError").textContent = "Email is required.";
        emailEl.classList.add("error-border");
        valid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        document.getElementById("regEmailError").textContent = "Enter a valid email.";
        emailEl.classList.add("error-border");
        valid = false;
      }

      if (!password) {
        document.getElementById("regPasswordError").textContent = "Password is required.";
        passEl.classList.add("error-border");
        valid = false;
      } else if(!/^(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)){
        document.getElementById("regPasswordError").textContent = "Password must be at least 8 characters and include a letter, number, and symbol";
        passEl.classList.add("error-border");
        valid = false;
      }

      if (!valid) return;

      const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (res.ok) {
        localStorage.setItem('quizUser', JSON.stringify({ name, email }));
        window.location.href = "/questions";
      } else {
        const err = await res.json();
        document.getElementById("regEmailError").textContent = err.message || "Registration failed";
        emailEl.classList.add("error-border");
      }
    });