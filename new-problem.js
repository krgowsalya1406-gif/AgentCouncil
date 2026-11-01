/* =========================================================
   AGENTCOUNCIL - NEW PROBLEM JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const backDashboard = document.getElementById("backDashboard");
    const cancelBtn = document.getElementById("cancelBtn");
    const analyzeBtn = document.getElementById("analyzeBtn");

    const problemTitle = document.getElementById("problemTitle");
    const problemDescription =
        document.getElementById("problemDescription");

    const titleCount = document.getElementById("titleCount");
    const descriptionCount =
        document.getElementById("descriptionCount");

    const typeOptions =
        document.querySelectorAll(".type-option");

    const factorInputs =
        document.querySelectorAll(".factor-option input");

    const deadline =
        document.getElementById("deadline");


    /* =====================================================
       DEFAULT PROBLEM TYPE
       ===================================================== */

    const savedType =
        localStorage.getItem("selectedProblemType");

    let selectedType = savedType || "General";


    /* =====================================================
       SELECT PROBLEM TYPE
       ===================================================== */

    typeOptions.forEach((button) => {

        const type =
            button.dataset.type;

        if (type === selectedType) {
            button.classList.add("selected");
        }

        button.addEventListener("click", () => {

            typeOptions.forEach((item) => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");

            selectedType = type;

            localStorage.setItem(
                "selectedProblemType",
                selectedType
            );
        });
    });


    /* =====================================================
       TITLE CHARACTER COUNT
       ===================================================== */

    if (problemTitle && titleCount) {

        problemTitle.addEventListener("input", () => {

            titleCount.textContent =
                problemTitle.value.length;
        });
    }


    /* =====================================================
       DESCRIPTION CHARACTER COUNT
       ===================================================== */

    if (problemDescription && descriptionCount) {

        problemDescription.addEventListener("input", () => {

            descriptionCount.textContent =
                `${problemDescription.value.length}/1000`;
        });
    }


    /* =====================================================
       BACK TO DASHBOARD
       ===================================================== */

    if (backDashboard) {

        backDashboard.addEventListener("click", () => {

            window.location.href = "dashboard.html";
        });
    }


    /* =====================================================
       CANCEL
       ===================================================== */

    if (cancelBtn) {

        cancelBtn.addEventListener("click", () => {

            const hasContent =
                problemTitle.value.trim() ||
                problemDescription.value.trim();

            if (hasContent) {

                const confirmCancel = confirm(
                    "Discard the problem you entered?"
                );

                if (!confirmCancel) {
                    return;
                }
            }

            window.location.href = "dashboard.html";
        });
    }


    /* =====================================================
       ANALYZE PROBLEM
       ===================================================== */

    if (analyzeBtn) {

        analyzeBtn.addEventListener("click", () => {

            const title =
                problemTitle.value.trim();

            const description =
                problemDescription.value.trim();


            /* =============================================
               VALIDATION
               ============================================= */

            if (!selectedType || selectedType === "General") {

                showMessage(
                    "Please select a problem type.",
                    "warning"
                );

                scrollToElement(
                    document.querySelector(".type-selector")
                );

                return;
            }


            if (title.length < 5) {

                showMessage(
                    "Please enter a meaningful problem title.",
                    "warning"
                );

                problemTitle.focus();

                return;
            }


            if (description.length < 20) {

                showMessage(
                    "Please describe the problem in more detail.",
                    "warning"
                );

                problemDescription.focus();

                return;
            }


            /* =============================================
               SELECTED FACTORS
               ============================================= */

            const selectedFactors = [];

            factorInputs.forEach((input) => {

                if (input.checked) {
                    selectedFactors.push(input.value);
                }
            });


            /* =============================================
               CREATE PROBLEM OBJECT
               ============================================= */

            const problemId =
                "AC-" +
                Date.now().toString().slice(-8);


            const problem = {

                id: problemId,

                title: title,

                description: description,

                type: selectedType,

                factors: selectedFactors,

                deadline: deadline.value || null,

                status: "Analyzing",

                createdAt:
                    new Date().toISOString(),

                createdDate:
                    new Date().toLocaleDateString(),

                createdTime:
                    new Date().toLocaleTimeString()
            };


            /* =============================================
               SAVE PROBLEM
               ============================================= */

            let problems = [];

            try {

                problems = JSON.parse(
                    localStorage.getItem(
                        "agentCouncilProblems"
                    ) || "[]"
                );

            } catch (error) {

                problems = [];
            }


            problems.push(problem);


            localStorage.setItem(
                "agentCouncilProblems",
                JSON.stringify(problems)
            );


            /* =============================================
               SAVE CURRENT PROBLEM
               ============================================= */

            localStorage.setItem(
                "currentProblem",
                JSON.stringify(problem)
            );


            /* =============================================
               UPDATE DASHBOARD COUNT
               ============================================= */

            updateProblemCount(problems.length);


            /* =============================================
               BUTTON LOADING STATE
               ============================================= */

            analyzeBtn.classList.add("loading");

            analyzeBtn.innerHTML = `
                <span>
                    <i class="fa-solid fa-spinner"></i>
                    Activating Council...
                </span>

                <i class="fa-solid fa-arrow-right"></i>
            `;


            /* =============================================
               SIMULATE COUNCIL ACTIVATION
               ============================================= */

            setTimeout(() => {

                analyzeBtn.innerHTML = `
                    <span>
                        <i class="fa-solid fa-brain"></i>
                        Analyzing Problem...
                    </span>

                    <i class="fa-solid fa-spinner"></i>
                `;

            }, 1000);


            setTimeout(() => {

                window.location.href =
                    "agent-council.html";

            }, 2200);

        });
    }


    /* =====================================================
       UPDATE PROBLEM COUNT
       ===================================================== */

    function updateProblemCount(count) {

        localStorage.setItem(
            "problemCount",
            count
        );
    }


    /* =====================================================
       MESSAGE
       ===================================================== */

    function showMessage(message, type) {

        const existing =
            document.querySelector(".form-message");

        if (existing) {
            existing.remove();
        }


        const messageBox =
            document.createElement("div");

        messageBox.className =
            `form-message ${type}`;

        let icon =
            "fa-circle-exclamation";

        if (type === "success") {
            icon = "fa-circle-check";
        }

        if (type === "warning") {
            icon = "fa-triangle-exclamation";
        }


        messageBox.innerHTML = `
            <i class="fa-solid ${icon}"></i>

            <span>
                ${escapeHTML(message)}
            </span>

            <button>
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;


        document.body.appendChild(messageBox);


        messageBox
            .querySelector("button")
            .addEventListener("click", () => {
                messageBox.remove();
            });


        setTimeout(() => {

            if (messageBox.parentElement) {
                messageBox.remove();
            }

        }, 4000);
    }


    /* =====================================================
       SCROLL TO ELEMENT
       ===================================================== */

    function scrollToElement(element) {

        if (!element) return;

        element.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }


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
       LOAD SAVED DATA
       ===================================================== */

    function loadSavedData() {

        const currentProblem =
            localStorage.getItem("currentProblem");

        if (!currentProblem) {
            return;
        }

        try {

            const problem =
                JSON.parse(currentProblem);

            if (problem.type) {

                selectedType =
                    problem.type;

                typeOptions.forEach((button) => {

                    button.classList.toggle(
                        "selected",
                        button.dataset.type ===
                        selectedType
                    );

                });
            }

        } catch (error) {

            console.log(
                "Unable to load previous problem."
            );
        }
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    loadSavedData();

});