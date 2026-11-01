/* =========================================================
   AGENTCOUNCIL - DASHBOARD JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const newProblemBtn = document.getElementById("newProblemBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const notificationBtn = document.getElementById("notificationBtn");

    const userName = document.getElementById("userName");
    const profileName = document.getElementById("profileName");
    const profileInitial = document.getElementById("profileInitial");

    const statProblems = document.getElementById("statProblems");
    const statDecisions = document.getElementById("statDecisions");
    const statLearning = document.getElementById("statLearning");

    const recentDecisions = document.getElementById("recentDecisions");

    const navItems = document.querySelectorAll(".nav-item");
    const problemTypes = document.querySelectorAll(".problem-type");

    /* =====================================================
       USER INFORMATION
       ===================================================== */

    let storedUser = localStorage.getItem("agentCouncilUser");

    if (storedUser) {
        try {
            storedUser = JSON.parse(storedUser);
        } catch (error) {
            console.log("User data is not JSON.");
        }
    }

    let currentUser = "Gowsalya";

    if (storedUser) {
        if (typeof storedUser === "string") {
            currentUser = storedUser;
        } else if (storedUser.name) {
            currentUser = storedUser.name;
        } else if (storedUser.username) {
            currentUser = storedUser.username;
        }
    }

    userName.textContent = currentUser;
    profileName.textContent = currentUser;

    if (currentUser.length > 0) {
        profileInitial.textContent = currentUser.charAt(0).toUpperCase();
    }


    /* =====================================================
       DASHBOARD DATA
       ===================================================== */

    function getProblems() {
        return JSON.parse(
            localStorage.getItem("agentCouncilProblems") || "[]"
        );
    }

    function getDecisions() {
        return JSON.parse(
            localStorage.getItem("agentCouncilDecisions") || "[]"
        );
    }

    function getLearning() {
        return JSON.parse(
            localStorage.getItem("agentCouncilLearning") || "[]"
        );
    }


    /* =====================================================
       UPDATE STATISTICS
       ===================================================== */

    function updateStats() {

        const problems = getProblems();
        const decisions = getDecisions();
        const learning = getLearning();

        animateNumber(statProblems, problems.length);
        animateNumber(statDecisions, decisions.length);
        animateNumber(statLearning, learning.length);
    }


    function animateNumber(element, target) {

        if (!element) return;

        const duration = 700;
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {

            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const value = Math.floor(
                start + (target - start) * progress
            );

            element.textContent = value;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }


    /* =====================================================
       RECENT DECISIONS
       ===================================================== */

    function renderRecentDecisions() {

        if (!recentDecisions) return;

        const decisions = getDecisions();

        if (decisions.length === 0) {

            recentDecisions.innerHTML = `
                <div class="empty-state">

                    <div class="empty-icon">
                        <i class="fa-solid fa-clock-rotate-left"></i>
                    </div>

                    <h4>No decisions yet</h4>

                    <p>
                        Your council decisions will appear here.
                    </p>

                </div>
            `;

            return;
        }

        const latest = decisions.slice(-5).reverse();

        recentDecisions.innerHTML = "";

        latest.forEach((decision) => {

            const item = document.createElement("div");

            item.className = "recent-decision-item";

            const title =
                decision.title ||
                decision.problem ||
                "Untitled Decision";

            const type =
                decision.type ||
                "General";

            const date =
                decision.date ||
                new Date().toLocaleDateString();

            item.innerHTML = `
                <div class="decision-icon">
                    <i class="fa-solid fa-scale-balanced"></i>
                </div>

                <div class="decision-info">
                    <strong>${escapeHTML(title)}</strong>
                    <span>${escapeHTML(type)} • ${escapeHTML(date)}</span>
                </div>

                <i class="fa-solid fa-chevron-right decision-arrow"></i>
            `;

            recentDecisions.appendChild(item);
        });
    }


    /* =====================================================
       START NEW PROBLEM
       ===================================================== */

    if (newProblemBtn) {

        newProblemBtn.addEventListener("click", () => {

            localStorage.setItem(
                "selectedProblemType",
                "General"
            );

            window.location.href = "new-problem.html";
        });
    }


    /* =====================================================
       QUICK START PROBLEM TYPES
       ===================================================== */

    problemTypes.forEach((button) => {

        button.addEventListener("click", () => {

            const strongText = button.querySelector("strong");

            if (!strongText) return;

            const type = strongText.textContent.trim();

            localStorage.setItem(
                "selectedProblemType",
                type
            );

            window.location.href = "new-problem.html";
        });
    });


    /* =====================================================
       SIDEBAR NAVIGATION
       ===================================================== */

    navItems.forEach((item) => {

        item.addEventListener("click", function () {

            if (this.id === "logoutBtn") {
                return;
            }

            navItems.forEach((nav) => {
                nav.classList.remove("active");
            });

            this.classList.add("active");

            const text =
                this.querySelector("span")?.textContent.trim();

            navigateFromSidebar(text);
        });
    });


    function navigateFromSidebar(page) {

        switch (page) {

            case "Dashboard":
                window.location.href = "dashboard.html";
                break;

            case "New Problem":
                localStorage.setItem(
                    "selectedProblemType",
                    "General"
                );
                window.location.href = "new-problem.html";
                break;

            case "Agent Council":
                window.location.href = "agent-council.html";
                break;

            case "Agent Debate":
                window.location.href = "agent-debate.html";
                break;

            case "Conflict Map":
                window.location.href = "conflict-map.html";
                break;

            case "What-If Simulation":
                window.location.href = "simulation.html";
                break;

            case "Decision Memory":
                window.location.href = "decision-memory.html";
                break;

            case "Prediction vs Reality":
                window.location.href = "prediction.html";
                break;

            case "Decision History":
                window.location.href = "decision-history.html";
                break;

            case "Help":
                window.location.href = "help.html";
                break;

            default:
                console.log("Unknown navigation:", page);
        }
    }


    /* =====================================================
       LOGOUT
       ===================================================== */

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            const confirmLogout = confirm(
                "Are you sure you want to logout?"
            );

            if (!confirmLogout) return;

            localStorage.removeItem("agentCouncilLoggedIn");

            window.location.href = "index.html";
        });
    }


    /* =====================================================
       NOTIFICATIONS
       ===================================================== */

    if (notificationBtn) {

        notificationBtn.addEventListener("click", () => {

            showNotificationPanel();
        });
    }


    function showNotificationPanel() {

        const existing =
            document.querySelector(".notification-panel");

        if (existing) {
            existing.remove();
            return;
        }

        const panel = document.createElement("div");

        panel.className = "notification-panel";

        panel.innerHTML = `
            <div class="notification-header">
                <strong>Notifications</strong>
                <button id="closeNotifications">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="notification-item">
                <div class="notification-icon">
                    <i class="fa-solid fa-circle-check"></i>
                </div>

                <div>
                    <strong>Council Ready</strong>
                    <p>All 6 agents are ready for analysis.</p>
                </div>
            </div>

            <div class="notification-item">
                <div class="notification-icon">
                    <i class="fa-solid fa-lightbulb"></i>
                </div>

                <div>
                    <strong>Start a New Problem</strong>
                    <p>Submit a complex problem to activate the council.</p>
                </div>
            </div>

            <div class="notification-item">
                <div class="notification-icon">
                    <i class="fa-solid fa-brain"></i>
                </div>

                <div>
                    <strong>Decision Memory</strong>
                    <p>Your previous decisions can be used for future analysis.</p>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        const closeBtn =
            document.getElementById("closeNotifications");

        closeBtn.addEventListener("click", () => {
            panel.remove();
        });
    }


    /* =====================================================
       VIEW ALL RECENT DECISIONS
       ===================================================== */

    const viewAllButton =
        document.querySelector(".recent-card .text-button");

    if (viewAllButton) {

        viewAllButton.addEventListener("click", () => {

            window.location.href = "decision-history.html";
        });
    }


    /* =====================================================
       PROFILE CLICK
       ===================================================== */

    const userProfile =
        document.querySelector(".user-profile");

    if (userProfile) {

        userProfile.addEventListener("click", () => {

            const existing =
                document.querySelector(".profile-menu");

            if (existing) {
                existing.remove();
                return;
            }

            const menu = document.createElement("div");

            menu.className = "profile-menu";

            menu.innerHTML = `
                <button id="profileMenuBtn">
                    <i class="fa-solid fa-user"></i>
                    Profile
                </button>

                <button id="settingsMenuBtn">
                    <i class="fa-solid fa-gear"></i>
                    Settings
                </button>

                <hr>

                <button id="menuLogoutBtn" class="menu-logout">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    Logout
                </button>
            `;

            document.body.appendChild(menu);

            const rect =
                userProfile.getBoundingClientRect();

            menu.style.top =
                `${rect.bottom + 10}px`;

            menu.style.right =
                `${window.innerWidth - rect.right}px`;


            document
                .getElementById("profileMenuBtn")
                .addEventListener("click", () => {
                    window.location.href = "profile.html";
                });


            document
                .getElementById("settingsMenuBtn")
                .addEventListener("click", () => {
                    window.location.href = "settings.html";
                });


            document
                .getElementById("menuLogoutBtn")
                .addEventListener("click", () => {

                    localStorage.removeItem(
                        "agentCouncilLoggedIn"
                    );

                    window.location.href = "index.html";
                });
        });
    }


    /* =====================================================
       CLOSE POPUPS WHEN CLICKING OUTSIDE
       ===================================================== */

    document.addEventListener("click", (event) => {

        const profileMenu =
            document.querySelector(".profile-menu");

        const userProfileElement =
            document.querySelector(".user-profile");

        if (
            profileMenu &&
            userProfileElement &&
            !profileMenu.contains(event.target) &&
            !userProfileElement.contains(event.target)
        ) {
            profileMenu.remove();
        }
    });


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       INITIALIZE DASHBOARD
       ===================================================== */

    updateStats();
    renderRecentDecisions();

});