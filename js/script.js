// When the document is loaded, check if the user is logged in
// If logged in, show the dashboard; otherwise, show auth.html
document.addEventListener("DOMContentLoaded", function() {
    const userSession = localStorage.getItem("userSession");

    if (!userSession || userSession !== "loggedIn") {
        window.location.href = "auth.html"; // Redirect unauthorized users
    } else {
        document.getElementById("dashboardSection").style.display = "block"; // Ensure dashboard is visible
    }
});

// Logout Logic
document.getElementById("logout").addEventListener("click", function() {
    localStorage.removeItem("userSession"); // Clear login session
    localStorage.removeItem("currentUser"); // Remove user data
    alert("Logged out successfully.");
    window.location.href = "auth.html"; // Redirect to login/register page
});