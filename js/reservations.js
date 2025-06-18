let dateOffset = 0;

function renderLabSchedule(labID) {
    const reservationView = document.getElementById("reservationView");
    const summary = document.getElementById("seatSummary");
    const currentDay = new Date();
    currentDay.setDate(currentDay.getDate() + dateOffset);
    const dateString = currentDay.toISOString().split("T")[0];
    const reservations = retrieveReservationList();
    const selectedLab = retrieveLabList().find(l => l.labID === labID);
    if (!selectedLab) return;

    const seats = selectedLab.seatList;
    const timeSlots = selectedLab.timeList;

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

    // table data
    timeSlots.forEach(time => {
        const row = reservationView.insertRow();
        row.insertCell().textContent = time;

        seats.forEach(seat => {
            const cell = row.insertCell();
            const match = reservations.find(r =>
                r.labID.toString() == labID.toString() &&
                r.reservedDate == dateString &&
                r.reservedTime == time.toString() &&
                r.reservedSeat.toString() == seat.toString()
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

function renderStudentReservations(labID) {
    const reservationView = document.getElementById("studentReservations");
    const reservationList = retrieveReservationList();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const selectedLabID = document.getElementById("selectLab").value;

    if(selectedLabID == "") return; // do not render if no lab was selected

    const selectedLab = retrieveLabList().find(l => l.labID == selectedLabID);
    const seats = selectedLab.seatList;
    const slots = selectedLab.timeList; 

    const selectedDay = new Date();
    selectedDay.setDate(selectedDay.getDate() + dateOffset);
    const dateString = selectedDay.toISOString().split("T")[0]; 

    // do not display if no lab is selected or if current user is not a student
    if (!selectedLab) return; 

    // reset the reservation view
    reservationView.innerHTML = ""; 

    // header row
    const header = reservationView.insertRow();
    header.insertCell().textContent = "Time";
    seats.forEach(seat => {
        const th = document.createElement("th");
        th.textContent = `Seat ${seat}`;
        header.appendChild(th);
    }); 

    // table data
    slots.forEach(time => {
        const row = reservationView.insertRow();
        row.insertCell().textContent = time;

        seats.forEach(seat => {
            const cell = row.insertCell();
            const match = reservationList.find(r =>
                r.labID.toString() == labID.toString() &&
                r.reservedDate == dateString &&
                r.reservedTime == time.toString() &&
                r.reservedSeat.toString() == seat.toString() &&
                r.studentID == currentUser.studentID // reservation must belong to the student
            );

            if (match) {
                cell.textContent = `Reserve (${match.reservationID})`;
            } else {
                cell.textContent = "Open";
            }
        });
    }); 
}

function updateSelectReservation() {
    const select = document.getElementById("selectReservation");
    const reservationList = retrieveLabList();
    const defaultOption = document.createElement("option");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if(!Object.hasOwn(currentUser, "studentID")) return;

    // filter reservations belonging to the current day + student
    //const currentReservations = reservationList.filter(r => r.)

    const currentDay = new Date();
    currentDay.setDate(currentDay.getDate() + dateOffset);
    const dateString = currentDay.toISOString().split("T")[0];

    // clear selection
    select.innerHTML = "";
    defaultOption.value = "";
    defaultOption.text = "---select a lab---";
    defaultOption.selected = true;
    defaultOption.disabled = true;
    select.appendChild(defaultOption);

    // populate reservation select
    for(let i = 0; i < currentReservations.length; i++) {
        let option = document.createElement("option");
        let rID = currentReservations[i].reservationID;
        option.value = rID;
        option.textContent = `Reservation: ${rID}`;
        option.appendChild(option);
    }
}

function displayReservationInfo(reservationID) {
    const reservationInfo = document.getElementById("reservationInfo");
    const rID = reservationID.slice(1);
    const currentReservation = retrieveReservationList().find(r => r.reservationID == reservationID);
    
    // store current reservation info until page is left
    localStorage.setItem("currentReservation", JSON.stringify(currentReservation));

    // clear reservation info
    reservationInfo.innerHTML = '';

    // append information onto reservation info
    Object.keys(currentReservation).forEach(key => {
        const p = document.createElement("p");
        p.textContent = `${key}: ${currentReservation[key]}`;
        reservationInfo.appendChild(p);
        reservationInfo.appendChild(document.createElement("br"));
    });
}

document.getElementById("selectLab").addEventListener("change", () => {
    const labID = document.getElementById("selectLab").value;

    if(window.location.href.endsWith("reservations.html")) {
        renderStudentReservations(labID)
    } else {
        renderLabSchedule(labID);
    }
});

// calls the function to render the schedule on page load (dashboard / reservations)
document.addEventListener("DOMContentLoaded", () => {
    const labID = document.getElementById("selectLab").value;

    if(window.location.href.endsWith("reservations.html")) {
        renderStudentReservations(labID);
    } else {
        renderLabSchedule(labID);
    }
});

document.getElementById("nextDay").addEventListener("click", () => {
    if (dateOffset < 6) {
        dateOffset++;

        if(window.location.href.endsWith("reservations.html")) {
            renderStudentReservations(document.getElementById("selectLab").value);
        } else {
            renderLabSchedule(document.getElementById("selectLab").value);
        }
    }
});

document.getElementById("prevDay").addEventListener("click", () => {
    if (dateOffset > 0) {
        dateOffset--;
        
        if(window.location.href.endsWith("reservations.html")) {
            renderStudentReservations(document.getElementById("selectLab").value);
        } else {
            renderLabSchedule(document.getElementById("selectLab").value);
        }
    }
});