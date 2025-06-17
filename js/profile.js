document.addEventListener("DOMContentLoaded", function() {
const imageUpload = document.getElementById("imageUpload");
    const profileImage = document.getElementById("profileImage");
    const profileDescription = document.getElementById("profileDescription");
    const displayNameInput = document.getElementById("displayName");
    const saveProfile = document.getElementById("saveProfile");
    const userSession = localStorage.getItem("userSession");
    const deleteSection = document.getElementById("deleteSection");

    if (!userSession || userSession !== "loggedIn") {
        window.location.href = "auth.html"; // Kick back to auth if not logged in
        return; // Stop the rest of the script from running
    }

    const urlParams = new URLSearchParams(window.location.search);
    const requestedUserID = urlParams.get("user"); // Get user id (student id) from URL
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    let profileKey = requestedUserID && requestedUserID !== currentUser.studentID
        ? `profile_${requestedUserID}`
        : `profile_${currentUser.studentID}`;
    let userProfile = JSON.parse(localStorage.getItem(profileKey)) || {}; // ✅ Fetch specific profile

    const isOwnProfile = !requestedUserID || parseInt(requestedUserID) === currentUser.studentID;

    if (!isOwnProfile) {
        // Viewing non-existing user's profile
        if (!userProfile.displayName && !userProfile.description && !userProfile.image) {
            alert("User profile not found.");
            window.location.href = "reservations.html";
            return;
        }

        profileImage.src = userProfile.image || "img/default-avatar.jpg";
        displayNameInput.value = userProfile.displayName || requestedUserID;
        showUserReservations(parseInt(requestedUserID));
        profileDescription.value = userProfile.description || "No description available.";

        // Disable editing fields for another user's profile
        displayNameInput.disabled = true;
        profileDescription.disabled = true;
        imageUpload.style.display = "none"; // Hide image upload
        saveProfile.style.display = "none"; // Hide save button
        deleteSection.style.display = "none"; // Hide delete account section
    } else {
        // Viewing own profile (normal functionality)
        if (userProfile.image) profileImage.src = userProfile.image;
        if (userProfile.description) profileDescription.value = userProfile.description;
        if (userProfile.displayName) displayNameInput.value = userProfile.displayName;
        showUserReservations(currentUser.studentID);
    }

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
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser || !currentUser.email) {
            alert("Error: No logged-in user detected.");
            return;
        }

        const updatedProfile = {
            image: profileImage.src,
            description: profileDescription.value.trim(),
            displayName: displayNameInput.value.trim()
        };

        localStorage.setItem(`profile_${currentUser.studentID}`, JSON.stringify(updatedProfile)); // stores profile data by student id
        alert("Profile updated successfully!");
    });

    // Back button logic
    document.getElementById("backToDashboard").addEventListener("click", function() {
        window.location.href = "dashboard.html";
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

        alert("Your account has been deleted.");
        window.location.href = "auth.html";
    });
});

function showUserReservations(userID) {
    const reservationTable = document.getElementById("userReservationTable");
    const allReservations = retrieveReservationList();
    const userReservations = allReservations.filter(r => r.studentID === parseInt(userID));

    if (userReservations.length === 0) {
        reservationTable.innerHTML = "<tr><td colspan='4' style='text-align:center;'>This user has no reservations yet.</td></tr>";
        return;
    }

    reservationTable.innerHTML = "";

    const header = reservationTable.insertRow();
    ["Lab", "Date", "Time", "Seat"].forEach(label => {
        const th = document.createElement("th");
        th.textContent = label;
        header.appendChild(th);
    });

    userReservations.forEach(res => {
        const row = reservationTable.insertRow();
        row.insertCell().textContent = res.labID;
        row.insertCell().textContent = res.reservedDate;
        row.insertCell().textContent = res.reservedTime;
        row.insertCell().textContent = res.reservedSeat;
    });
}