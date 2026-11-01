document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       ELEMENTS
    ========================================================= */

    const currentTitle =
        document.getElementById("currentTitle");

    const currentDescription =
        document.getElementById("currentDescription");

    const currentType =
        document.getElementById("currentType");

    const currentStatus =
        document.getElementById("currentStatus");

    const totalProblems =
        document.getElementById("totalProblems");

    const totalDecisions =
        document.getElementById("totalDecisions");

    const totalLearning =
        document.getElementById("totalLearning");

    const averageAccuracy =
        document.getElementById("averageAccuracy");

    const searchInput =
        document.getElementById("searchInput");

    const typeFilter =
        document.getElementById("typeFilter");

    const statusFilter =
        document.getElementById("statusFilter");

    const historyList =
        document.getElementById("historyList");

    const emptyState =
        document.getElementById("emptyState");

    const resultCount =
        document.getElementById("resultCount");

    const newDecisionBtn =
        document.getElementById("newDecisionBtn");

    const newProblemBtn =
        document.getElementById("newProblemBtn");

    const dashboardBtn =
        document.getElementById("dashboardBtn");

    const decisionDetails =
        document.getElementById("decisionDetails");

    const detailsTitle =
        document.getElementById("detailsTitle");

    const detailsAgents =
        document.getElementById("detailsAgents");

    const detailsDebate =
        document.getElementById("detailsDebate");

    const detailsConflict =
        document.getElementById("detailsConflict");

    const detailsSimulation =
        document.getElementById("detailsSimulation");

    const detailsLearning =
        document.getElementById("detailsLearning");

    const detailsPredicted =
        document.getElementById("detailsPredicted");

    const detailsActual =
        document.getElementById("detailsActual");

    const detailsAccuracy =
        document.getElementById("detailsAccuracy");

    const closeDetailsBtn =
        document.getElementById("closeDetailsBtn");

    const toast =
        document.getElementById("toast");

    const toastTitle =
        document.getElementById("toastTitle");

    const toastMessage =
        document.getElementById("toastMessage");

    const closeToast =
        document.getElementById("closeToast");


    /* =========================================================
       LOAD LOCAL STORAGE DATA
    ========================================================= */

    const currentProblem = JSON.parse(
        localStorage.getItem("currentProblem") || "null"
    );

    const problems = JSON.parse(
        localStorage.getItem("agentCouncilProblems") || "[]"
    );

    const decisions = JSON.parse(
        localStorage.getItem("agentCouncilDecisions") || "[]"
    );

    const learningRecords = JSON.parse(
        localStorage.getItem("agentCouncilLearning") || "[]"
    );

    const memories = JSON.parse(
        localStorage.getItem("agentCouncilDecisionMemory") || "[]"
    );

    const simulations = JSON.parse(
        localStorage.getItem("agentCouncilSimulations") || "[]"
    );


    /* =========================================================
       BUILD COMPLETE HISTORY
    ========================================================= */

    let historyData = buildHistory();

    renderCurrentDecision();
    renderStatistics();
    renderHistory();


    /* =========================================================
       BUILD HISTORY DATA
    ========================================================= */

    function buildHistory() {

        const map = new Map();


        /* -----------------------------------------------------
           Problems
        ----------------------------------------------------- */

        problems.forEach(problem => {

            if (!problem || !problem.id) {
                return;
            }

            map.set(problem.id, {
                ...problem
            });

        });


        /* -----------------------------------------------------
           Current Problem
        ----------------------------------------------------- */

        if (
            currentProblem &&
            currentProblem.id
        ) {

            map.set(
                currentProblem.id,
                {
                    ...(map.get(currentProblem.id) || {}),
                    ...currentProblem
                }
            );

        }


        /* -----------------------------------------------------
           Decisions
        ----------------------------------------------------- */

        decisions.forEach(decision => {

            if (!decision) {
                return;
            }

            const id =
                decision.problemId ||
                decision.id;

            if (!id) {
                return;
            }

            const existing =
                map.get(id) || {};

            map.set(id, {
                ...existing,
                ...decision,
                id
            });

        });


        /* -----------------------------------------------------
           Memories
        ----------------------------------------------------- */

        memories.forEach(memory => {

            if (!memory || !memory.problemId) {
                return;
            }

            const existing =
                map.get(memory.problemId) || {};

            map.set(
                memory.problemId,
                {
                    ...existing,

                    memorySaved: true,

                    memoryId:
                        memory.id,

                    memoryData:
                        memory
                }
            );

        });


        /* -----------------------------------------------------
           Learning
        ----------------------------------------------------- */

        learningRecords.forEach(record => {

            if (!record || !record.problemId) {
                return;
            }

            const existing =
                map.get(record.problemId) || {};

            map.set(
                record.problemId,
                {
                    ...existing,

                    learningRecord:
                        record,

                    predictionReality: {
                        predicted:
                            record.predicted,

                        actual:
                            record.actual,

                        accuracy:
                            record.accuracy
                    }
                }
            );

        });


        /* -----------------------------------------------------
           Simulations
        ----------------------------------------------------- */

        simulations.forEach(simulation => {

            if (!simulation || !simulation.problemId) {
                return;
            }

            const existing =
                map.get(simulation.problemId) || {};

            const previousSimulation =
                existing.simulationData;

            map.set(
                simulation.problemId,
                {
                    ...existing,

                    simulationData:
                        simulation,

                    simulationCount:
                        (existing.simulationCount || 0) + 1
                }
            );

        });


        return Array.from(map.values())
            .sort((a, b) => {

                const dateA =
                    new Date(
                        a.createdAt ||
                        a.analyzedAt ||
                        0
                    );

                const dateB =
                    new Date(
                        b.createdAt ||
                        b.analyzedAt ||
                        0
                    );

                return dateB - dateA;
            });

    }


    /* =========================================================
       CURRENT DECISION
    ========================================================= */

    function renderCurrentDecision() {

        if (!currentProblem) {

            currentTitle.textContent =
                "No Active Decision";

            currentDescription.textContent =
                "Create a new problem to begin a decision cycle.";

            currentType.textContent =
                "GENERAL";

            currentStatus.textContent =
                "NO ACTIVE DECISION";

            return;
        }


        currentTitle.textContent =
            currentProblem.title ||
            "Untitled Decision";

        currentDescription.textContent =
            currentProblem.description ||
            "No description available.";

        currentType.textContent =
            String(
                currentProblem.type ||
                "General"
            ).toUpperCase();

        currentStatus.textContent =
            formatStatus(
                currentProblem.status ||
                "Completed"
            ).toUpperCase();

    }


    /* =========================================================
       STATISTICS
    ========================================================= */

    function renderStatistics() {

        totalProblems.textContent =
            historyData.length;


        const decisionCount =
            historyData.filter(item =>
                hasDecisionProgress(item)
            ).length;

        totalDecisions.textContent =
            decisionCount;


        totalLearning.textContent =
            learningRecords.length;


        const accuracyValues =
            learningRecords
                .map(item =>
                    Number(item.accuracy)
                )
                .filter(value =>
                    Number.isFinite(value)
                );


        if (accuracyValues.length === 0) {

            averageAccuracy.textContent =
                "—";

        } else {

            const average =
                Math.round(
                    accuracyValues.reduce(
                        (sum, value) =>
                            sum + value,
                        0
                    ) /
                    accuracyValues.length
                );

            averageAccuracy.textContent =
                `${average}%`;
        }

    }


    /* =========================================================
       RENDER HISTORY
    ========================================================= */

    function renderHistory() {

        const searchTerm =
            searchInput.value
                .trim()
                .toLowerCase();

        const selectedType =
            typeFilter.value;

        const selectedStatus =
            statusFilter.value;


        const filtered =
            historyData.filter(item => {

                const title =
                    String(
                        item.title ||
                        ""
                    ).toLowerCase();

                const description =
                    String(
                        item.description ||
                        ""
                    ).toLowerCase();

                const type =
                    String(
                        item.type ||
                        "General"
                    );

                const status =
                    String(
                        item.status ||
                        ""
                    ).toLowerCase();


                const matchesSearch =
                    !searchTerm ||
                    title.includes(searchTerm) ||
                    description.includes(searchTerm);


                const matchesType =
                    selectedType === "all" ||
                    type.toLowerCase() ===
                    selectedType.toLowerCase();


                let matchesStatus = true;


                if (
                    selectedStatus ===
                    "completed"
                ) {

                    matchesStatus =
                        status.includes("complete") ||
                        status.includes("decision");

                } else if (
                    selectedStatus ===
                    "learning"
                ) {

                    matchesStatus =
                        Boolean(
                            item.learningRecord ||
                            item.predictionReality
                        );

                } else if (
                    selectedStatus ===
                    "memory"
                ) {

                    matchesStatus =
                        Boolean(
                            item.memorySaved ||
                            item.memoryData
                        );
                }


                return (
                    matchesSearch &&
                    matchesType &&
                    matchesStatus
                );

            });


        historyList.innerHTML = "";


        resultCount.textContent =
            `${filtered.length} ${
                filtered.length === 1
                    ? "decision"
                    : "decisions"
            }`;


        if (filtered.length === 0) {

            emptyState.classList.add("show");

            return;
        }


        emptyState.classList.remove("show");


        filtered.forEach(
            (item, index) => {

                historyList.appendChild(
                    createHistoryCard(
                        item,
                        index
                    )
                );

            }
        );

    }


    /* =========================================================
       CREATE HISTORY CARD
    ========================================================= */

    function createHistoryCard(
        item,
        index
    ) {

        const card =
            document.createElement("article");

        card.className =
            "history-card";

        card.style.animationDelay =
            `${index * 0.04}s`;


        const accuracy =
            getAccuracy(item);


        const type =
            item.type ||
            "General";


        const status =
            formatStatus(
                item.status ||
                "Completed"
            );


        const date =
            formatDate(
                item.createdAt ||
                item.analyzedAt
            );


        card.innerHTML = `

            <div class="history-number">
                ${String(index + 1).padStart(2, "0")}
            </div>


            <div class="history-card-content">

                <div class="history-card-top">

                    <span class="history-type">
                        ${escapeHTML(type)}
                    </span>

                    <span class="history-status">
                        ${escapeHTML(status)}
                    </span>

                </div>


                <h3>
                    ${escapeHTML(
                        item.title ||
                        "Untitled Decision"
                    )}
                </h3>


                <p class="history-card-description">
                    ${escapeHTML(
                        item.description ||
                        "No description available."
                    )}
                </p>


                <div class="history-date">

                    <i class="fa-regular fa-calendar"></i>

                    ${escapeHTML(date)}

                </div>

            </div>


            <div class="history-card-action">

                <div class="history-accuracy">

                    <span>
                        Accuracy
                    </span>

                    <strong>
                        ${
                            accuracy === null
                                ? "—"
                                : `${accuracy}%`
                        }
                    </strong>

                </div>


                <button
                    class="view-history-btn"
                    type="button"
                    title="View decision"
                    data-id="${escapeHTML(
                        item.id || ""
                    )}"
                >
                    <i class="fa-solid fa-arrow-right"></i>
                </button>

            </div>

        `;


        const viewButton =
            card.querySelector(
                ".view-history-btn"
            );


        viewButton.addEventListener(
            "click",
            () => {
                showDecisionDetails(item);
            }
        );


        return card;

    }


    /* =========================================================
       SHOW DETAILS
    ========================================================= */

    function showDecisionDetails(item) {

        detailsTitle.textContent =
            item.title ||
            "Untitled Decision";


        /* -----------------------------------------------------
           Council
        ----------------------------------------------------- */

        const agentCount =
            item.agentsCompleted ||
            item.council?.agentCount ||
            item.council?.agents ||
            6;


        detailsAgents.textContent =
            `${agentCount} Agents`;


        /* -----------------------------------------------------
           Debate
        ----------------------------------------------------- */

        const rounds =
            item.debateRounds ||
            item.debate?.rounds ||
            3;


        detailsDebate.textContent =
            `${rounds} Rounds`;


        /* -----------------------------------------------------
           Conflict
        ----------------------------------------------------- */

        const conflict =
            getConflictScore(item);


        detailsConflict.textContent =
            conflict === null
                ? "—"
                : `${conflict}%`;


        /* -----------------------------------------------------
           Simulation
        ----------------------------------------------------- */

        const simulation =
            getSimulationScore(item);


        detailsSimulation.textContent =
            simulation === null
                ? "—"
                : `${simulation}%`;


        /* -----------------------------------------------------
           Learning
        ----------------------------------------------------- */

        const learning =
            item.learningRecord ||
            findLearning(item.id);


        if (learning) {

            const learningText =
                buildLearningText(
                    learning
                );

            detailsLearning.textContent =
                learningText;

        } else {

            detailsLearning.textContent =
                "No prediction-versus-reality learning record has been created for this decision yet.";

        }


        /* -----------------------------------------------------
           Predicted / Actual
        ----------------------------------------------------- */

        const prediction =
            item.predictionReality ||
            learning ||
            null;


        if (prediction) {

            const predicted =
                prediction.predicted ||
                {};

            const actual =
                prediction.actual ||
                {};


            detailsPredicted.textContent =
                buildOutcomeText(
                    predicted
                );


            detailsActual.textContent =
                buildOutcomeText(
                    actual
                );


            const accuracy =
                prediction.accuracy ??
                learning?.accuracy;


            detailsAccuracy.textContent =
                accuracy === undefined ||
                accuracy === null
                    ? "—%"
                    : `${accuracy}%`;

        } else {

            detailsPredicted.textContent =
                "No prediction";

            detailsActual.textContent =
                "No actual outcome";

            detailsAccuracy.textContent =
                "—%";
        }


        decisionDetails.classList.add(
            "show"
        );


        decisionDetails.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /* =========================================================
       CONFLICT SCORE
    ========================================================= */

    function getConflictScore(item) {

        const conflict =
            item.conflictAnalysis ||
            item.conflict ||
            item.memoryData?.conflict ||
            null;


        if (!conflict) {
            return null;
        }


        if (
            conflict.conflict !== undefined
        ) {

            return normalizeScore(
                conflict.conflict
            );

        }


        if (
            conflict.conflictScore !== undefined
        ) {

            return normalizeScore(
                conflict.conflictScore
            );

        }


        if (
            conflict.conflictPercentage !== undefined
        ) {

            return normalizeScore(
                conflict.conflictPercentage
            );

        }


        return null;

    }


    /* =========================================================
       SIMULATION SCORE
    ========================================================= */

    function getSimulationScore(item) {

        const simulation =
            item.simulationData ||
            findLatestSimulation(
                item.id
            );


        if (!simulation) {
            return null;
        }


        const value =
            simulation.confidence ??
            simulation.results?.confidence ??
            simulation.simulatedConfidence;


        if (
            value === undefined ||
            value === null
        ) {

            return null;
        }


        return normalizeScore(value);

    }


    /* =========================================================
       FIND LEARNING
    ========================================================= */

    function findLearning(problemId) {

        return learningRecords.find(
            record =>
                record.problemId === problemId
        ) || null;

    }


    /* =========================================================
       FIND SIMULATION
    ========================================================= */

    function findLatestSimulation(problemId) {

        const matches =
            simulations.filter(
                simulation =>
                    simulation.problemId ===
                    problemId
            );


        if (matches.length === 0) {
            return null;
        }


        return matches[
            matches.length - 1
        ];

    }


    /* =========================================================
       GET ACCURACY
    ========================================================= */

    function getAccuracy(item) {

        if (
            item.predictionReality &&
            item.predictionReality.accuracy !==
            undefined
        ) {

            return normalizeScore(
                item.predictionReality.accuracy
            );

        }


        if (
            item.learningRecord &&
            item.learningRecord.accuracy !==
            undefined
        ) {

            return normalizeScore(
                item.learningRecord.accuracy
            );

        }


        const learning =
            findLearning(item.id);


        if (
            learning &&
            learning.accuracy !== undefined
        ) {

            return normalizeScore(
                learning.accuracy
            );

        }


        return null;

    }


    /* =========================================================
       HAS DECISION PROGRESS
    ========================================================= */

    function hasDecisionProgress(item) {

        return Boolean(
            item.status ||
            item.debateRounds ||
            item.analysisCompletedAt ||
            item.debateCompletedAt ||
            item.conflictAnalysis ||
            item.simulationData ||
            item.predictionReality ||
            item.memorySaved
        );

    }


    /* =========================================================
       LEARNING TEXT
    ========================================================= */

    function buildLearningText(
        learning
    ) {

        if (!learning) {
            return "No learning information available.";
        }


        const predicted =
            learning.predicted ||
            {};

        const actual =
            learning.actual ||
            {};


        const confidenceGap =
            Math.abs(
                Number(
                    predicted.confidence || 0
                ) -
                Number(
                    actual.confidence || 0
                )
            );


        const riskGap =
            Math.abs(
                Number(
                    predicted.risk || 0
                ) -
                Number(
                    actual.risk || 0
                )
            );


        const impactGap =
            Math.abs(
                Number(
                    predicted.impact || 0
                ) -
                Number(
                    actual.impact || 0
                )
            );


        return `
            Confidence difference: ${confidenceGap}%.
            Risk difference: ${riskGap}%.
            Impact difference: ${impactGap}%.
            Recorded learning accuracy:
            ${learning.accuracy ?? "—"}%.
        `;

    }


    /* =========================================================
       OUTCOME TEXT
    ========================================================= */

    function buildOutcomeText(
        data
    ) {

        if (!data) {
            return "—";
        }


        const confidence =
            data.confidence !== undefined
                ? `C ${data.confidence}%`
                : "";


        const risk =
            data.risk !== undefined
                ? `R ${data.risk}%`
                : "";


        const impact =
            data.impact !== undefined
                ? `I ${data.impact}%`
                : "";


        const outcome =
            data.outcome
                ? formatOutcome(data.outcome)
                : "";


        return [
            confidence,
            risk,
            impact,
            outcome
        ]
            .filter(Boolean)
            .join(" • ");

    }


    /* =========================================================
       FILTER EVENTS
    ========================================================= */

    searchInput.addEventListener(
        "input",
        renderHistory
    );


    typeFilter.addEventListener(
        "change",
        renderHistory
    );


    statusFilter.addEventListener(
        "change",
        renderHistory
    );


    /* =========================================================
       CLOSE DETAILS
    ========================================================= */

    closeDetailsBtn.addEventListener(
        "click",
        () => {

            decisionDetails.classList.remove(
                "show"
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    /* =========================================================
       NEW PROBLEM
    ========================================================= */

    newDecisionBtn.addEventListener(
        "click",
        startNewProblem
    );


    newProblemBtn.addEventListener(
        "click",
        startNewProblem
    );


    function startNewProblem() {

        localStorage.removeItem(
            "currentProblem"
        );

        localStorage.removeItem(
            "selectedProblemType"
        );

        localStorage.setItem(
            "decisionFlowStage",
            "new-problem"
        );

        window.location.href =
            "new-problem.html";

    }


    /* =========================================================
       DASHBOARD
    ========================================================= */

    dashboardBtn.addEventListener(
        "click",
        () => {

            localStorage.setItem(
                "decisionFlowStage",
                "dashboard"
            );

            window.location.href =
                "dashboard.html";

        }
    );


    /* =========================================================
       TOAST
    ========================================================= */

    closeToast.addEventListener(
        "click",
        () => {

            toast.classList.remove(
                "show"
            );

        }
    );


    function showToast(
        title,
        message
    ) {

        toastTitle.textContent =
            title;

        toastMessage.textContent =
            message;

        toast.classList.add(
            "show"
        );


        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 4000);

    }


    /* =========================================================
       HELPERS
    ========================================================= */

    function normalizeScore(value) {

        const number =
            Number(value);

        if (
            !Number.isFinite(number)
        ) {
            return null;
        }

        return Math.max(
            0,
            Math.min(
                100,
                Math.round(number)
            )
        );

    }


    function formatStatus(status) {

        return String(status)
            .replace(
                /([a-z])([A-Z])/g,
                "$1 $2"
            )
            .replace(
                /[-_]/g,
                " "
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();

    }


    function formatOutcome(value) {

        if (!value) {
            return "Unknown";
        }


        const text =
            String(value)
                .replace(
                    /[-_]/g,
                    " "
                )
                .trim();


        return text.charAt(0).toUpperCase() +
            text.slice(1);

    }


    function formatDate(value) {

        if (!value) {
            return "Date unavailable";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return String(value);

        }


        return date.toLocaleDateString(
            undefined,
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }

});