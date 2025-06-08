// Toggle between register and login views
function toggleAuthView(view) {
    document.getElementById("registerSection").style.display = view === "register" ? "block" : "none";
    document.getElementById("loginSection").style.display = view === "login" ? "block" : "none";
}

// Registration Logic
document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const accountType = document.getElementById("accountType").value;

    if (!email.endsWith("@dlsu.edu.ph")) {
        alert("Please use a valid DLSU email.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let existingUser = users.find(u => u.email === email);

    if (existingUser) {
        alert("This email is already registered. Please log in instead.");
        return;
    }

    users.push({ email, password, accountType });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! You can now log in.");
    toggleAuthView("login");
});

// Login Logic
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem("userSession", "loggedIn"); // Store login session
        localStorage.setItem("currentUser", JSON.stringify(user)); // Save user data

        alert("Login successful!");
        window.location.href = "index.html"; // Redirect to dashboard
    } else {
        alert("Invalid credentials.");
    }
});