document.addEventListener("DOMContentLoaded", function() {
    const imageUpload = document.getElementById("imageUpload");
    const profileImage = document.getElementById("profileImage");
    const profileDescription = document.getElementById("profileDescription");
    const saveProfile = document.getElementById("saveProfile");

    // Load existing profile data if available
    const userData = JSON.parse(localStorage.getItem("userProfile")) || {};
    if (userData.image) profileImage.src = userData.image;
    if (userData.description) profileDescription.value = userData.description;

    // Handle profile image upload
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

    // Save profile data
    saveProfile.addEventListener("click", function() {
        const updatedProfile = {
            image: profileImage.src,
            description: profileDescription.value.trim()
        };
        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
        alert("Profile updated successfully!");
    });
});
// Back to Dashboard Logic
document.getElementById("backToDashboard").addEventListener("click", function() {
    window.location.href = "index.html?dashboard=true"; // Pass a query parameter
});