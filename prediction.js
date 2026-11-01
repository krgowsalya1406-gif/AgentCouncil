document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       LOAD CURRENT PROBLEM
    ========================================================= */

    const currentProblem = JSON.parse(
        localStorage.getItem("currentProblem") || "null"
    );

    if (!currentProblem) {
        window.location.href = "new-problem.html";
        return;
    }

    /* =========================================================
       ELEMENTS
    ========================================================= */

    const problemTitle = document.getElementById("problemTitle");
    const problemType = document.getElementById("problemType");
    const problemStatus = document.getElementById("problemStatus");
    const problemDescription = document.getElementById("problemDescription");

    const predictedConfidence = document.getElementById("predictedConfidence");
    const actualConfidence = document.getElementById("actualConfidence");

    const predictedRisk = document.getElementById("predictedRisk");
    const actualRisk = document.getElementById("actualRisk");

    const predictedImpact = document.getElementById("predictedImpact");
    const actualImpact = document.getElementById("actualImpact");

    const predictedOutcome = document.getElementById("predictedOutcome");
    const actualOutcome = document.getElementById("actualOutcome");

    const predictedBar = document.getElementById("predictedBar");
    const actualBar = document.getElementById("actualBar");

    const predictionGap = document.getElementById("predictionGap");
    const gapLabel = document.getElementById("gapLabel");

    const actualConfidenceInput =
        document.getElementById("actualConfidenceInput");

    const actualRiskInput =
        document.getElementById("actualRiskInput");

    const actualImpactInput =
        document.getElementById("actualImpactInput");

    const actualConfidenceValue =
        document.getElementById("actualConfidenceValue");

    const actualRiskValue =
        document.getElementById("actualRiskValue");

    const actualImpactValue =
        document.getElementById("actualImpactValue");

    const actualOutcomeInput =
        document.getElementById("actualOutcomeInput");

    const realityNotes =
        document.getElementById("realityNotes");

    const analyzeOutcomeBtn =
        document.getElementById("analyzeOutcomeBtn");

    const learningResult =
        document.getElementById("learningResult");

    const accuracyScore =
        document.getElementById("accuracyScore");

    const accuracyBar =
        document.getElementById("accuracyBar");

    const accuracyMessage =
        document.getElementById("accuracyMessage");

    const workedInsight =
        document.getElementById("workedInsight");

    const differenceInsight =
        document.getElementById("differenceInsight");

    const futureInsight =
        document.getElementById("futureInsight");

    const dashboardBtn =
        document.getElementById("dashboardBtn");

    const historyBtn =
        document.getElementById("historyBtn");

    const toast =
        document.getElementById("toast");

    const toastTitle =
        document.getElementById("toastTitle");

    const toastMessage =
        document.getElementById("toastMessage");

    const closeToast =
        document.getElementById("closeToast");


    /* =========================================================
       DEFAULT PREDICTION
    ========================================================= */

    const simulations = JSON.parse(
        localStorage.getItem("agentCouncilSimulations") || "[]"
    );

    const relatedSimulations = simulations.filter(
        item => item.problemId === currentProblem.id
    );

    const latestSimulation =
        relatedSimulations.length > 0
            ? relatedSimulations[relatedSimulations.length - 1]
            : null;


    const predicted = {
        confidence: getSimulationValue(
            latestSimulation,
            "confidence",
            82
        ),

        risk: getSimulationValue(
            latestSimulation,
            "risk",
            30
        ),

        impact: getSimulationValue(
            latestSimulation,
            "impact",
            78
        ),

        outcome:
            latestSimulation?.outcome ||
            latestSimulation?.scenarioResult ||
            "Positive"
    };


    /* =========================================================
       INITIALIZE PROBLEM
    ========================================================= */

    problemTitle.textContent =
        currentProblem.title || "Untitled Problem";

    problemType.textContent =
        currentProblem.type || "General";

    problemStatus.textContent =
        currentProblem.status || "Learning Analysis";

    problemDescription.textContent =
        currentProblem.description ||
        "No problem description available.";


    /* =========================================================
       SHOW PREDICTED VALUES
    ========================================================= */

    predictedConfidence.textContent =
        `${predicted.confidence}%`;

    predictedRisk.textContent =
        `${predicted.risk}%`;

    predictedImpact.textContent =
        `${predicted.impact}%`;

    predictedOutcome.textContent =
        formatOutcome(predicted.outcome);

    predictedBar.style.width =
        `${predicted.confidence}%`;


    /* =========================================================
       DEFAULT ACTUAL VALUES
    ========================================================= */

    actualConfidenceInput.value = 80;
    actualRiskInput.value = 25;
    actualImpactInput.value = 80;

    updateActualValues();


    /* =========================================================
       RANGE INPUT EVENTS
    ========================================================= */

    actualConfidenceInput.addEventListener(
        "input",
        updateActualValues
    );

    actualRiskInput.addEventListener(
        "input",
        updateActualValues
    );

    actualImpactInput.addEventListener(
        "input",
        updateActualValues
    );


    function updateActualValues() {

        const confidence =
            Number(actualConfidenceInput.value);

        const risk =
            Number(actualRiskInput.value);

        const impact =
            Number(actualImpactInput.value);

        actualConfidenceValue.textContent =
            `${confidence}%`;

        actualRiskValue.textContent =
            `${risk}%`;

        actualImpactValue.textContent =
            `${impact}%`;

        actualConfidence.textContent =
            `${confidence}%`;

        actualRisk.textContent =
            `${risk}%`;

        actualImpact.textContent =
            `${impact}%`;

        actualBar.style.width =
            `${confidence}%`;

        updatePredictionGap(confidence);
    }


    /* =========================================================
       PREDICTION GAP
    ========================================================= */

    function updatePredictionGap(actualConfidenceValue) {

        const gap =
            actualConfidenceValue -
            predicted.confidence;

        const absoluteGap =
            Math.abs(gap);

        predictionGap.textContent =
            `${absoluteGap}%`;

        if (absoluteGap === 0) {

            gapLabel.textContent =
                "Prediction matched reality exactly.";

        } else if (gap > 0) {

            gapLabel.textContent =
                "Reality was more confident than the prediction.";

        } else {

            gapLabel.textContent =
                "Reality was less confident than the prediction.";
        }
    }


    /* =========================================================
       ANALYZE OUTCOME
    ========================================================= */

    analyzeOutcomeBtn.addEventListener(
        "click",
        analyzeOutcome
    );


    function analyzeOutcome() {

        const actual = {

            confidence:
                Number(actualConfidenceInput.value),

            risk:
                Number(actualRiskInput.value),

            impact:
                Number(actualImpactInput.value),

            outcome:
                actualOutcomeInput.value,

            notes:
                realityNotes.value.trim()
        };


        /* -----------------------------------------------------
           ACCURACY CALCULATION
           Prototype simulation logic
        ----------------------------------------------------- */

        const confidenceAccuracy =
            calculateAccuracy(
                predicted.confidence,
                actual.confidence
            );

        const riskAccuracy =
            calculateAccuracy(
                predicted.risk,
                actual.risk
            );

        const impactAccuracy =
            calculateAccuracy(
                predicted.impact,
                actual.impact
            );

        const overallAccuracy =
            Math.round(
                (
                    confidenceAccuracy +
                    riskAccuracy +
                    impactAccuracy
                ) / 3
            );


        /* =====================================================
           DISPLAY ACCURACY
        ===================================================== */

        accuracyScore.textContent =
            `${overallAccuracy}%`;

        accuracyBar.style.width =
            `${overallAccuracy}%`;


        if (overallAccuracy >= 90) {

            accuracyMessage.textContent =
                "The recorded outcome was very close to the council prediction.";

        } else if (overallAccuracy >= 75) {

            accuracyMessage.textContent =
                "The council prediction showed a strong match with the recorded outcome.";

        } else if (overallAccuracy >= 60) {

            accuracyMessage.textContent =
                "The outcome contained noticeable differences from the prediction.";

        } else {

            accuracyMessage.textContent =
                "The recorded outcome differed significantly from the prediction.";
        }


        /* =====================================================
           LEARNING INSIGHTS
        ===================================================== */

        const confidenceDifference =
            actual.confidence -
            predicted.confidence;

        const riskDifference =
            actual.risk -
            predicted.risk;

        const impactDifference =
            actual.impact -
            predicted.impact;


        workedInsight.textContent =
            buildWorkedInsight(
                confidenceDifference,
                riskDifference,
                impactDifference
            );


        differenceInsight.textContent =
            buildDifferenceInsight(
                confidenceDifference,
                riskDifference,
                impactDifference
            );


        futureInsight.textContent =
            buildFutureInsight(
                overallAccuracy,
                actual
            );


        /* =====================================================
           SHOW RESULT
        ===================================================== */

        learningResult.classList.add("visible");

        learningResult.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


        /* =====================================================
           SAVE LEARNING RECORD
        ===================================================== */

        const learningRecord = {

            id:
                "LEARN-" +
                Date.now().toString().slice(-8),

            problemId:
                currentProblem.id,

            problemTitle:
                currentProblem.title,

            predicted: {
                confidence: predicted.confidence,
                risk: predicted.risk,
                impact: predicted.impact,
                outcome: predicted.outcome
            },

            actual: actual,

            accuracy: overallAccuracy,

            metricAccuracy: {
                confidence:
                    confidenceAccuracy,

                risk:
                    riskAccuracy,

                impact:
                    impactAccuracy
            },

            notes:
                actual.notes,

            analyzedAt:
                new Date().toISOString(),

            analyzedDate:
                new Date().toLocaleDateString(),

            analyzedTime:
                new Date().toLocaleTimeString()
        };


        let learningHistory =
            JSON.parse(
                localStorage.getItem(
                    "agentCouncilLearning"
                ) || "[]"
            );


        learningHistory.push(learningRecord);

        if (learningHistory.length > 20) {
            learningHistory =
                learningHistory.slice(-20);
        }


        localStorage.setItem(
            "agentCouncilLearning",
            JSON.stringify(learningHistory)
        );


        /* =====================================================
           UPDATE CURRENT PROBLEM
        ===================================================== */

        currentProblem.predictionReality = {

            predicted: {
                confidence: predicted.confidence,
                risk: predicted.risk,
                impact: predicted.impact,
                outcome: predicted.outcome
            },

            actual: actual,

            accuracy:
                overallAccuracy,

            metricAccuracy: {
                confidence:
                    confidenceAccuracy,

                risk:
                    riskAccuracy,

                impact:
                    impactAccuracy
            },

            analyzedAt:
                new Date().toISOString()
        };


        currentProblem.status =
            "Prediction Learning Complete";


        localStorage.setItem(
            "currentProblem",
            JSON.stringify(currentProblem)
        );


        /* =====================================================
           UPDATE PROBLEM HISTORY
        ===================================================== */

        let problems =
            JSON.parse(
                localStorage.getItem(
                    "agentCouncilProblems"
                ) || "[]"
            );


        problems =
            problems.map(problem => {

                if (
                    problem.id ===
                    currentProblem.id
                ) {
                    return currentProblem;
                }

                return problem;
            });


        localStorage.setItem(
            "agentCouncilProblems",
            JSON.stringify(problems)
        );


        showToast(
            "Learning Updated",
            "Prediction vs reality has been recorded in Decision Memory."
        );
    }


    /* =========================================================
       HELPER FUNCTIONS
    ========================================================= */

    function calculateAccuracy(
        predictedValue,
        actualValue
    ) {

        const difference =
            Math.abs(
                predictedValue -
                actualValue
            );

        return Math.max(
            0,
            Math.round(100 - difference)
        );
    }


    function getSimulationValue(
        simulation,
        key,
        fallback
    ) {

        if (!simulation) {
            return fallback;
        }

        if (
            simulation[key] !== undefined &&
            simulation[key] !== null
        ) {
            return Number(simulation[key]);
        }

        if (
            simulation.results &&
            simulation.results[key] !== undefined
        ) {
            return Number(
                simulation.results[key]
            );
        }

        return fallback;
    }


    function formatOutcome(value) {

        if (!value) {
            return "Positive";
        }

        const text =
            String(value)
                .replace(/[-_]/g, " ")
                .trim();

        return text.charAt(0).toUpperCase() +
            text.slice(1);
    }


    function buildWorkedInsight(
        confidenceDifference,
        riskDifference,
        impactDifference
    ) {

        const confidenceText =
            confidenceDifference >= 0
                ? "actual confidence was higher than predicted"
                : "actual confidence was lower than predicted";

        const riskText =
            riskDifference > 0
                ? "risk increased"
                : riskDifference < 0
                    ? "risk decreased"
                    : "risk remained close to the prediction";

        const impactText =
            impactDifference >= 0
                ? "the observed impact met or exceeded the prediction"
                : "the observed impact was below the prediction";

        return `${confidenceText}; ${riskText}; and ${impactText}.`;
    }


    function buildDifferenceInsight(
        confidenceDifference,
        riskDifference,
        impactDifference
    ) {

        const differences = [
            {
                name: "confidence",
                value: Math.abs(confidenceDifference)
            },
            {
                name: "risk",
                value: Math.abs(riskDifference)
            },
            {
                name: "impact",
                value: Math.abs(impactDifference)
            }
        ];


        differences.sort(
            (a, b) => b.value - a.value
        );


        const largest =
            differences[0];


        if (largest.value === 0) {

            return "No measurable difference was recorded across the three main prediction metrics.";

        }


        return `The largest difference appeared in ${largest.name}, with a ${largest.value}% gap between the predicted and recorded value.`;
    }


    function buildFutureInsight(
        accuracy,
        actual
    ) {

        if (accuracy >= 90) {

            return "Future scenarios can continue using similar assumptions because the recorded outcome closely matched the prediction.";

        }

        if (accuracy >= 75) {

            return "Future scenarios can retain the current model assumptions while giving additional attention to the metrics that changed.";

        }

        if (accuracy >= 60) {

            return "Future scenarios should reconsider the assumptions behind confidence, risk, and impact before generating another prediction.";

        }

        return "Future scenarios should use the recorded outcome as a new learning signal and reconsider the assumptions that produced the original prediction.";
    }


    /* =========================================================
       DASHBOARD
    ========================================================= */

    dashboardBtn.addEventListener(
        "click",
        () => {
            window.location.href =
                "dashboard.html";
        }
    );


    /* =========================================================
       DECISION HISTORY
    ========================================================= */

    historyBtn.addEventListener(
        "click",
        () => {

            currentProblem.status =
                "Prediction Learning Complete";

            localStorage.setItem(
                "currentProblem",
                JSON.stringify(currentProblem)
            );

            localStorage.setItem(
                "decisionFlowStage",
                "decision-history"
            );

            window.location.href =
                "decision-history.html";
        }
    );


    /* =========================================================
       TOAST
    ========================================================= */

    closeToast.addEventListener(
        "click",
        () => {
            toast.classList.remove("show");
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

        toast.classList.add("show");

        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 4500);
    }

});