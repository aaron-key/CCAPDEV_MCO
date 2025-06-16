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




// Dashboard logic

/**
 * returns a list of reservations by lab
 * @param {*} lab 
 */
function parseReservationsByLab(lab) {
    //let reservationList = [];
    //localStorage.getItem("reservationList");


    //return reservationList;
}

/**
 * returns a list of reservations by student
 * @param {*} student 
 */
function parseReservationsByStudent(student) {

}


/**
 * populate the table with the lab's available slots per time interval in the format:
 * date & time || # of available slots
 */
function displaySlots() {
    // 
}

/**
 * 
 */
function displayReservedSlots() {

}



/**
 * 
 */
function generateReservationID(reservationList) {
    let generatedID = 0;

    if(reservationList.length === 0) {
        generateID = 1;
    } else {
        for(let i = 0; i < reservationList.length; i++) {
            if(generatedID < reservationList[i].reservationID) {
                generatedID = reservationList[i].reservationID;
            }
        }
        
    }

    // return the highest reservationID plus 1 to create a new reservationID
    return generatedID + 1;
}

/**
 * adds a reservation 
 */
function addReservation() {
    // retrieve the list of reservations and form elements
    let reservationList = localStorage.getItem("reservationList");
    let labSelection = document.getElementById("labSelect");
    let slotTime = document.getElementById("labTime");
    let slotSeat = document.getElementById("labSeat");
    let reservationID;
    let hasOverlap;
    let newReservation;

    // parse the string into an array
    try {
        reservationList = JSON.parse(reservationList);

        // if parsed object is not array, set as empty array
        if(!Array.isArray(reservationList)) { 
            reservationList = [];
        }
    } catch(e) {
        reservationList = []; // start as empty if no reservation lists exist
    }

    // get values and prepare to create a new reservation
    labSelection = labSelection.options[labSelection.selectedIndex].value;
    slotTime = slotTime.options[slotTime.selectedIndex].value;
    slotSeat = slotSeat.options[slotSeat.selectedIndex].value;
    reservationID = generateReservationID(reservationList);

    // ensure that the reservation does not overlap with an existing reservation
    hasOverlap = reservationList.some(reservation =>
        reservation.labSelection === labSelection &&
        reservation.slotTime === slotTime &&
        reservation.slotSeat === slotSeat
    )

    if (hasOverlap) {
        alert("Reservation already exists");
        return;
    }

    // create new reservation object
    newReservation = {
        reservationID: reservationID,
        labSelection: labSelection,
        slotTime: slotTime,
        slotSeat: slotSeat
    }

    // push the reservation object onto the list
    reservationList.push(newReservation)

    // save the list
    localStorage.setItem("reservationList", JSON.stringify(reservationList));
    alert("Reservation successfully added");
}

// temp function to delete reservations
function deleteAllReservations() {
    localStorage.removeItem("reservationList");
    alert("All reservations have been removed!");
}

// reserve and delete slots
document.getElementById("reserveSlots").addEventListener("click", addReservation);
document.getElementById("removeReservations").addEventListener("click", deleteAllReservations);