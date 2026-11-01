/* =========================================================
   AGENTCOUNCIL — WHAT-IF SIMULATION
   simulation.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const currentProblem = JSON.parse(
        localStorage.getItem("currentProblem") || "null"
    );

    if (!currentProblem) {
        window.location.href = "new-problem.html";
        return;
    }

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const problemTitle = document.getElementById("problemTitle");
    const problemType = document.getElementById("problemType");
    const problemDescription = document.getElementById("problemDescription");

    const dashboardBtn = document.getElementById("dashboardBtn");
    const runSimulationBtn = document.getElementById("runSimulationBtn");
    const resetSimulationBtn = document.getElementById("resetSimulationBtn");
    const memoryBtn = document.getElementById("memoryBtn");

    const budgetSlider = document.getElementById("budgetSlider");
    const timeSlider = document.getElementById("timeSlider");
    const resourceSlider = document.getElementById("resourceSlider");
    const riskSlider = document.getElementById("riskSlider");
    const qualitySlider = document.getElementById("qualitySlider");

    const budgetValue = document.getElementById("budgetValue");
    const timeValue = document.getElementById("timeValue");
    const resourceValue = document.getElementById("resourceValue");
    const riskValue = document.getElementById("riskValue");
    const qualityValue = document.getElementById("qualityValue");

    const simulationTitle = document.getElementById("simulationTitle");
    const simulationState = document.getElementById("simulationState");

    const confidenceScore = document.getElementById("confidenceScore");
    const riskScore = document.getElementById("riskScore");
    const impactScore = document.getElementById("impactScore");
    const alignmentScore = document.getElementById("alignmentScore");

    const confidenceBar = document.getElementById("confidenceBar");
    const riskResultBar = document.getElementById("riskResultBar");
    const impactBar = document.getElementById("impactBar");
    const alignmentBar = document.getElementById("alignmentBar");

    const scenarioChange = document.getElementById("scenarioChange");

    const baselineConfidence =
        document.getElementById("baselineConfidence");

    const simulatedConfidence =
        document.getElementById("simulatedConfidence");

    const baselineRisk =
        document.getElementById("baselineRisk");

    const simulatedRisk =
        document.getElementById("simulatedRisk");

    const baselineImpact =
        document.getElementById("baselineImpact");

    const simulatedImpact =
        document.getElementById("simulatedImpact");

    const confidenceDifference =
        document.getElementById("confidenceDifference");

    const riskDifference =
        document.getElementById("riskDifference");

    const impactDifference =
        document.getElementById("impactDifference");

    const councilResponse =
        document.getElementById("councilResponse");

    const outcomeTitle =
        document.getElementById("outcomeTitle");

    const outcomeDescription =
        document.getElementById("outcomeDescription");

    const simulationHistory =
        document.getElementById("simulationHistory");


    /* =====================================================
       DISPLAY CURRENT PROBLEM
       ===================================================== */

    problemTitle.textContent =
        currentProblem.title || "Untitled Decision";

    problemType.textContent =
        currentProblem.type || "General";

    problemDescription.textContent =
        currentProblem.description ||
        "No problem description available.";


    /* =====================================================
       BASELINE VALUES
       ===================================================== */

    const BASELINE = {
        budget: 70,
        time: 60,
        resource: 75,
        risk: 30,
        quality: 80
    };

    const BASELINE_RESULT = {
        confidence: 82,
        risk: 30,
        impact: 78,
        alignment: 84
    };


    /* =====================================================
       UPDATE SLIDER LABELS
       ===================================================== */

    function updateSliderLabels() {

        budgetValue.textContent =
            `${budgetSlider.value}%`;

        timeValue.textContent =
            `${timeSlider.value}%`;

        resourceValue.textContent =
            `${resourceSlider.value}%`;

        riskValue.textContent =
            `${riskSlider.value}%`;

        qualityValue.textContent =
            `${qualitySlider.value}%`;
    }


    /* =====================================================
       SLIDER EVENTS
       ===================================================== */

    [
        budgetSlider,
        timeSlider,
        resourceSlider,
        riskSlider,
        qualitySlider
    ].forEach(slider => {

        slider.addEventListener("input", updateSliderLabels);

    });


    /* =====================================================
       SET PROGRESS BAR
       ===================================================== */

    function setWidth(element, value) {

        if (!element) return;

        const safeValue = Math.max(
            0,
            Math.min(100, Number(value))
        );

        element.style.width = `${safeValue}%`;
    }


    /* =====================================================
       ANIMATED NUMBER
       ===================================================== */

    function animateNumber(element, target) {

        if (!element) return;

        const start = parseInt(
            element.textContent.replace("%", "")
        ) || 0;

        const end = Number(target);

        const duration = 650;

        const startTime = performance.now();

        function animate(currentTime) {

            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const eased =
                1 - Math.pow(1 - progress, 3);

            const value = Math.round(
                start + (end - start) * eased
            );

            element.textContent = `${value}%`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }


    /* =====================================================
       CALCULATE SIMULATION
       ===================================================== */

    function calculateSimulation() {

        const budget = Number(budgetSlider.value);
        const time = Number(timeSlider.value);
        const resources = Number(resourceSlider.value);
        const risk = Number(riskSlider.value);
        const quality = Number(qualitySlider.value);

        /*
         * Front-end prototype calculation.
         * These values simulate how a council could react
         * to changed decision conditions.
         */

        const resourceSupport =
            (budget * 0.20) +
            (time * 0.15) +
            (resources * 0.20) +
            (quality * 0.15);

        const pressure =
            (100 - budget) * 0.15 +
            (100 - time) * 0.12 +
            (100 - resources) * 0.15 +
            risk * 0.35;

        let confidence =
            50 +
            resourceSupport * 0.32 -
            pressure * 0.38;

        let impact =
            35 +
            budget * 0.12 +
            resources * 0.14 +
            quality * 0.34 -
            risk * 0.18;

        let alignment =
            90 -
            Math.abs(70 - budget) * 0.08 -
            Math.abs(60 - time) * 0.08 -
            Math.abs(75 - resources) * 0.07 -
            Math.abs(30 - risk) * 0.12;

        confidence = Math.round(
            Math.max(15, Math.min(98, confidence))
        );

        impact = Math.round(
            Math.max(15, Math.min(98, impact))
        );

        alignment = Math.round(
            Math.max(20, Math.min(98, alignment))
        );

        const finalRisk =
            Math.round(
                Math.max(
                    5,
                    Math.min(
                        98,
                        risk * 0.68 +
                        (100 - resources) * 0.12 +
                        (100 - time) * 0.10 +
                        (100 - budget) * 0.10
                    )
                )
            );

        return {
            budget,
            time,
            resources,
            risk,
            quality,
            confidence,
            impact,
            alignment,
            riskExposure: finalRisk
        };
    }


    /* =====================================================
       DIFFERENCE FORMAT
       ===================================================== */

    function formatDifference(value) {

        const number = Number(value);

        if (number > 0) {
            return `+${number}%`;
        }

        if (number < 0) {
            return `${number}%`;
        }

        return "0%";
    }


    /* =====================================================
       CHANGE SUMMARY
       ===================================================== */

    function getScenarioChange(result) {

        const changed = [];

        if (result.budget !== BASELINE.budget) {
            changed.push("Budget");
        }

        if (result.time !== BASELINE.time) {
            changed.push("Time");
        }

        if (result.resources !== BASELINE.resource) {
            changed.push("Resources");
        }

        if (result.risk !== BASELINE.risk) {
            changed.push("Risk");
        }

        if (result.quality !== BASELINE.quality) {
            changed.push("Quality");
        }

        if (changed.length === 0) {
            return "No changes yet";
        }

        return `${changed.length} variable${
            changed.length > 1 ? "s" : ""
        } changed`;
    }


    /* =====================================================
       COUNCIL RESPONSE
       ===================================================== */

    function generateCouncilResponse(result) {

        const changes = [];

        if (result.budget < BASELINE.budget) {
            changes.push(
                "Budget pressure increased"
            );
        }

        if (result.budget > BASELINE.budget) {
            changes.push(
                "Additional budget provides more flexibility"
            );
        }

        if (result.time < BASELINE.time) {
            changes.push(
                "The shorter timeline increases execution pressure"
            );
        }

        if (result.time > BASELINE.time) {
            changes.push(
                "Additional time reduces scheduling pressure"
            );
        }

        if (result.resources < BASELINE.resource) {
            changes.push(
                "Lower resource availability creates implementation constraints"
            );
        }

        if (result.resources > BASELINE.resource) {
            changes.push(
                "Additional resources improve execution capacity"
            );
        }

        if (result.risk > BASELINE.risk) {
            changes.push(
                "Higher risk requires stronger fallback planning"
            );
        }

        if (result.risk < BASELINE.risk) {
            changes.push(
                "Lower risk improves decision stability"
            );
        }

        if (result.quality > BASELINE.quality) {
            changes.push(
                "Higher expected quality increases potential impact"
            );
        }

        if (changes.length === 0) {

            return (
                "The Council sees conditions close to the baseline. " +
                "The current decision landscape remains relatively stable."
            );
        }

        return (
            "The Council simulated the changed assumptions. " +
            changes.slice(0, 3).join(". ") +
            ". The combined effect is reflected in the updated confidence, risk, impact, and agent alignment scores."
        );
    }


    /* =====================================================
       OUTCOME
       ===================================================== */

    function generateOutcome(result) {

        if (
            result.confidence >= 80 &&
            result.impact >= 75 &&
            result.riskExposure <= 35
        ) {

            return {
                title: "Strong scenario conditions",
                description:
                    "The simulated conditions support a relatively stable decision with strong expected impact and manageable risk."
            };
        }

        if (
            result.confidence >= 65 &&
            result.riskExposure <= 50
        ) {

            return {
                title: "Decision remains feasible",
                description:
                    "The scenario introduces some pressure, but the decision remains reasonably balanced if the identified constraints are managed."
            };
        }

        if (
            result.riskExposure > 70 ||
            result.confidence < 45
        ) {

            return {
                title: "High decision pressure detected",
                description:
                    "The changed conditions create significant uncertainty. Additional planning, resources, or risk controls should be considered before proceeding."
            };
        }

        return {
            title: "Moderate scenario pressure",
            description:
                "The Council identifies meaningful trade-offs. The decision can continue, but the changed assumptions should be monitored."
        };
    }


    /* =====================================================
       RUN SIMULATION
       ===================================================== */

    function runSimulation() {

        const result = calculateSimulation();

        simulationState.textContent = "SIMULATING";

        simulationState.style.color = "var(--yellow)";
        simulationState.style.background =
            "rgba(245,158,11,0.08)";

        simulationState.style.borderColor =
            "rgba(245,158,11,0.18)";

        runSimulationBtn.disabled = true;

        simulationTitle.textContent =
            "Council is simulating the scenario...";

        councilResponse.textContent =
            "Agents are recalculating the decision landscape based on the changed assumptions...";

        setTimeout(() => {

            animateNumber(
                confidenceScore,
                result.confidence
            );

            animateNumber(
                riskScore,
                result.riskExposure
            );

            animateNumber(
                impactScore,
                result.impact
            );

            animateNumber(
                alignmentScore,
                result.alignment
            );

            setWidth(
                confidenceBar,
                result.confidence
            );

            setWidth(
                riskResultBar,
                result.riskExposure
            );

            setWidth(
                impactBar,
                result.impact
            );

            setWidth(
                alignmentBar,
                result.alignment
            );


            /* Comparison */

            setWidth(
                baselineConfidence,
                BASELINE_RESULT.confidence
            );

            setWidth(
                simulatedConfidence,
                result.confidence
            );

            setWidth(
                baselineRisk,
                BASELINE_RESULT.risk
            );

            setWidth(
                simulatedRisk,
                result.riskExposure
            );

            setWidth(
                baselineImpact,
                BASELINE_RESULT.impact
            );

            setWidth(
                simulatedImpact,
                result.impact
            );


            const confidenceDiff =
                result.confidence -
                BASELINE_RESULT.confidence;

            const riskDiff =
                result.riskExposure -
                BASELINE_RESULT.risk;

            const impactDiff =
                result.impact -
                BASELINE_RESULT.impact;


            confidenceDifference.textContent =
                formatDifference(confidenceDiff);

            riskDifference.textContent =
                formatDifference(riskDiff);

            impactDifference.textContent =
                formatDifference(impactDiff);


            scenarioChange.textContent =
                getScenarioChange(result);


            simulationTitle.textContent =
                "Simulated Scenario";

            simulationState.textContent =
                "COMPLETE";

            simulationState.style.color =
                "var(--green)";

            simulationState.style.background =
                "rgba(34,197,94,0.08)";

            simulationState.style.borderColor =
                "rgba(34,197,94,0.18)";


            councilResponse.textContent =
                generateCouncilResponse(result);


            const outcome =
                generateOutcome(result);

            outcomeTitle.textContent =
                outcome.title;

            outcomeDescription.textContent =
                outcome.description;


            runSimulationBtn.disabled = false;


            saveSimulation(result);

            renderHistory();

        }, 900);
    }


    /* =====================================================
       SAVE SIMULATION
       ===================================================== */

    function saveSimulation(result) {

        const history =
            JSON.parse(
                localStorage.getItem(
                    "agentCouncilSimulations"
                ) || "[]"
            );

        const simulation = {

            id:
                "SIM-" +
                Date.now()
                    .toString()
                    .slice(-8),

            problemId:
                currentProblem.id || null,

            problemTitle:
                currentProblem.title || "Untitled Decision",

            createdAt:
                new Date().toISOString(),

            scenario: {
                budget: result.budget,
                time: result.time,
                resources: result.resources,
                risk: result.risk,
                quality: result.quality
            },

            results: {
                confidence: result.confidence,
                risk: result.riskExposure,
                impact: result.impact,
                alignment: result.alignment
            }

        };

        history.unshift(simulation);

        localStorage.setItem(
            "agentCouncilSimulations",
            JSON.stringify(history.slice(0, 10))
        );


        /* Save to current problem */

        currentProblem.lastSimulation =
            simulation;

        currentProblem.status =
            "What-If Simulation Complete";

        localStorage.setItem(
            "currentProblem",
            JSON.stringify(currentProblem)
        );


        /* Update problems list */

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

            problems[index] =
                currentProblem;

            localStorage.setItem(
                "agentCouncilProblems",
                JSON.stringify(problems)
            );
        }
    }


    /* =====================================================
       RENDER HISTORY
       ===================================================== */

    function renderHistory() {

        if (!simulationHistory) return;

        const history =
            JSON.parse(
                localStorage.getItem(
                    "agentCouncilSimulations"
                ) || "[]"
            );

        const problemHistory =
            history.filter(
                item =>
                    !currentProblem.id ||
                    item.problemId === currentProblem.id
            );

        if (problemHistory.length === 0) {

            simulationHistory.innerHTML = `
                <div class="empty-history">
                    <i class="fa-solid fa-flask"></i>
                    <span>No simulations have been run yet.</span>
                </div>
            `;

            return;
        }


        simulationHistory.innerHTML =
            problemHistory
                .slice(0, 5)
                .map(item => {

                    const date =
                        new Date(
                            item.createdAt
                        );

                    const formattedDate =
                        date.toLocaleDateString();

                    const formattedTime =
                        date.toLocaleTimeString(
                            [],
                            {
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        );

                    return `
                        <div class="history-item">

                            <div class="history-icon">
                                <i class="fa-solid fa-flask"></i>
                            </div>

                            <div>
                                <h4>
                                    What-If Scenario
                                </h4>

                                <p>
                                    ${formattedDate}
                                    ·
                                    ${formattedTime}
                                    ·
                                    Budget ${item.scenario.budget}%
                                    ·
                                    Risk ${item.scenario.risk}%
                                </p>
                            </div>

                            <div class="history-score">
                                ${item.results.confidence}%
                                Confidence
                            </div>

                        </div>
                    `;

                })
                .join("");
    }


    /* =====================================================
       RESET
       ===================================================== */

    function resetSimulation() {

        budgetSlider.value =
            BASELINE.budget;

        timeSlider.value =
            BASELINE.time;

        resourceSlider.value =
            BASELINE.resource;

        riskSlider.value =
            BASELINE.risk;

        qualitySlider.value =
            BASELINE.quality;


        updateSliderLabels();


        simulationTitle.textContent =
            "Baseline Scenario";

        simulationState.textContent =
            "READY";

        simulationState.style.color =
            "var(--green)";

        simulationState.style.background =
            "rgba(34,197,94,0.08)";

        simulationState.style.borderColor =
            "rgba(34,197,94,0.18)";


        confidenceScore.textContent =
            `${BASELINE_RESULT.confidence}%`;

        riskScore.textContent =
            `${BASELINE_RESULT.risk}%`;

        impactScore.textContent =
            `${BASELINE_RESULT.impact}%`;

        alignmentScore.textContent =
            `${BASELINE_RESULT.alignment}%`;


        setWidth(
            confidenceBar,
            BASELINE_RESULT.confidence
        );

        setWidth(
            riskResultBar,
            BASELINE_RESULT.risk
        );

        setWidth(
            impactBar,
            BASELINE_RESULT.impact
        );

        setWidth(
            alignmentBar,
            BASELINE_RESULT.alignment
        );


        setWidth(
            baselineConfidence,
            BASELINE_RESULT.confidence
        );

        setWidth(
            simulatedConfidence,
            BASELINE_RESULT.confidence
        );

        setWidth(
            baselineRisk,
            BASELINE_RESULT.risk
        );

        setWidth(
            simulatedRisk,
            BASELINE_RESULT.risk
        );

        setWidth(
            baselineImpact,
            BASELINE_RESULT.impact
        );

        setWidth(
            simulatedImpact,
            BASELINE_RESULT.impact
        );


        confidenceDifference.textContent =
            "—";

        riskDifference.textContent =
            "—";

        impactDifference.textContent =
            "—";

        scenarioChange.textContent =
            "No changes yet";


        councilResponse.textContent =
            "Adjust the scenario variables and run the simulation to see how the Council's decision landscape changes.";


        outcomeTitle.textContent =
            "Baseline conditions are stable";

        outcomeDescription.textContent =
            "The current scenario does not introduce significant decision pressure.";
    }


    /* =====================================================
       NAVIGATION
       ===================================================== */

    dashboardBtn.addEventListener(
        "click",
        () => {
            window.location.href =
                "dashboard.html";
        }
    );


    memoryBtn.addEventListener(
        "click",
        () => {

            currentProblem.status =
                "Ready for Decision Memory";

            localStorage.setItem(
                "currentProblem",
                JSON.stringify(currentProblem)
            );

            window.location.href =
                "decision-memory.html";
        }
    );


    runSimulationBtn.addEventListener(
        "click",
        runSimulation
    );


    resetSimulationBtn.addEventListener(
        "click",
        resetSimulation
    );


    /* =====================================================
       INITIALIZE
       ===================================================== */

    updateSliderLabels();

    resetSimulation();

    renderHistory();

});