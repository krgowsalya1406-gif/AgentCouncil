/* =========================================================
   AgentCouncil | Council Analysis
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMENTS
       ========================= */

    const problemTitle = document.getElementById("problemTitle");
    const problemType = document.getElementById("problemType");
    const problemDescription = document.getElementById("problemDescription");
    const factorList = document.getElementById("factorList");

    const progressText = document.getElementById("progressText");
    const progressBar = document.getElementById("progressBar");

    const coreStatus = document.getElementById("coreStatus");
    const analysisLog = document.getElementById("analysisLog");

    const nextSection = document.getElementById("nextSection");
    const debateBtn = document.getElementById("debateBtn");
    const dashboardBtn = document.getElementById("dashboardBtn");

    const agentCards = document.querySelectorAll(".agent-card");
    const agentNodes = document.querySelectorAll(".agent-node");

    /* =========================
       LOAD CURRENT PROBLEM
       ========================= */

    let currentProblem = null;

    try {
        currentProblem = JSON.parse(
            localStorage.getItem("currentProblem")
        );
    } catch (error) {
        console.error("Unable to load current problem:", error);
    }

    if (!currentProblem) {
        showLog("No active problem found. Redirecting...");
        setTimeout(() => {
            window.location.href = "new-problem.html";
        }, 1200);
        return;
    }

    /* =========================
       DISPLAY PROBLEM
       ========================= */

    problemTitle.textContent =
        currentProblem.title || "Untitled Problem";

    problemType.textContent =
        currentProblem.type || "General";

    problemDescription.textContent =
        currentProblem.description ||
        "No problem description provided.";

    renderFactors(currentProblem.factors);

    /* =========================
       AGENT CONFIGURATION
       ========================= */

    const agents = [
        {
            id: "research",
            name: "Research Agent",
            message: "Searching relevant patterns, alternatives and supporting information."
        },
        {
            id: "budget",
            name: "Budget Agent",
            message: "Evaluating estimated cost, budget limits and financial trade-offs."
        },
        {
            id: "risk",
            name: "Risk Agent",
            message: "Identifying possible risks, uncertainties and failure scenarios."
        },
        {
            id: "planning",
            name: "Planning Agent",
            message: "Breaking the problem into practical steps and possible timelines."
        },
        {
            id: "resource",
            name: "Resource Agent",
            message: "Checking required people, tools, resources and availability."
        },
        {
            id: "ethics",
            name: "Ethics Agent",
            message: "Reviewing fairness, safety, responsibility and human impact."
        }
    ];

    /* =========================
       INITIAL STATE
       ========================= */

    let completedAgents = 0;

    progressText.textContent = "0 / 6 Active";
    progressBar.style.width = "0%";

    coreStatus.textContent = "INITIALIZING";

    /* =========================
       START ANALYSIS
       ========================= */

    setTimeout(() => {
        coreStatus.textContent = "ANALYZING";

        showLog(
            "Council activated. Six specialized agents are joining the analysis."
        );

        startAgentSequence();
    }, 900);

    /* =========================
       SEQUENTIAL AGENT ANALYSIS
       ========================= */

    function startAgentSequence() {

        agents.forEach((agent, index) => {

            setTimeout(() => {
                analyzeAgent(agent);
            }, index * 2600);
        });
    }

    /* =========================
       ANALYZE AGENT
       ========================= */

    function analyzeAgent(agent) {

        const card = document.querySelector(
            `.agent-card[data-agent="${agent.id}"]`
        );

        const node = document.querySelector(
            `.node-${agent.id}`
        );

        if (!card) return;

        const status = card.querySelector(".agent-status");
        const progress = card.querySelector(".agent-progress-bar");
        const percentage = card.querySelector(
            ".agent-progress > span"
        );

        /* Agent starts */

        card.classList.remove("waiting");
        card.classList.add("analyzing");

        if (status) {
            status.textContent = "Analyzing";
            status.className = "agent-status analyzing";
        }

        if (node) {
            node.classList.add("active");
        }

        coreStatus.textContent = agent.name
            .replace(" Agent", "")
            .toUpperCase();

        showLog(`${agent.name} started analysis.`);
        showLog(agent.message);

        /* Animate progress */

        let value = 0;

        const duration = 2100;
        const intervalTime = 35;
        const increment = 100 / (duration / intervalTime);

        const progressInterval = setInterval(() => {

            value += increment;

            if (value >= 100) {
                value = 100;
                clearInterval(progressInterval);

                completeAgent(
                    agent,
                    card,
                    node,
                    status,
                    progress,
                    percentage
                );
            }

            progress.style.width = `${value}%`;
            percentage.textContent = `${Math.round(value)}%`;

        }, intervalTime);
    }

    /* =========================
       COMPLETE AGENT
       ========================= */

    function completeAgent(
        agent,
        card,
        node,
        status,
        progress,
        percentage
    ) {

        card.classList.remove("analyzing");
        card.classList.add("complete");

        if (status) {
            status.textContent = "Complete";
            status.className = "agent-status complete";
        }

        if (progress) {
            progress.style.width = "100%";
        }

        if (percentage) {
            percentage.textContent = "100%";
        }

        if (node) {
            node.classList.remove("active");
            node.classList.add("complete");
        }

        completedAgents++;

        updateOverallProgress();

        showLog(
            `${agent.name} completed its perspective.`
        );

        if (completedAgents === agents.length) {
            finishCouncilAnalysis();
        }
    }

    /* =========================
       OVERALL PROGRESS
       ========================= */

    function updateOverallProgress() {

        const percentage =
            (completedAgents / agents.length) * 100;

        progressBar.style.width = `${percentage}%`;

        progressText.textContent =
            `${completedAgents} / ${agents.length} Active`;
    }

    /* =========================
       FINISH ANALYSIS
       ========================= */

    function finishCouncilAnalysis() {

        coreStatus.textContent = "READY";

        showLog(
            "All six agents completed their independent analysis."
        );

        setTimeout(() => {

            coreStatus.textContent = "COUNCIL READY";

            showLog(
                "Council perspectives are synchronized."
            );

            showLog(
                "Ready to proceed to Agent Debate."
            );

            saveAnalysisStatus();

            nextSection.classList.add("show");

            nextSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 700);
    }

    /* =========================
       SAVE ANALYSIS
       ========================= */

    function saveAnalysisStatus() {

        currentProblem.status = "Council Analysis Complete";

        currentProblem.analysisCompletedAt =
            new Date().toISOString();

        currentProblem.agentsCompleted =
            agents.map(agent => agent.name);

        currentProblem.analysisSummary = {
            research: "Relevant information and alternatives reviewed.",
            budget: "Cost and financial trade-offs reviewed.",
            risk: "Risks and uncertainty reviewed.",
            planning: "Execution steps and timeline reviewed.",
            resource: "Required resources reviewed.",
            ethics: "Safety, fairness and human impact reviewed."
        };

        localStorage.setItem(
            "currentProblem",
            JSON.stringify(currentProblem)
        );

        /* Update problems array */

        let problems = [];

        try {
            problems = JSON.parse(
                localStorage.getItem("agentCouncilProblems")
            ) || [];
        } catch {
            problems = [];
        }

        const index = problems.findIndex(
            problem => problem.id === currentProblem.id
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

    /* =========================
       FACTORS
       ========================= */

    function renderFactors(factors) {

        if (!factorList) return;

        factorList.innerHTML = "";

        if (!factors || factors.length === 0) {

            const chip = document.createElement("span");

            chip.className = "factor-chip";
            chip.textContent = "General Analysis";

            factorList.appendChild(chip);

            return;
        }

        factors.forEach(factor => {

            const chip = document.createElement("span");

            chip.className = "factor-chip";
            chip.textContent = factor;

            factorList.appendChild(chip);
        });
    }

    /* =========================
       ANALYSIS LOG
       ========================= */

    function showLog(message) {

        if (!analysisLog) return;

        const item = document.createElement("div");

        item.className = "log-item";

        const time = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        item.innerHTML = `
            <span class="log-time">${time}</span>
            <span class="log-dot"></span>
            <span>${escapeHTML(message)}</span>
        `;

        analysisLog.appendChild(item);

        analysisLog.scrollTop =
            analysisLog.scrollHeight;
    }

    /* =========================
       DASHBOARD
       ========================= */

    if (dashboardBtn) {

        dashboardBtn.addEventListener("click", () => {

            window.location.href =
                "dashboard.html";
        });
    }

    /* =========================
       DEBATE BUTTON
       ========================= */

    if (debateBtn) {

        debateBtn.addEventListener("click", () => {

            currentProblem.status =
                "Ready for Agent Debate";

            localStorage.setItem(
                "currentProblem",
                JSON.stringify(currentProblem)
            );

            window.location.href =
                "agent-debate.html";
        });
    }

    /* =========================
       ESCAPE HTML
       ========================= */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

});