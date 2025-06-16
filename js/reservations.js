// Kicks users to auth.html if not logged in
document.addEventListener("DOMContentLoaded", function() {
    const userSession = localStorage.getItem("userSession");

    // Redirect unauthorized users
    if (!userSession || userSession !== "loggedIn") {
        window.location.href = "auth.html";
        return;
    }

    const reservationsTable = document.getElementById("reservationsTable").querySelector("tbody");
    const filterType = document.getElementById("labFilter");
    const filterBtn = document.getElementById("filterReservations");

    // Function to display reservations (calls script.js functions)
    function loadReservations(lab = "all") {
        let reservations = JSON.parse(localStorage.getItem("reservationList")) || [];
        reservationsTable.innerHTML = ""; // Clear previous entries

        if (lab !== "all") {
            reservations = parseReservationsByLab(lab);
        }

        reservations.forEach(reservation => {
            let displayName = reservation.displayName || reservation.userEmail;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${reservation.labSelection}</td>
                <td>${reservation.slotTime}</td>
                <td>${reservation.slotSeat}</td>
                <td>
                    <a href="profile.html?user=${encodeURIComponent(reservation.userEmail)}">${displayName}</a>
                </td>
            `;
            reservationsTable.appendChild(row);
        });
    }

    // Attach filter functionality
    if (filterBtn) {
        filterBtn.addEventListener("click", function() {
            loadReservations(filterType.value);
        });
    }

    loadReservations(); // Load all reservations on page load
});