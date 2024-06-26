function login(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Example fetch request to authenticate with backend
  fetch("http://localhost:5000/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Login failed");
      }
    })
    .then((data) => {
      // Display success message and check mark
      const loginMessage = document.getElementById("loginMessage");
      loginMessage.innerHTML =
        'Successfully logged in <span class="success-icon">&#10004;</span>';
      loginMessage.style.display = "block";

      // Redirect to home page or desired location
      setTimeout(() => {
        window.location.href = "../index.html"; // Redirect after 2 seconds
      }, 1000); // 2000 milliseconds = 2 seconds
    })
    .catch((error) => {
      console.error("Login error:", error);
      const loginMessage = document.getElementById("loginMessage");
      loginMessage.textContent = "Login failed. Please try again.";
      loginMessage.style.display = "block";
    });
}
// Disable back and forward navigation
history.pushState(null, null, document.URL);
window.addEventListener("popstate", function () {
  history.pushState(null, null, document.URL);
});
