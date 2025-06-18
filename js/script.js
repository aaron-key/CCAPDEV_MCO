// When the document is loaded, check if the user is logged in
// If logged in, show the dashboard; otherwise, show auth.html
document.addEventListener("DOMContentLoaded", function(event) {
    const userSession = localStorage.getItem("userSession"); 

    if(!window.location.href.endsWith("auth.html")) {
        if(userSession !== "loggedIn" || !userSession) {
            localStorage.removeItem("userSession");
            window.location.href = "auth.html";
        }
    }

    initializeDashboard();
});

// Logout Logic
document.getElementById("logout").addEventListener("click", function() {
    localStorage.removeItem("userSession"); // Clear login session
    localStorage.removeItem("currentUser"); // Remove user data
    alert("Logged out successfully.");
    window.location.href = "auth.html"; // Redirect to login/register page
});

// initialize dashboard
document.addEventListener("DOMContentLoaded", initializeDashboard);

// update options / view when new options are selected
document.getElementById("selectLab").addEventListener("change", function(event) {
    viewLab();
    updateSelectSeat();
    updateSelectTime();
});

document.getElementById("selectDate").addEventListener("change", function(event) {
    viewLab();
});

document.getElementById("selectLabStartTime").addEventListener("change", generateEndTimeSlots);

// reserve and delete slots
document.getElementById("reserveSlot").addEventListener("click", function(event) {
    addReservation();
    viewLab();
});

document.getElementById("removeReservations").addEventListener("click", function(event) {
    deleteAllReservations();
    viewLab();
    initializeDashboard();
});

// create and delete labs
document.getElementById("createLab").addEventListener("click", function(event) {
    addLab();
});

document.getElementById("removeLabs").addEventListener("click", function(event) {
    deleteAllLabs();
    viewLab();
    initializeDashboard();
});

// lab creation =====================================================

function generateTimeSlots() {
    let list = [];
    let start = new Date();
    let end = new Date();

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 45, 0, 0);

    while(start <= end) {
        const hour = String(start.getHours()).padStart(2, '0');
        const min = String(start.getMinutes()).padStart(2, '0');
        list.push(`${hour}:${min}`);

        start.setMinutes(start.getMinutes() + 15);
    }

    return list;
}

function generateStartTimeSlots() {
    let select = document.getElementById("selectLabStartTime");
    let defaultOption= document.createElement("option");
    let slots = generateTimeSlots();

    // reset list, create default option
    select.innerHTML = "";
    defaultOption.value = "";
    defaultOption.textContent = "---select a time---";
    defaultOption.selected = true;
    defaultOption.disabled = true;
    select.appendChild(defaultOption);

    // generate a list of start times from 00:00 to 23:45
    for(let i = 0; i < slots.length; i++) {
        let option = document.createElement("option");
        option.value = slots[i];
        option.textContent = slots[i];
        select.appendChild(option);
    }
}

// generates a list of time slots, and removes all slots before a specified start time
function generateEndTimeSlots() {
    let startTime = document.getElementById("selectLabStartTime").value;
    let select = document.getElementById("selectLabEndTime");
    let defaultOption = document.createElement("option");
    let slots = generateTimeSlots();

    // create default option
    select.innerHTML = ""; // remove duplicate options
    defaultOption.value = "";
    defaultOption.textContent = "---select a time---";
    defaultOption.selected = true;
    defaultOption.disabled = true;
    select.appendChild(defaultOption);

    // shift lists elements upto specified start time
    while(slots.some(time => time == startTime)) {
        slots.shift();
    }

    // generate a list of end times from the select start time to 23:45
    for(let i = 0; i < slots.length; i++) {
        let option = document.createElement("option");
        option.value = slots[i];
        option.textContent = slots[i];
        select.appendChild(option);
    }
}

function generateSeatList() {
    let seatCount = document.getElementById("labSeatCountInput").value;
    let list = [];

    // generate only if input is a number
    if(parseInt(seatCount)) {
        for(let i = 0; i < seatCount; i++) {
            list.push(i + 1);
        }
    } else {
        // treat as empty list
        alert("Please input a number for seat count.");
        list = [];
    }

    return list;
}

function generateTimeList() {
    let list = [];
    let startTime = document.getElementById("selectLabStartTime").value;
    let endTime = document.getElementById("selectLabEndTime").value;
    let startH,
        startM,
        endH,
        endM,
        startDate,
        endDate,
        currentTime;

    if(startTime && endTime) {
        [startH, startM] = startTime.split(":").map(Number);
        [endH, endM] = endTime.split(":").map(Number);

        startDate = new Date();
        startDate.setHours(startH, startM, 0, 0);

        endDate = new Date();
        endDate.setHours(endH, endM, 0, 0);

        currentTime = new Date(startDate);

        while(currentTime <= endDate) {
            const hour = String(currentTime.getHours()).padStart(2, '0');
            const min = String(currentTime.getMinutes()).padStart(2, '0');
            list.push(`${hour}:${min}`);

            currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
    } else {
        alert("Please input both start and end times.");
    }

    return list;
}

function addLab() {
    // retrive info from form and retrieve lab list
    let labList = retrieveLabList();
    let labID = generateLabID();
    let seatList = generateSeatList();
    let timeList = generateTimeList();
    let newLab;

    if(seatList.length == 0 || timeList.length == 0) {
        alert("Failed to create lab");
        return;
    } 

    // create new lab, push onto lab list, and store locally
    newLab = {
        labID: labID,
        seatList: seatList,
        timeList: timeList
    }

    labList.push(newLab);
    localStorage.setItem("labList", JSON.stringify(labList));
    alert("Lab added successfully");
}

function viewLab() {
    let labList = retrieveLabList();
    let reservationList = retrieveReservationList();
    let table = document.getElementById("labView");
    let tableHeader = document.createElement("tr");
    let date = document.getElementById("selectDate").value;
    let currentLabID = document.getElementById("selectLab").value;
    let currentLab;
    let currentLabReserveList = [];

    console.log(date);

    // find the lab, retrieve reservations for the lab on the specified date
    currentLab = labList.find(l => l.labID == currentLabID);

    // exit function is lab is not found / selected
    if(!currentLab) {
        table.innerHTML = ""; // do not display content is lab is not found
        return;
    }

    for(let i = 0; i < reservationList.length; i++) {
        if(reservationList[i].labID == currentLabID && reservationList[i].reservedDate == date) {
            currentLabReserveList.push(reservationList[i]);
        }
    }

    console.log(currentLabReserveList);

    // clear and create new the table header, depending on slots
    table.innerHTML = "";
    tableHeader.appendChild(document.createElement("th"));

    currentLab.seatList.forEach(s => {
        let seat = document.createElement("th");
        seat.textContent = s;
        tableHeader.appendChild(seat);
    });

    table.appendChild(tableHeader);

    // populate the table in this format; 
    /*
                seat   seat   seat
    time slot |taken |      |      |
    time slot |free  |      |      |
    time slot |free  |      |      |

    */

    currentLab.timeList.forEach(t => {
        let row = document.createElement("tr");
        let rowHeader = document.createElement("td");
        rowHeader.textContent = t;
        row.appendChild(rowHeader);

        // for each seat at a given time, check if its "taken"
        currentLab.seatList.forEach(s => {
            let rowData = document.createElement("td");

            console.log(currentLabReserveList.find(r => r.reservedSeat == s));
            console.log(currentLabReserveList.find(r => r.reservedTime == t));

            if(currentLabReserveList.some(r => r.reservedSeat == s && r.reservedTime == t)) {
                rowData.textContent = "taken";
            } else {
                rowData.textContent = "";
            }

            row.appendChild(rowData);
        });

        table.appendChild(row);
    });
}

function editLab() {

}

function deleteLab() {

}

// Dashboard logic ==================================================

// sets up the dashboard, depending on whether the user is a student or a technician
function initializeDashboard() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let selectDate = document.getElementById("selectDate");

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;
    
    updateSelectLab();
    generateStartTimeSlots();
    selectDate.setAttribute("min", todayString); // set date select so that passed days cannot be selected

    // hide technician functions from student view
    if(Object.hasOwn(currentUser, "studentID")) {
        document.getElementById("studentIDInput").remove();
        document.getElementById("studentIDLabel").remove();
        document.getElementById("labSection").remove();
    } else {
        document.getElementById("isAnonLabel").remove();
        document.getElementById("isAnon").remove();
    }
}

function updateSelectLab() {
    let labList = retrieveLabList();
    let select = document.getElementById("selectLab");
    let defaultOption = document.createElement("option");

    // clear lab slots shown and add default
    select.innerHTML = "";
    defaultOption.value = "";
    defaultOption.text = "---select a lab---";
    defaultOption.selected = true;
    defaultOption.disabled = true;
    select.appendChild(defaultOption);

    // repopulate the dropdown with the list of labs
    for(let i = 0; i < labList.length; i++) {
        let option = document.createElement("option");
        option.value = labList[i].labID;
        option.textContent = labList[i].labID;
        select.appendChild(option);
    }
}

function updateSelectTime() {
    let labList = retrieveLabList();
    let selectedLabID = document.getElementById("selectLab").value;
    let selectedLab;
    let slots;

    let select = document.getElementById("selectTime");
    let defaultOption = document.createElement("option");

    // clear times slots shown and add the default option
    select.innerHTML = "";
    defaultOption.value = "";
    defaultOption.text = "---select a time---";
    defaultOption.selected = true;
    defaultOption.disabled = true;
    select.appendChild(defaultOption);

    // find the lab and retrieve its time slot list, return if not found
    selectedLab = labList.find(l => l.labID == selectedLabID);
    slots = selectedLab.timeList;

    if(!selectedLabID) {
        return;
    }

    // [] add removing time slots at max capacity

    // repopulate the dropdown list with the lab's times
    for(let i = 0; i < slots.length; i++) {
        let option = document.createElement("option");
        option.value = slots[i];
        option.textContent = slots[i];
        select.appendChild(option);
    }
}

function updateSelectSeat() {
    let labList = retrieveLabList();
    let selectedLabID = document.getElementById("selectLab").value;
    let selectedLab;
    let seats;

    let select = document.getElementById("selectSeat");
    let defaultOption = document.createElement("option");

    // clear times slots shown and add the default option
    select.innerHTML = "";
    defaultOption.value = "";
    defaultOption.text = "---select a seat---";
    defaultOption.selected = true;
    defaultOption.disabled = true;
    select.appendChild(defaultOption);

    // find the lab and retrieve its seat slot list
    selectedLab = labList.find(l => l.labID == selectedLabID);
    seats = selectedLab.seatList;

    // repopulate the dropdown list with the lab's times
    for(let i = 0; i < seats.length; i++) {
        let option = document.createElement("option");
        option.value = seats[i];
        option.textContent = seats[i];
        select.appendChild(option);
    }
}

//
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
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let reservationList = retrieveReservationList();
    let reservationID = generateReservationID();
    let studentID = currentUser.studentID; // sets student ID from current user
    let labID = document.getElementById("selectLab").value;
    let requestDate = new Date().toISOString();
    let reservedDate = document.getElementById("selectDate").value;
    let reservedTime = document.getElementById("selectTime").value;
    let reservedSeat = document.getElementById("selectSeat").value;
    let isAnon = document.getElementById("isAnon");
    let hasOverlap;
    let newReservation;

    // assign student based on the user
    if(Object.hasOwn(currentUser, "studentID")) {
        studentID = currentUser.studentID;
    } else {
        studentID = document.getElementById("studentIDInput").value;
        console.log(studentID);
    }

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

    // for lab techs, check if student ID was inputted
    if(studentID == "") {
        alert("Please input student ID.");
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
        isAnon: isAnon.checked ? true : false
    }

    reservationList.push(newReservation);
    localStorage.setItem("reservationList", JSON.stringify(reservationList));
    alert("Reservation added successfully"); // temporary alert for checking
}

function viewStudentReservation() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let reservationList = retrieveReservationList();
    let table = document.getElementById("reservationView");
}

function viewLabReservation() {
    // let labList = retrieveLabList();
    // let reservationList = retrieveReservationList();
    // let table = document.getElementById("labView");
    // let tableHeader = document.createElement("tr");
    // let date = document.getElementById("selectDate").value;
    // let currentLabID = document.getElementById("selectLab").value;
    // let currentLab;
    // let currentLabReserveList = [];

    // console.log(date);

    // // find the lab, retrieve reservations for the lab on the specified date
    // currentLab = labList.find(l => l.labID == currentLabID);

    // // exit function is lab is not found / selected
    // if(!currentLab) {
    //     table.innerHTML = ""; // do not display content is lab is not found
    //     return;
    // }

    // for(let i = 0; i < reservationList.length; i++) {
    //     if(reservationList[i].labID == currentLabID && reservationList[i].reservedDate == date) {
    //         currentLabReserveList.push(reservationList[i]);
    //     }
    // }

    // console.log(currentLabReserveList);

    // // clear and create new the table header, depending on slots
    // table.innerHTML = "";
    // tableHeader.appendChild(document.createElement("th"));

    // currentLab.seatList.forEach(s => {
    //     let seat = document.createElement("th");
    //     seat.textContent = s;
    //     tableHeader.appendChild(seat);
    // });

    // table.appendChild(tableHeader);

    // // populate the table in this format; 
    // /*
    //             seat   seat   seat
    // time slot |taken |      |      |
    // time slot |free  |      |      |
    // time slot |free  |      |      |

    // */

    // currentLab.timeList.forEach(t => {
    //     let row = document.createElement("tr");
    //     let rowHeader = document.createElement("td");
    //     rowHeader.textContent = t;
    //     row.appendChild(rowHeader);

    //     // for each seat at a given time, check if its "taken"
    //     currentLab.seatList.forEach(s => {
    //         let rowData = document.createElement("td");

    //         console.log(currentLabReserveList.find(r => r.reservedSeat == s));
    //         console.log(currentLabReserveList.find(r => r.reservedTime == t));

    //         if(currentLabReserveList.some(r => r.reservedSeat == s && r.reservedTime == t)) {
    //             rowData.textContent = "taken";
    //         } else {
    //             rowData.textContent = "";
    //         }

    //         row.appendChild(rowData);
    //     });

    //     table.appendChild(row);
    // });
}

function editReservation() {
    // get reservation ID to edit reservation details
}

function deleteReservation() {
    let reservationList = retrieveReservationList();

}

// temp
function deleteAllReservations() {
    localStorage.setItem("reservationList", JSON.stringify([]));
    alert("All reservations have been removed successfully.");
}

function deleteAllLabs() {
    localStorage.setItem("labList", JSON.stringify([]));
    alert("All labs have been removed successfully.");
}