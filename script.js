/* =========================================================
   AGENTCOUNCIL — LOGIN PAGE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const loginForm = document.getElementById("loginForm");

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const togglePassword = document.getElementById("togglePassword");
    const forgotPassword = document.getElementById("forgotPassword");

    const rememberMe = document.getElementById("rememberMe");

    const loginButton = document.getElementById("loginButton");
    const loginMessage = document.getElementById("loginMessage");


    /* =====================================================
       LOAD SAVED EMAIL
       ===================================================== */

    const savedEmail = localStorage.getItem("agentCouncilEmail");

    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMe.checked = true;
    }


    /* =====================================================
       SHOW / HIDE PASSWORD
       ===================================================== */

    togglePassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.innerHTML =
                '<i class="fa-regular fa-eye-slash"></i>';

            togglePassword.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            passwordInput.type = "password";

            togglePassword.innerHTML =
                '<i class="fa-regular fa-eye"></i>';

            togglePassword.setAttribute(
                "aria-label",
                "Show password"
            );
        }

    });


    /* =====================================================
       MESSAGE FUNCTION
       ===================================================== */

    function showMessage(message, type) {

        loginMessage.textContent = message;

        if (type === "error") {

            loginMessage.style.color = "#fb7185";

        } else if (type === "success") {

            loginMessage.style.color = "#34d399";

        } else {

            loginMessage.style.color = "#a78bfa";
        }
    }


    /* =====================================================
       EMAIL VALIDATION
       ===================================================== */

    function isValidEmail(email) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailPattern.test(email);
    }


    /* =====================================================
       LOGIN
       ===================================================== */

    loginForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();


        /* Empty email */

        if (email === "") {

            showMessage(
                "Please enter your email address.",
                "error"
            );

            emailInput.focus();

            return;
        }


        /* Invalid email */

        if (!isValidEmail(email)) {

            showMessage(
                "Please enter a valid email address.",
                "error"
            );

            emailInput.focus();

            return;
        }


        /* Empty password */

        if (password === "") {

            showMessage(
                "Please enter your password.",
                "error"
            );

            passwordInput.focus();

            return;
        }


        /* Minimum password */

        if (password.length < 6) {

            showMessage(
                "Password must contain at least 6 characters.",
                "error"
            );

            passwordInput.focus();

            return;
        }


        /* =================================================
           REMEMBER ME
           ================================================= */

        if (rememberMe.checked) {

            localStorage.setItem(
                "agentCouncilEmail",
                email
            );

        } else {

            localStorage.removeItem(
                "agentCouncilEmail"
            );
        }


        /* =================================================
           LOGIN LOADING
           ================================================= */

        loginButton.disabled = true;

        loginButton.innerHTML = `
            <i class="fa-solid fa-circle-notch fa-spin"></i>
            <span>Authenticating...</span>
        `;

        showMessage(
            "Verifying your AgentCouncil access...",
            "loading"
        );


        /* =================================================
           SIMULATED LOGIN
           ================================================= */

        setTimeout(() => {

            localStorage.setItem(
                "agentCouncilUser",
                email
            );

            localStorage.setItem(
                "agentCouncilLoggedIn",
                "true"
            );


            loginButton.innerHTML = `
                <span>Access Granted</span>
                <i class="fa-solid fa-check"></i>
            `;

            showMessage(
                "Access granted. Opening AgentCouncil...",
                "success"
            );


            /* =============================================
               DASHBOARD REDIRECT
               ============================================= */

            setTimeout(() => {

                /*
                   When dashboard.html is created,
                   this will automatically open it.
                */

                window.location.href = "dashboard.html";

            }, 1000);

        }, 1500);

    });


    /* =====================================================
       FORGOT PASSWORD
       ===================================================== */

    forgotPassword.addEventListener("click", (event) => {

        event.preventDefault();

        const email = emailInput.value.trim();

        if (email === "") {

            showMessage(
                "Enter your email address first.",
                "error"
            );

            emailInput.focus();

            return;
        }

        if (!isValidEmail(email)) {

            showMessage(
                "Please enter a valid email address.",
                "error"
            );

            emailInput.focus();

            return;
        }


        showMessage(
            "Password recovery request prepared for " + email,
            "success"
        );

    });


    /* =====================================================
       INPUT CLEANUP
       ===================================================== */

    emailInput.addEventListener("input", () => {

        if (loginMessage.textContent !== "") {
            loginMessage.textContent = "";
        }

    });


    passwordInput.addEventListener("input", () => {

        if (loginMessage.textContent !== "") {
            loginMessage.textContent = "";
        }

    });


    /* =====================================================
       ENTER KEY
       ===================================================== */

    passwordInput.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            loginForm.requestSubmit();

        }

    });

});