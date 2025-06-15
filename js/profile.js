document.addEventListener("DOMContentLoaded", function() {
    const imageUpload = document.getElementById("imageUpload");
    const profileImage = document.getElementById("profileImage");
    const profileDescription = document.getElementById("profileDescription");
    const displayNameInput = document.getElementById("displayName");
    const saveProfile = document.getElementById("saveProfile");
    const userSession = localStorage.getItem("userSession");

    if (!userSession || userSession !== "loggedIn") {
        window.location.href = "auth.html"; // Kick back to auth if not logged in
        return; // Stop the rest of the script from running
    }

    // Load existing profile data from localStorage
    // If no data exists, initialize with default values
    const userData = JSON.parse(localStorage.getItem("userProfile")) || {};
    if (userData.image) profileImage.src = userData.image;
    if (userData.description) profileDescription.value = userData.description;
    if (userData.displayName) displayNameInput.value = userData.displayName;

    // Image upload logic
    imageUpload.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Save profile logic
    saveProfile.addEventListener("click", function() {
        const updatedProfile = {
            image: profileImage.src,
            description: profileDescription.value.trim(),
            displayName: displayNameInput.value.trim()
        };
        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
        alert("Profile updated successfully!");
    });

    // Back button logic
    document.getElementById("backToDashboard").addEventListener("click", function() {
        window.location.href = "index.html";
    });

    // Delete account logic
    document.getElementById("deleteAccount").addEventListener("click", function() {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.email) {
        alert("Unable to identify user.");
        return;
    }

    // Remove from users list
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.filter(u => u.email !== currentUser.email);
    localStorage.setItem("users", JSON.stringify(users));

    // Remove all user-related data
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userSession");
    localStorage.removeItem("userProfile");

    // To-add later: remove reservations tied to this user (after implementation)

    alert("Your account has been deleted.");
    window.location.href = "auth.html";
});
});
