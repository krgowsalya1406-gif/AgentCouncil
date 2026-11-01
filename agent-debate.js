document.addEventListener("DOMContentLoaded", () => {

    const problemTitle = document.getElementById("problemTitle");
    const problemType = document.getElementById("problemType");
    const problemDescription = document.getElementById("problemDescription");

    const coreTitle = document.getElementById("coreTitle");
    const coreStatus = document.getElementById("coreStatus");

    const roundNumber = document.getElementById("roundNumber");
    const debateStatus = document.getElementById("debateStatus");
    const debatePercentage = document.getElementById("debatePercentage");
    const debateProgress = document.getElementById("debateProgress");

    const debateLog = document.getElementById("debateLog");

    const dashboardBtn = document.getElementById("dashboardBtn");
    const conflictBtn = document.getElementById("conflictBtn");

    let currentProblem = null;

    try {
        currentProblem = JSON.parse(
            localStorage.getItem("currentProblem")
        );
    } catch (error) {
        console.error(error);
    }

    if (!currentProblem) {
        window.location.href = "new-problem.html";
        return;
    }

    /* =====================================================
       LOAD PROBLEM
       ===================================================== */

    problemTitle.textContent =
        currentProblem.title || "Untitled Problem";

    problemType.textContent =
        currentProblem.type || "General";

    problemDescription.textContent =
        currentProblem.description ||
        "No description available.";

    /* =====================================================
       AGENT DATA
       ===================================================== */

    const agents = {

        research: {
            name: "Research Agent",
            tag: "EVIDENCE",
            messages: [
                "The available options should first be compared using relevant evidence.",
                "Similar decision patterns suggest that the expected benefit should be evaluated before commitment.",
                "My recommendation depends on whether the supporting evidence is strong enough."
            ]
        },

        budget: {
            name: "Budget Agent",
            tag: "COST",
            messages: [
                "The financial impact should be considered before selecting an option.",
                "We should compare expected value against the available budget.",
                "A lower-cost alternative may reduce financial exposure."
            ]
        },

        risk: {
            name: "Risk Agent",
            tag: "RISK",
            messages: [
                "There are uncertainties that should be considered before taking action.",
                "The decision should include a fallback plan for possible failures.",
                "Reducing the highest-impact risks should be a priority."
            ]
        },

        planning: {
            name: "Planning Agent",
            tag: "STRATEGY",
            messages: [
                "The decision needs a practical implementation sequence.",
                "Breaking the decision into smaller stages can reduce execution difficulty.",
                "A phased approach would make the plan easier to monitor."
            ]
        },

        resource: {
            name: "Resource Agent",
            tag: "RESOURCES",
            messages: [
                "The required people, tools and infrastructure must be available.",
                "Resource availability could become a constraint during execution.",
                "The plan should confirm critical resources before implementation."
            ]
        },

        ethics: {
            name: "Ethics Agent",
            tag: "ETHICS",
            messages: [
                "The decision should consider fairness and its impact on people.",
                "The selected option should avoid creating unnecessary disadvantages.",
                "Transparency and responsible implementation should be maintained."
            ]
        }

    };

    /* =====================================================
       AGENT ELEMENTS
       ===================================================== */

    const agentElements =
        document.querySelectorAll(".debate-agent");

    /*
       Different agents speak during each round.
    */

    const debateRounds = [

        {
            number: 1,
            name: "Independent Perspectives",
            agents: [
                "research",
                "budget",
                "risk",
                "planning",
                "resource",
                "ethics"
            ]
        },

        {
            number: 2,
            name: "Challenge & Counterpoints",
            agents: [
                "risk",
                "budget",
                "planning",
                "research",
                "ethics",
                "resource"
            ]
        },

        {
            number: 3,
            name: "Consensus Formation",
            agents: [
                "planning",
                "risk",
                "budget",
                "research",
                "resource",
                "ethics"
            ]
        }

    ];

    /* =====================================================
       INITIAL STATE
       ===================================================== */

    let currentRound = 0;
    let currentAgent = 0;

    coreTitle.textContent = "Council Debate";
    coreStatus.textContent = "Preparing perspectives...";

    debateStatus.textContent =
        "Initializing Debate";

    setTimeout(() => {

        addLog(
            "The six agents have entered the Council Debate."
        );

        startRound();

    }, 1000);

    /* =====================================================
       START ROUND
       ===================================================== */

    function startRound() {

        if (currentRound >= debateRounds.length) {
            finishDebate();
            return;
        }

        const round = debateRounds[currentRound];

        currentAgent = 0;

        roundNumber.textContent = round.number;

        debateStatus.textContent = round.name;

        coreStatus.textContent =
            `ROUND ${round.number} ACTIVE`;

        activateRound(round.number);

        addLog(
            `Round ${round.number}: ${round.name} started.`
        );

        setTimeout(() => {

            speakNextAgent(round);

        }, 700);
    }

    /* =====================================================
       SPEAK NEXT AGENT
       ===================================================== */

    function speakNextAgent(round) {

        if (currentAgent >= round.agents.length) {

            completeRound();

            return;
        }

        const agentId =
            round.agents[currentAgent];

        const agent =
            agents[agentId];

        const element =
            document.querySelector(
                `.debate-agent[data-agent="${agentId}"]`
            );

        if (!element) {

            currentAgent++;

            speakNextAgent(round);

            return;
        }

        const speechText =
            element.querySelector(".speech-text");

        const speechTag =
            element.querySelector(".speech-tag");

        const speechName =
            element.querySelector(".speech-top strong");

        speechName.textContent =
            agent.name;

        speechTag.textContent =
            agent.tag;

        element.classList.add("active");
        element.classList.add("speaking");

        coreStatus.textContent =
            `${agent.name.toUpperCase()} SPEAKING`;

        addLog(
            `${agent.name} is presenting its perspective.`
        );

        typeText(
            speechText,
            agent.messages[currentRound],
            16
        );

        updateProgress();

        setTimeout(() => {

            element.classList.remove("speaking");

            currentAgent++;

            speakNextAgent(round);

        }, 1800);

    }

    /* =====================================================
       COMPLETE ROUND
       ===================================================== */

    function completeRound() {

        const round =
            debateRounds[currentRound];

        markRoundComplete(
            round.number
        );

        addLog(
            `Round ${round.number} completed.`
        );

        currentRound++;

        if (currentRound < debateRounds.length) {

            setTimeout(() => {

                startRound();

            }, 900);

        } else {

            setTimeout(() => {

                finishDebate();

            }, 900);

        }
    }

    /* =====================================================
       UPDATE PROGRESS
       ===================================================== */

    function updateProgress() {

        const totalSteps =
            debateRounds.length * 6;

        const completedSteps =
            (currentRound * 6) + currentAgent;

        const percentage =
            Math.min(
                100,
                Math.round(
                    (completedSteps / totalSteps) * 100
                )
            );

        debateProgress.style.width =
            `${percentage}%`;

        debatePercentage.textContent =
            `${percentage}%`;
    }

    /* =====================================================
       ROUND UI
       ===================================================== */

    function activateRound(number) {

        document
            .querySelectorAll(".round")
            .forEach(round => {
                round.classList.remove("active");
            });

        const active =
            document.getElementById(
                `round${number}`
            );

        if (active) {
            active.classList.add("active");
        }
    }

    function markRoundComplete(number) {

        const round =
            document.getElementById(
                `round${number}`
            );

        if (!round) return;

        round.classList.remove("active");
        round.classList.add("completed");

        const numberElement =
            round.querySelector("span");

        if (numberElement) {
            numberElement.innerHTML =
                `<i class="fa-solid fa-check"></i>`;
        }
    }

    /* =====================================================
       FINISH DEBATE
       ===================================================== */

    function finishDebate() {

        debateProgress.style.width = "100%";
        debatePercentage.textContent = "100%";

        debateStatus.textContent =
            "Debate Complete";

        roundNumber.textContent = "✓";

        coreTitle.textContent =
            "Consensus Ready";

        coreStatus.textContent =
            "PREPARING CONFLICT MAP";

        addLog(
            "All agents completed their debate rounds."
        );

        addLog(
            "Areas of agreement and disagreement have been identified."
        );

        addLog(
            "Council debate is complete. Conflict analysis is ready."
        );

        saveDebateResult();

        setTimeout(() => {

            const conflictPreview =
                document.getElementById(
                    "conflictPreview"
                );

            if (conflictPreview) {

                conflictPreview.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }

        }, 500);
    }

    /* =====================================================
       SAVE DEBATE RESULT
       ===================================================== */

    function saveDebateResult() {

        currentProblem.status =
            "Debate Complete";

        currentProblem.debateCompletedAt =
            new Date().toISOString();

        currentProblem.debateRounds = 3;

        currentProblem.debateSummary = {
            perspectives: 6,
            rounds: 3,
            status: "Completed",
            conflictsIdentified: true
        };

        localStorage.setItem(
            "currentProblem",
            JSON.stringify(currentProblem)
        );

        let problems = [];

        try {

            problems =
                JSON.parse(
                    localStorage.getItem(
                        "agentCouncilProblems"
                    )
                ) || [];

        } catch {

            problems = [];

        }

        const index =
            problems.findIndex(
                problem =>
                    problem.id === currentProblem.id
            );

        if (index !== -1) {

            problems[index] = {
                ...problems[index],
                ...currentProblem
            };

        } else {

            problems.push(currentProblem);

        }

        localStorage.setItem(
            "agentCouncilProblems",
            JSON.stringify(problems)
        );
    }

    /* =====================================================
       TYPEWRITER
       ===================================================== */

    function typeText(element, text, speed) {

        if (!element) return;

        element.textContent = "";

        let index = 0;

        const interval =
            setInterval(() => {

                element.textContent +=
                    text.charAt(index);

                index++;

                if (index >= text.length) {
                    clearInterval(interval);
                }

            }, speed);
    }

    /* =====================================================
       LOG
       ===================================================== */

    function addLog(message) {

        if (!debateLog) return;

        const item =
            document.createElement("div");

        item.className =
            "log-message";

        const time =
            new Date().toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );

        item.innerHTML = `
            <span class="log-time">
                ${time}
            </span>

            <span class="log-dot"></span>

            <span>
                ${escapeHTML(message)}
            </span>
        `;

        debateLog.appendChild(item);

        debateLog.scrollTop =
            debateLog.scrollHeight;
    }

    /* =====================================================
       DASHBOARD
       ===================================================== */

    dashboardBtn.addEventListener(
        "click",
        () => {
            window.location.href =
                "dashboard.html";
        }
    );

    /* =====================================================
       CONFLICT MAP
       ===================================================== */

    conflictBtn.addEventListener(
        "click",
        () => {

            currentProblem.status =
                "Ready for Conflict Map";

            localStorage.setItem(
                "currentProblem",
                JSON.stringify(currentProblem)
            );

            window.location.href =
                "conflict-map.html";
        }
    );

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

});