document.addEventListener("DOMContentLoaded", () => {

    const problem = JSON.parse(
        localStorage.getItem("currentProblem") || "null"
    );

    if (!problem) {
        window.location.href = "new-problem.html";
        return;
    }


    /* =========================
       ELEMENTS
    ========================= */

    const problemTitle = document.getElementById("problemTitle");
    const problemType = document.getElementById("problemType");
    const problemDescription = document.getElementById("problemDescription");
    const problemStatus = document.getElementById("problemStatus");

    const consensusScore = document.getElementById("consensusScore");
    const consensusRing = document.getElementById("consensusRing");

    const conflictScore = document.getElementById("conflictScore");
    const conflictBar = document.getElementById("conflictBar");

    const tradeoffCount = document.getElementById("tradeoffCount");
    const coreDecision = document.getElementById("coreDecision");

    const dashboardBtn = document.getElementById("dashboardBtn");
    const simulationBtn = document.getElementById("simulationBtn");


    /* =========================
       LOAD PROBLEM
    ========================= */

    problemTitle.textContent =
        problem.title || "Untitled Decision";

    problemType.textContent =
        problem.type || "General";

    problemDescription.textContent =
        problem.description ||
        "No problem description available.";

    problemStatus.textContent =
        problem.status || "Conflict Analysis";

    coreDecision.textContent =
        problem.type
            ? `${problem.type} Decision`
            : "Decision Under Review";


    /* =========================
       CALCULATE ANALYSIS
    ========================= */

    const agents = [
        {
            id: "research",
            name: "Research Agent",
            focus: "Evidence"
        },
        {
            id: "budget",
            name: "Budget Agent",
            focus: "Cost"
        },
        {
            id: "risk",
            name: "Risk Agent",
            focus: "Risk"
        },
        {
            id: "planning",
            name: "Planning Agent",
            focus: "Strategy"
        },
        {
            id: "resource",
            name: "Resource Agent",
            focus: "Resources"
        },
        {
            id: "ethics",
            name: "Ethics Agent",
            focus: "Fairness"
        }
    ];


    /*
        This prototype calculates a simulated
        conflict/consensus model from the
        selected problem factors.
    */

    const factors = Array.isArray(problem.factors)
        ? problem.factors
        : [];


    let baseConsensus = 82;

    if (factors.length === 0) {
        baseConsensus = 78;
    }

    if (factors.length >= 4) {
        baseConsensus = 84;
    }

    if (problem.type === "Risk") {
        baseConsensus -= 5;
    }

    if (problem.type === "Budget") {
        baseConsensus -= 3;
    }

    if (problem.type === "Ethics") {
        baseConsensus += 2;
    }


    const finalConsensus = Math.max(
        55,
        Math.min(94, baseConsensus)
    );

    const finalConflict = 100 - finalConsensus;


    consensusScore.textContent =
        `${finalConsensus}%`;

    consensusRing.textContent =
        finalConsensus;

    conflictScore.textContent =
        `${finalConflict}%`;

    conflictBar.style.width =
        `${finalConflict}%`;


    /* =========================
       TRADE-OFF COUNT
    ========================= */

    const possibleTradeoffs = [
        "Cost vs Risk",
        "Speed vs Quality",
        "Resources vs Ambition",
        "Efficiency vs Fairness"
    ];

    let calculatedTradeoffs =
        Math.max(
            2,
            Math.min(4, factors.length || 3)
        );

    if (problem.type === "Risk") {
        calculatedTradeoffs = 4;
    }

    tradeoffCount.textContent =
        calculatedTradeoffs;


    /* =========================
       UPDATE AGENT STATES
    ========================= */

    const agentStates = {
        research: {
            state: "Evidence",
            type: "agreement"
        },

        budget: {
            state: "Cost",
            type: "tension"
        },

        risk: {
            state: "Caution",
            type: "tension"
        },

        planning: {
            state: "Strategy",
            type: "agreement"
        },

        resource: {
            state: "Capacity",
            type: "neutral"
        },

        ethics: {
            state: "Fairness",
            type: "agreement"
        }
    };


    Object.keys(agentStates).forEach(agentId => {

        const node =
            document.querySelector(
                `.map-agent[data-agent="${agentId}"]`
            );

        if (!node) return;

        const stateElement =
            node.querySelector(".agent-state");

        if (!stateElement) return;

        stateElement.textContent =
            agentStates[agentId].state;

        stateElement.classList.remove(
            "agreement-state",
            "tension-state",
            "neutral-state"
        );

        stateElement.classList.add(
            `${agentStates[agentId].type}-state`
        );

    });


    /* =========================
       AGENT NODE INTERACTION
    ========================= */

    const agentNodes =
        document.querySelectorAll(".map-agent");

    agentNodes.forEach(node => {

        node.addEventListener("click", () => {

            agentNodes.forEach(item => {
                item.classList.remove("selected-agent");
            });

            node.classList.add("selected-agent");

            const agentId =
                node.dataset.agent;

            const agent =
                agents.find(
                    item => item.id === agentId
                );

            if (!agent) return;

            showAgentInsight(agent);

        });

    });


    /* =========================
       AGENT INSIGHT
    ========================= */

    function showAgentInsight(agent) {

        const existing =
            document.querySelector(".agent-insight-popup");

        if (existing) {
            existing.remove();
        }


        const messages = {

            research:
                "Research prioritizes evidence, previous outcomes, and available information before the decision is finalized.",

            budget:
                "Budget focuses on affordability, cost limits, and whether the expected value justifies the investment.",

            risk:
                "Risk evaluates uncertainty, possible failure points, fallback plans, and potential negative outcomes.",

            planning:
                "Planning focuses on implementation order, timelines, milestones, and practical execution.",

            resource:
                "Resource checks whether people, infrastructure, tools, time, and operational capacity are available.",

            ethics:
                "Ethics considers fairness, transparency, accessibility, and the impact on affected people."
        };


        const popup =
            document.createElement("div");

        popup.className =
            "agent-insight-popup";

        popup.innerHTML = `
            <div class="insight-header">
                <div>
                    <span>AGENT INSIGHT</span>
                    <strong>${escapeHTML(agent.name)}</strong>
                </div>

                <button class="close-insight">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <p>
                ${escapeHTML(messages[agent.id])}
            </p>

            <div class="insight-focus">
                Primary Focus:
                <strong>${escapeHTML(agent.focus)}</strong>
            </div>
        `;


        document.body.appendChild(popup);


        popup
            .querySelector(".close-insight")
            .addEventListener("click", () => {
                popup.remove();
            });


        setTimeout(() => {
            popup.classList.add("show");
        }, 30);

    }


    /* =========================
       MATRIX INTERACTION
    ========================= */

    const matrixCells =
        document.querySelectorAll(
            ".conflict-matrix td:not(.self)"
        );

    matrixCells.forEach(cell => {

        cell.addEventListener("mouseenter", () => {

            const value =
                cell.textContent.trim();

            cell.setAttribute(
                "data-tooltip",
                `Alignment: ${value}`
            );

        });

    });


    /* =========================
       TRADE-OFF ANIMATION
    ========================= */

    const tradeoffRows =
        document.querySelectorAll(".tradeoff-row");

    tradeoffRows.forEach((row, index) => {

        const track =
            row.querySelector(".tradeoff-track div");

        if (!track) return;

        const originalWidth =
            track.style.width;

        track.style.width = "0%";

        setTimeout(() => {

            track.style.width =
                originalWidth;

        }, 250 + index * 180);

    });


    /* =========================
       CONNECTION ANIMATION
    ========================= */

    const connections =
        document.querySelectorAll(".connection");

    connections.forEach((connection, index) => {

        connection.style.opacity = "0";

        setTimeout(() => {

            connection.style.transition =
                "opacity 0.8s ease";

            connection.style.opacity =
                "1";

        }, 400 + index * 180);

    });


    /* =========================
       SAVE CONFLICT ANALYSIS
    ========================= */

    const conflictAnalysis = {

        consensus: finalConsensus,

        conflictIntensity: finalConflict,

        tradeoffs: calculatedTradeoffs,

        agentsCompared: agents.length,

        factors: factors,

        analyzedAt:
            new Date().toISOString(),

        conflicts: possibleTradeoffs.slice(
            0,
            calculatedTradeoffs
        )
    };


    problem.conflictAnalysis =
        conflictAnalysis;

    problem.status =
        "Conflict Map Complete";

    problem.conflictMapCompletedAt =
        new Date().toISOString();


    localStorage.setItem(
        "currentProblem",
        JSON.stringify(problem)
    );


    /* =========================
       UPDATE PROBLEM HISTORY
    ========================= */

    let problems =
        JSON.parse(
            localStorage.getItem(
                "agentCouncilProblems"
            ) || "[]"
        );


    if (Array.isArray(problems)) {

        const index =
            problems.findIndex(
                item => item.id === problem.id
            );

        if (index !== -1) {

            problems[index] = {
                ...problems[index],
                ...problem
            };

        } else {

            problems.push(problem);

        }

        localStorage.setItem(
            "agentCouncilProblems",
            JSON.stringify(problems)
        );

    }


    /* =========================
       DASHBOARD
    ========================= */

    dashboardBtn.addEventListener(
        "click",
        () => {
            window.location.href =
                "dashboard.html";
        }
    );


    /* =========================
       SIMULATION
    ========================= */

    simulationBtn.addEventListener(
        "click",
        () => {

            problem.status =
                "Ready for What-If Simulation";

            localStorage.setItem(
                "currentProblem",
                JSON.stringify(problem)
            );

            simulationBtn.innerHTML = `
                Opening Simulation
                <i class="fa-solid fa-spinner fa-spin"></i>
            `;

            setTimeout(() => {

                window.location.href =
                    "simulation.html";

            }, 700);

        }
    );


    /* =========================
       HELPER
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