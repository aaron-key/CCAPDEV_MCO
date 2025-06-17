// When the document is loaded, check if the user is logged in
// If logged in, show the dashboard; otherwise, show auth.html
// document.addEventListener("DOMContentLoaded", function() {
//     const userSession = localStorage.getItem("userSession");

//     if (!userSession || userSession !== "loggedIn") {
//         window.location.href = "auth.html"; // Redirect unauthorized users
//     } else {
//         document.getElementById("dashboardSection").style.display = "block"; // Ensure dashboard is visible
//     }
// });

// // Logout Logic
// document.getElementById("logout").addEventListener("click", function() {
//     localStorage.removeItem("userSession"); // Clear login session
//     localStorage.removeItem("currentUser"); // Remove user data
//     alert("Logged out successfully.");
//     window.location.href = "auth.html"; // Redirect to login/register page
// });

// Dashboard logic

function retrieveStudentList() {
    let listString = localStorage.getItem("studentList");
    let list = [];

    if(listString) {
        try {
            list = JSON.parse(listString);
            // ensure list is an array
            if(!Array.isArray(list)) {
                list = []; 
            }
        } catch (e) {
            // if parsing fails, treat as empty array
            list = [];
        }
    }

    return list;
}

function retrieveTechList() {
    let listString = localStorage.getItem("techList");
    let list = [];

    if(listString) {
        try {
            list = JSON.parse(listString);

            if(!Array.isArray(list)) {
                list = [];
            }
        } catch (e) {
            list = [];
        }
    }

    return list;
}

function retrieveLabList() {
    let listString = localStorage.getItem("labList");
    let list = [];

    if(listString) {
        try {
            list = JSON.parse(listString);

            if(!Array.isArray(list)) {
                list = [];
            }
        } catch (e) {
            list = [];
        }
    }

    return list;
}

function retrieveReservationList() {
    let listString = localStorage.getItem("reservationList");
    let list = [];

    if(listString) {
        try {
            list = JSON.parse(listString);

            if(!Array.isArray(list)) {
                list = [];
            }
        } catch (e) {
            list = [];
        }
    }

    return list;
}

function generateStudentID() {
    let list = retrieveStudentList();
    let id = 0;

    // find highest id within list
    for(let i = 0; i < list.length; i++) {
        if(id < list[i].studentID) {
            id = list[i].studentID;
        }
    }

    // return highest + 1 as new id
    return id + 1;
}

function generateTechID() {
    let list = retrieveTechList();
    let id = 0;

    for(let i = 0; i < list.length; i++) {
        if(id < list[i].techID) {
            id = list[i].techID;
        }
    }

    return id + 1;

}

function generateLabID() {
    let list = retrieveLabList();
    let id = 0;

    for(let i = 0; i < list.length; i++) {
        if(id < list[i].labID) {
            id = list[i].labID;
        }
    }

    return id + 1;
}

function generateReservationID() {
    let list = retrieveReservationList();
    let id = 0;

    for(let i = 0; i < list.length; i++) {
        if(id < list[i].reservationID) {
            id = list[i].reservationID;
        }
    }

    return id + 1;
}

function addReservation() {
    // retrieve info from form and retrieve reservation list
    let reservationList = retrieveReservationList();
    let reservationID = generateReservationID();
    let currentUser = JSON.parse(localStorage.getItem("currentUser")); // gets current user from local storage
    let studentID = currentUser.studentID; // sets student ID from current user
    let labID = document.getElementById("selectLab").value;
    let requestDate = new Date().toISOString();
    let reservedDate = document.getElementById("selectDate").value;
    let reservedTime = document.getElementById("selectTime").value;
    let reservedSeat = document.getElementById("selectSeat").value;
    let hasOverlap;
    let newReservation;

    // check for overlapping reservations
    hasOverlap = reservationList.some(reservation =>
        reservation.labID === labID &&
        reservation.reservedDate === reservedDate &&
        reservation.reservedTime === reservedTime &&
        reservation.reservedSeat === reservedSeat
    )

    if(hasOverlap) {
        alert("Slot is already reserved.")
        return;
    }

    // create a new reservation, push it onto the list, and store locally
    newReservation = {
        reservationID: reservationID,
        studentID: studentID,
        labID: labID,
        requestDate: requestDate,
        reservedDate: reservedDate,
        reservedTime: reservedTime,
        reservedSeat: reservedSeat,
    }

    reservationList.push(newReservation);
    localStorage.setItem("reservationList", JSON.stringify(reservationList));
    alert("Reservation added successfully"); // temporary alert for checking
}

function viewReservation() {
    // update table with relevant information about reservations
    let reservationList = retrieveReservationList();
    let reservationView = document.getElementById("reservationView");
    let studentID = localStorage.getItem("currentUser")

    // remove previous information
    reservationView.innerHTML = '';

    // filter the list to reservations belonging to the student
    reservationList.filter(reservation => reservation.studentID == studentID);

    for(let i = 0; i < reservationList.length; i++) {
        let row = reservationView.insertRow();
        let labID = row.insertCell(0);
        let reservedDate = row.innerCell(1);
        let reservedTime = row.innerCell(2);
        let reservedSeat = row.innerCell(3);
        let requestDate = row.insertCell(4);
        labID.innerHTML = reservationView[i].labID;
        reservedDate = reservationList[i].reservedDate;
        reservedTime = reservationList[i].reservedTime;
        reservedSeat.innerHTML = reservationList[i].reservedSeat;
        requestDate.innerHTML = reservationList[i].requestDate;
    }

}

function editReservation() {
    // get reservation ID to edit reservation details
}

function deleteReservation() {
    let reservationList = retrieveReservationList();

}

function updateTimeSelection() {
    // compare the labs seats and times against those found under reservations
    // each labs has a set of seats and time slots per day
    let reservationList = retrieveReservationList();

}

function updateSeatSelection() {
    // compare the labs seats against those found under reservations
    let reservationList = retrieveReservationList();


}

// temp
function deleteAllReservations() {
    localStorage.setItem("reservationList", JSON.stringify([]));
    alert("All reservations removed successfully.");
}

//========================================================================================================

// reserve and delete slots
document.getElementById("reserveSlot").addEventListener("click", addReservation);
document.getElementById("removeReservations").addEventListener("click", deleteAllReservations);

// 