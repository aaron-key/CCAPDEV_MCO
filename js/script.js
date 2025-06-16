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

}

function viewReservation() {

}

/**
 * parses the list of reservations stored locally and returns the list of reservations as an array
 * @returns array of reservations
 */
function parseReservations() {
    let reservationList = localStorage.getItem("reservationList")

    // convert the JSON list into an array
    try {
        reservationList = JSON.parse(reservationList);

        // if parsed object is not array, set as empty array
        if(!Array.isArray(reservationList)) { 
            reservationList = [];
        }
    } catch(e) {
        reservationList = []; // start as empty if no reservations exist
    }

    return reservationList;
}

/** 
 * parses the list of reservations for a lab and returns the list 
 * @param {String} labSelection - lab to which to parse seats for
 * @param {String} labTime - time interval to which to parse seats for
 * @returns list of available seats per time slot
 */
function parseSlotSeatsPerTime(labSelection, labTime) {
    // [] should also include date, for now only does everything on a single day
    // [] get values from lab's so that number of seats and seat letters is dynamic
    // returns the list of a lab's available seats at a given time
    const numberOfSeats = 10;
    const seatLetters = "ABCDEFGHIJ";
    let reservationList = parseReservations();
    let labSeatList = [];

    // filter the reservations by lab, then by time interval
    reservationList = reservationList.filter(reservation => reservation.labSelection === labSelection);
    reservationList = reservationList.filter(reservation => reservation.labTime === labTime);

    // assume 10 seats per lab, add lab seats to the list if they were not already reserved
    for(i = 0; i < numberOfSeats; i++) {
        if(!reservationList.some(reservation => reservation.labSeat === seatLetters.charAt(i))) {
            labSeatList.push(seatLetters.charAt(i));
        }
    }

    return labSeatList;
}

/**
 * parses the list of reservations for a lab and returns the list of  time slots and the no. of seats available per interval
 * @param {String} labSelection lab to parse time slots for
 * @returns list of available time slots and the number of seats
 */
function parseSlotTimes(labSelection) {
    // [] should include dates
    // returns the list of a lab's available time slots and the number of seats available
    const numberOfTimeSlots = 17; // 17 slots from 8:00 to 16:00
    let hour = 8;
    let minute = "00";
    let isHalfHour = false;
    let slotTime;
    let slotCount;

    let reservationList = parseReservations();
    let labTimeList = [];

    // filter the reservations by lab
    reservationList = reservationList.filter(reservation => reservation.labSelection === labSelection);

    for(i = 0; i < numberOfTimeSlots; i++) {
        slotTime = `${hour}:${minute}`;
        slotCount = parseSlotSeatsPerTime(labSelection, slotTime).length;

        // push the time slot and the no. of available seats onto the list
        labTimeList.push({
                slotTime: slotTime,
                slotCount: slotCount
            })

        if(isHalfHour) {
            hour++;
            minute = "00";
        } else {
            minute = "30";
        }
        isHalfHour = !isHalfHour;
    }

    return labTimeList;
}

/**
 * generates a reservationID for a reservation object
 */
function generateReservationID(reservationList) {
    let generatedID = 0;

    for(let i = 0; i < reservation.length; i++) {
        if(generatedID < reservationList[i].reservationID) {
            generatedID = reservationList[i].reservationID;
        }
    }

    // return the highest reservationID plus 1 to create a new reservationID
    return generatedID + 1;
}

/**
 * adds a reservation 
 */
function addReservation() {
    // [] need to record date of request
    // [] update student and currentUser to reflect an ID instead
    // [] need to add the option for anon reservation
    // [] slotTime should also include the date

    // retrieve the list of reservations and form elements
    let reservationList = localStorage.getItem("reservationList");
    let student = JSON.parse(localStorage.getItem("currentUser")).name;
    let labSelection = document.getElementById("labSelect");
    let slotTime = document.getElementById("labTime");
    let slotSeat = document.getElementById("labSeat");
    let slotDate = document.getElementById("labDate");
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
    slotDate = slotDate.value.toString();
    reservationID = generateReservationID(reservationList);

    // ensure that the reservation does not overlap with an existing reservation
    hasOverlap = reservationList.some(reservation =>
        reservation.labSelection === labSelection &&
        reservation.slotTime === slotTime &&
        reservation.slotSeat === slotSeat &&
        reservation.slotDate === slotDate
    );

    if (hasOverlap) {
        alert("Reservation already exists");
        return;
    }

    // create new reservation object
    newReservation = {
        reservationID: reservationID,
        studentID: studentID,
        labSelection: labSelection,
        slotTime: slotTime,
        slotSeat: slotSeat,
        slotDate: slotDate
    }
    
    // push the reservation and save the list locally
    reservationList.push(newReservation);
    localStorage.setItem("reservationList", JSON.stringify(reservationList));
    alert("Reservation successfully added");
}

//========================================================================================================

// temp function to delete reservations
function deleteAllReservations() {
    localStorage.removeItem("reservationList");
    alert("All reservations have been removed!");
}
// reserve and delete slots
document.getElementById("reserveSlots").addEventListener("click", addReservation);
document.getElementById("removeReservations").addEventListener("click", deleteAllReservations);

// update dropdowns
document.getElementById("labSelect").addEventListener("change", updateTimeSelection());
document.getElementById("labTime").addEventListener("change", updateSeatSelection());

// refresh the site every min?
//setInterval(60000);