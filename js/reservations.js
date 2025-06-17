let dateOffset = 0;

function renderLabSchedule(labID) {
    const reservationView = document.getElementById("reservationView");
    const summary = document.getElementById("seatSummary");
    const currentDay = new Date();
    currentDay.setDate(currentDay.getDate() + dateOffset);
    const dateString = currentDay.toISOString().split("T")[0];
    const reservations = retrieveReservationList();
    const seats = ["A", "B", "C"];
    const timeSlots = ["10:00-10:30", "10:30-11:00", "11:00-11:30"];

    let totalSlots = seats.length * timeSlots.length;
    let reservedCount = 0;

    reservationView.innerHTML = "";

    // header row
    const header = reservationView.insertRow();
    header.insertCell().textContent = "Time";
    seats.forEach(seat => {
        const th = document.createElement("th");
        th.textContent = `Seat ${seat}`;
        header.appendChild(th);
    });

    timeSlots.forEach(time => {
        const row = reservationView.insertRow();
        row.insertCell().textContent = time;

        seats.forEach(seat => {
            const cell = row.insertCell();
            const match = reservations.find(r =>
                r.labID === labID &&
                r.reservedDate === dateString &&
                r.reservedTime === time &&
                r.reservedSeat === seat
            );

            if (match) {
                const link = document.createElement("a");
                link.href = `profile.html?user=${encodeURIComponent(match.studentID)}`;
                link.textContent = match.displayName || "Reserved";
                cell.appendChild(link);
                reservedCount++;
            } else {
                cell.textContent = "Open";
            }
        });
    });

    const available = totalSlots - reservedCount;
    summary.textContent = `Seats available: ${available} / ${totalSlots} on ${dateString}`;
}

document.getElementById("labSelector").addEventListener("change", () => {
    const selectedLab = document.getElementById("labSelector").value;
    renderLabSchedule(selectedLab);
});

// calls the function to render the schedule on page load
document.addEventListener("DOMContentLoaded", () => {
    const labSelector = document.getElementById("labSelector");
    renderLabSchedule(labSelector.value);
});

document.getElementById("nextDay").addEventListener("click", () => {
    if (dateOffset < 6) {
        dateOffset++;
        renderLabSchedule(document.getElementById("labSelector").value);
    }
});

document.getElementById("prevDay").addEventListener("click", () => {
    if (dateOffset > 0) {
        dateOffset--;
        renderLabSchedule(document.getElementById("labSelector").value);
    }
});