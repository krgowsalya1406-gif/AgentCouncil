document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // LOAD CURRENT PROBLEM
    // =========================

    const currentProblem = JSON.parse(
        localStorage.getItem("currentProblem") || "null"
    );

    if (!currentProblem) {
        window.location.href = "new-problem.html";
        return;
    }


    // =========================
    // ELEMENTS
    // =========================

    const problemTitle = document.getElementById("problemTitle");
    const problemType = document.getElementById("problemType");
    const problemStatus = document.getElementById("problemStatus");
    const problemDescription = document.getElementById("problemDescription");

    const agentCount = document.getElementById("agentCount");
    const debateCount = document.getElementById("debateCount");
    const conflictCount = document.getElementById("conflictCount");
    const simulationCount = document.getElementById("simulationCount");

    const factorTags = document.getElementById("factorTags");
    const assumptionTags = document.getElementById("assumptionTags");

    const debateInsight = document.getElementById("debateInsight");

    const memoryConsensus = document.getElementById("memoryConsensus");
    const memoryConflict = document.getElementById("memoryConflict");
    const memoryTradeoffs = document.getElementById("memoryTradeoffs");

    const memoryConfidence = document.getElementById("memoryConfidence");
    const memoryRisk = document.getElementById("memoryRisk");
    const memoryImpact = document.getElementById("memoryImpact");

    const saveMemoryBtn = document.getElementById("saveMemoryBtn");

    const memoryHistory = document.getElementById("memoryHistory");
    const memoryCount = document.getElementById("memoryCount");

    const dashboardBtn = document.getElementById("dashboardBtn");
    const finalDecisionBtn = document.getElementById("finalDecisionBtn");

    const toast = document.getElementById("toast");
    const toastTitle = document.getElementById("toastTitle");
    const toastMessage = document.getElementById("toastMessage");
    const closeToast = document.getElementById("closeToast");


    // =========================
    // SAFE TEXT
    // =========================

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // =========================
    // PROBLEM INFORMATION
    // =========================

    problemTitle.textContent =
        currentProblem.title || "Untitled Problem";

    problemType.textContent =
        currentProblem.type || "General";

    problemStatus.textContent =
        currentProblem.status || "Analysis Complete";

    problemDescription.textContent =
        currentProblem.description ||
        "No problem description available.";


    // =========================
    // LOAD RELATED DATA
    // =========================

    const debate =
        currentProblem.debateSummary || {};

    const conflict =
        currentProblem.conflictAnalysis || {};

    const simulations =
        JSON.parse(
            localStorage.getItem("agentCouncilSimulations") || "[]"
        );

    const problemSimulations = simulations.filter(
        simulation =>
            simulation.problemId === currentProblem.id
    );


    // =========================
    // COUNCIL SNAPSHOT
    // =========================

    const agents =
        Number(currentProblem.agentsCompleted) || 6;

    const rounds =
        Number(debate.rounds) || 3;

    const conflicts =
        Number(conflict.conflictCount) ||
        Number(conflict.conflicts) ||
        0;

    agentCount.textContent = agents;
    debateCount.textContent = rounds;

    simulationCount.textContent =
        problemSimulations.length;


    // =========================
    // FACTORS
    // =========================

    let factors = Array.isArray(currentProblem.factors)
        ? currentProblem.factors
        : [];

    if (factors.length === 0) {
        factors = [
            "Cost",
            "Time",
            "Risk",
            "Quality"
        ];
    }

    function renderFactors() {

        const safeFactors = factors.slice(0, 8);

        factorTags.innerHTML = safeFactors
            .map(
                factor =>
                    `<span>${escapeHTML(factor)}</span>`
            )
            .join("");

        assumptionTags.innerHTML = safeFactors
            .map(
                factor =>
                    `<span>${escapeHTML(factor)}</span>`
            )
            .join("");
    }

    renderFactors();


    // =========================
    // DEBATE INSIGHT
    // =========================

    if (debate.perspectives) {

        debateInsight.textContent =
            `${debate.perspectives} agent perspectives were compared across ${rounds} debate rounds before reaching a potential consensus.`;

    } else {

        debateInsight.textContent =
            "Six specialized agents compared different perspectives and challenged assumptions before the decision.";
    }


    // =========================
    // CONFLICT DATA
    // =========================

    let consensus =
        Number(conflict.consensusScore);

    let conflictScore =
        Number(conflict.conflictScore);

    let tradeoffs =
        Number(conflict.tradeoffCount);


    if (!Number.isFinite(consensus)) {
        consensus = 72;
    }

    if (!Number.isFinite(conflictScore)) {
        conflictScore = 28;
    }

    if (!Number.isFinite(tradeoffs)) {
        tradeoffs = Math.max(
            2,
            Math.ceil(factors.length / 2)
        );
    }

    consensus = Math.max(
        0,
        Math.min(100, Math.round(consensus))
    );

    conflictScore = Math.max(
        0,
        Math.min(100, Math.round(conflictScore))
    );

    tradeoffs = Math.max(
        0,
        Math.round(tradeoffs)
    );

    memoryConsensus.textContent =
        `${consensus}%`;

    memoryConflict.textContent =
        `${conflictScore}%`;

    memoryTradeoffs.textContent =
        tradeoffs;


    conflictCount.textContent =
        conflicts || tradeoffs;


    // =========================
    // SIMULATION DATA
    // =========================

    let latestSimulation = null;

    if (problemSimulations.length > 0) {

        latestSimulation =
            problemSimulations[
                problemSimulations.length - 1
            ];

    }

    if (!latestSimulation && currentProblem.lastSimulation) {
        latestSimulation =
            currentProblem.lastSimulation;
    }


    if (latestSimulation) {

        const confidence =
            Number(
                latestSimulation.confidence ??
                latestSimulation.results?.confidence
            );

        const risk =
            Number(
                latestSimulation.risk ??
                latestSimulation.results?.risk
            );

        const impact =
            Number(
                latestSimulation.impact ??
                latestSimulation.results?.impact
            );

        memoryConfidence.textContent =
            Number.isFinite(confidence)
                ? `${Math.round(confidence)}%`
                : "--%";

        memoryRisk.textContent =
            Number.isFinite(risk)
                ? `${Math.round(risk)}%`
                : "--%";

        memoryImpact.textContent =
            Number.isFinite(impact)
                ? `${Math.round(impact)}%`
                : "--%";

    } else {

        memoryConfidence.textContent = "--%";
        memoryRisk.textContent = "--%";
        memoryImpact.textContent = "--%";
    }


    // =========================
    // MEMORY STORAGE
    // =========================

    function getMemories() {

        return JSON.parse(
            localStorage.getItem(
                "agentCouncilDecisionMemory"
            ) || "[]"
        );

    }


    function saveMemories(memories) {

        localStorage.setItem(
            "agentCouncilDecisionMemory",
            JSON.stringify(memories)
        );

    }


    // =========================
    // GENERATE LEARNINGS
    // =========================

    function generateLearnings() {

        const learnings = [];

        learnings.push(
            "Multiple decision factors should be considered together instead of evaluating a single factor in isolation."
        );

        learnings.push(
            "Different agent perspectives can reveal disagreements, risks and hidden trade-offs."
        );

        if (latestSimulation) {

            learnings.push(
                "What-if simulation provides a way to examine how changing conditions may influence the expected outcome."
            );

        } else {

            learnings.push(
                "Scenario testing should be considered before committing to an important decision."
            );

        }

        return learnings;
    }


    // =========================
    // SAVE MEMORY
    // =========================

    function saveDecisionMemory() {

        let memories = getMemories();

        const alreadySaved = memories.some(
            memory =>
                memory.problemId === currentProblem.id
        );

        if (alreadySaved) {

            showToast(
                "Already Saved",
                "This decision already exists in Decision Memory."
            );

            renderMemoryHistory();
            return;
        }


        const memory = {

            id:
                "MEM-" +
                Date.now()
                    .toString()
                    .slice(-8),

            problemId:
                currentProblem.id || null,

            title:
                currentProblem.title ||
                "Untitled Problem",

            type:
                currentProblem.type ||
                "General",

            description:
                currentProblem.description ||
                "",

            status:
                "Memory Saved",

            createdAt:
                new Date().toISOString(),

            createdDate:
                new Date().toLocaleDateString(),

            createdTime:
                new Date().toLocaleTimeString(),

            factors:
                [...factors],

            council: {

                agents:
                    agents,

                completed:
                    currentProblem.analysisCompletedAt
                        ? true
                        : false,

                summary:
                    currentProblem.analysisSummary ||
                    "Council analysis completed."

            },

            debate: {

                rounds:
                    rounds,

                perspectives:
                    Number(debate.perspectives) || 6,

                completed:
                    debate.status === "Completed" ||
                    true

            },

            conflict: {

                consensus:
                    consensus,

                conflict:
                    conflictScore,

                tradeoffs:
                    tradeoffs

            },

            simulation:
                latestSimulation || null,

            learnings:
                generateLearnings()

        };


        memories.unshift(memory);

        if (memories.length > 20) {
            memories = memories.slice(0, 20);
        }

        saveMemories(memories);


        // Update current problem
        currentProblem.status =
            "Decision Memory Saved";

        currentProblem.memorySavedAt =
            new Date().toISOString();

        currentProblem.memoryId =
            memory.id;


        localStorage.setItem(
            "currentProblem",
            JSON.stringify(currentProblem)
        );


        // Update problems collection
        const problems =
            JSON.parse(
                localStorage.getItem(
                    "agentCouncilProblems"
                ) || "[]"
            );

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

            localStorage.setItem(
                "agentCouncilProblems",
                JSON.stringify(problems)
            );
        }


        saveMemoryBtn.innerHTML =
            `<i class="fa-solid fa-check"></i> Memory Saved`;

        saveMemoryBtn.disabled = true;

        saveMemoryBtn.style.opacity = "0.7";

        showToast(
            "Memory Saved",
            "The complete decision journey has been stored."
        );

        renderMemoryHistory();
    }


    // =========================
    // MEMORY HISTORY
    // =========================

    function renderMemoryHistory() {

        const memories = getMemories();

        memoryCount.textContent =
            `${memories.length} ${
                memories.length === 1
                    ? "memory"
                    : "memories"
            }`;


        if (memories.length === 0) {

            memoryHistory.innerHTML = `
                <div class="empty-memory">

                    <div class="empty-icon">
                        <i class="fa-solid fa-box-open"></i>
                    </div>

                    <h3>No saved memories yet</h3>

                    <p>
                        Save this decision to create your first
                        reusable decision memory.
                    </p>

                </div>
            `;

            return;
        }


        memoryHistory.innerHTML =
            memories
                .slice(0, 8)
                .map(memory => {

                    const date =
                        memory.createdDate ||
                        new Date(
                            memory.createdAt
                        ).toLocaleDateString();

                    const memoryType =
                        escapeHTML(
                            memory.type || "General"
                        );

                    const title =
                        escapeHTML(
                            memory.title ||
                            "Untitled Decision"
                        );

                    const memoryId =
                        escapeHTML(
                            memory.id || "MEM"
                        );

                    return `
                        <div class="memory-history-card">

                            <div class="memory-history-info">

                                <h3>
                                    ${title}
                                </h3>

                                <p>
                                    ${memoryId} • Saved on ${escapeHTML(date)}
                                </p>

                            </div>

                            <div class="memory-history-meta">

                                <span>
                                    ${memoryType}
                                </span>

                                <span>
                                    ${memory.council?.agents || 6} Agents
                                </span>

                                <span>
                                    ${memory.debate?.rounds || 3} Rounds
                                </span>

                                <span>
                                    Saved
                                </span>

                            </div>

                        </div>
                    `;

                })
                .join("");
    }


    // =========================
    // CHECK CURRENT MEMORY
    // =========================

    function checkCurrentMemory() {

        const memories = getMemories();

        const exists =
            memories.some(
                memory =>
                    memory.problemId === currentProblem.id
            );

        if (exists) {

            saveMemoryBtn.innerHTML =
                `<i class="fa-solid fa-check"></i> Memory Saved`;

            saveMemoryBtn.disabled = true;

            saveMemoryBtn.style.opacity = "0.7";
        }
    }


    // =========================
    // TOAST
    // =========================

    let toastTimer;

    function showToast(title, message) {

        toastTitle.textContent = title;
        toastMessage.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {

            toast.classList.remove("show");

        }, 4000);
    }


    closeToast.addEventListener(
        "click",
        () => {
            toast.classList.remove("show");
        }
    );


    // =========================
    // NAVIGATION
    // =========================

    dashboardBtn.addEventListener(
        "click",
        () => {
            window.location.href = "dashboard.html";
        }
    );


    finalDecisionBtn.addEventListener(
        "click",
        () => {

            localStorage.setItem(
                "decisionFlowStage",
                "final-decision"
            );

            currentProblem.status =
                "Ready for Final Decision";

            localStorage.setItem(
                "currentProblem",
                JSON.stringify(currentProblem)
            );

            /*
             * Prediction page is used as the next stage
             * until the dedicated final-decision page
             * is created.
             */
            window.location.href =
                "prediction.html";
        }
    );


    // =========================
    // BUTTON EVENTS
    // =========================

    saveMemoryBtn.addEventListener(
        "click",
        saveDecisionMemory
    );


    // =========================
    // INITIALIZE
    // =========================

    renderMemoryHistory();

    checkCurrentMemory();

});