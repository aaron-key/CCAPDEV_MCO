document.addEventListener("DOMContentLoaded", function() {
    function toggleAuthView(view) {
        document.getElementById("registerSection").style.display = view === "register" ? "block" : "none";
        document.getElementById("loginSection").style.display = view === "login" ? "block" : "none";
    }

    window.toggleAuthView = toggleAuthView;

    const registerForm = document.getElementById("registerForm");
    if(registerForm) {
        registerForm.addEventListener(("submit"), function(event) {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const accountType = document.getElementById("accountType").value;

            if (!email.endsWith("@dlsu.edu.ph")) {
                alert("Please use a valid DLSU email.");
                return;
            }

            let studentList = retrieveStudentList();
            let techList = retrieveTechList();
            let existingStudent = studentList.some(s => s.email === email);
            let existingTech = techList.some(t => t.email === email);

            // check if account was previously registered
            if (existingStudent || existingTech) {
                alert("This email is already registered. Please log in instead.");
                return;
            }

            // store account to list depending on account type, assign appropriate id
            if(accountType == "student") {
                let id = generateStudentID();
                studentList.push({
                    studentID: id,
                    email: email,
                    password: password

                })
            } else {
                let id = generateTechID();
                techList.push({
                    techID: id,
                    email: email,
                    password: password
                });
            }

            // store lists locally
            localStorage.setItem("studentList", JSON.stringify(studentList));
            localStorage.setItem("techList", JSON.stringify(techList));

            alert("Registration successful! You can now log in.");
            toggleAuthView("login");
        });
    }

    const loginForm = document.getElementById("loginForm");
    if(loginForm) {
        loginForm.addEventListener(("submit"), function(event) {
            event.preventDefault();
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            const rememberMe = document.getElementById("rememberMe").checked;

            let studentList = retrieveStudentList();
            let techList = retrieveTechList();
            let student = studentList.find(s => s.email === email && s.password === password);
            let tech = techList.find(t => t.email === email && t.password === password);

            if (student || tech) {
                if(student) {
                    localStorage.setItem("userSession", "loggedIn");                // store login session
                    localStorage.setItem("currentUser", JSON.stringify(student))    // save user date
                } else {
                    localStorage.setItem("userSession", "loggedIn");
                    localStorage.setItem("currentUser", JSON.stringify(tech))
                }

                alert("Login successful!");
                window.location.href = "dashboard.html"; // Redirect to dashboard
            } else {
                alert("Invalid credentials.");
            }
        });
    }
})