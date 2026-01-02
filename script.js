const dataset = [10, 50, 100, 500, 1000, 5000, 10000];
let performanceChart = null;

// ==========================================
// ALGORITHMS
// ==========================================

function caraIteratif(n) {
    if (n === 0) return "0";
    let biner = "";
    // Note: In JS, numbers are floats. Use Math.floor for integer division.
    while (n > 0) {
        biner = (n % 2) + biner;
        n = Math.floor(n / 2);
    }
    return biner;
}

function caraRekursif(n) {
    if (n === 0) return "";
    return caraRekursif(Math.floor(n / 2)) + (n % 2);
}

// Wrapper for recursive to handle 0 case at top level matching Java parity
function runRecursiveAlgo(n) {
    if (n === 0) return "0";
    return caraRekursif(n);
}

// ==========================================
// DEMO LOGIC
// ==========================================

function runIterative() {
    const input = document.getElementById('numberInput').value;
    if (input === "") return;
    const n = parseInt(input);

    // Warmup
    for (let i = 0; i < 100; i++) caraIteratif(n);

    const start = performance.now();
    for (let i = 0; i < 1000; i++) caraIteratif(n); // Run 1000x for visibility
    const end = performance.now();
    const avgTime = (end - start) / 1000;

    const result = caraIteratif(n); // Get actual result
    document.getElementById('iterativeResult').innerText = result;
    document.getElementById('iterativeTime').innerText = `Rata-rata (1000x): ${avgTime.toFixed(6)} ms`;
}

function runRecursive() {
    const input = document.getElementById('numberInput').value;
    if (input === "") return;
    const n = parseInt(input);

    // Warmup
    for (let i = 0; i < 100; i++) runRecursiveAlgo(n);

    const start = performance.now();
    for (let i = 0; i < 1000; i++) runRecursiveAlgo(n); // Run 1000x for visibility
    const end = performance.now();
    const avgTime = (end - start) / 1000;

    const result = runRecursiveAlgo(n); // Get actual result
    document.getElementById('recursiveResult').innerText = result;
    document.getElementById('recursiveTime').innerText = `Rata-rata (1000x): ${avgTime.toFixed(6)} ms`;
}

// ==========================================
// BENCHMARK LOGIC
// ==========================================

function runBenchmark() {
    const resultsIter = [];
    const resultsRecur = [];
    const tableBody = document.querySelector('#benchmarkTable tbody');
    tableBody.innerHTML = ''; // Clear table

    // Scale iterations based on N to avoid browser hang on large N
    // but ensured enough to capture time
    const getIterations = (n) => {
        if (n < 1000) return 50000;
        if (n < 5000) return 10000;
        return 2000;
    };

    // Use setTimeout to allow UI to update (non-blocking feel)
    let index = 0;

    function processNext() {
        if (index >= dataset.length) {
            updateChart(resultsIter, resultsRecur);
            return;
        }

        const n = dataset[index];
        const iterations = getIterations(n);

        // --- Iterative ---
        // Warmup
        for (let i = 0; i < 100; i++) caraIteratif(n);

        const startIter = performance.now();
        for (let i = 0; i < iterations; i++) caraIteratif(n);
        const endIter = performance.now();
        const avgIter = (endIter - startIter) / iterations;
        resultsIter.push(avgIter);

        // --- Recursive ---
        // Warmup
        for (let i = 0; i < 100; i++) runRecursiveAlgo(n);

        const startRecur = performance.now();
        for (let i = 0; i < iterations; i++) runRecursiveAlgo(n);
        const endRecur = performance.now();
        const avgRecur = (endRecur - startRecur) / iterations;
        resultsRecur.push(avgRecur);

        // Update Table Row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${n}</td>
            <td>${avgIter.toFixed(6)}</td>
            <td>${avgRecur.toFixed(6)}</td>
        `;
        tableBody.appendChild(row);

        index++;
        setTimeout(processNext, 10); // Schedule next batch
    }

    processNext();
}

// ==========================================
// CHART VISUALIZATION
// ==========================================

function updateChart(iterData, recurData) {
    const ctx = document.getElementById('performanceChart').getContext('2d');

    if (performanceChart) {
        performanceChart.destroy();
    }

    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataset.map(n => `N=${n}`),
            datasets: [
                {
                    label: 'Iteratif',
                    data: iterData,
                    borderColor: '#4facfe', // Cyan/Blue
                    backgroundColor: 'rgba(79, 172, 254, 0.2)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Rekursif',
                    data: recurData,
                    borderColor: '#7b2ff7', // Purple
                    backgroundColor: 'rgba(123, 47, 247, 0.2)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Kompleksitas Waktu (ms)',
                    color: '#ffffff'
                },
                legend: {
                    labels: { color: '#a0a0c0' }
                }
            },
            scales: {
                y: {
                    grid: { color: '#2d3246' },
                    ticks: { color: '#a0a0c0' }
                },
                x: {
                    grid: { color: '#2d3246' },
                    ticks: { color: '#a0a0c0' }
                }
            }
        }
    });
}

// ==========================================
// UI UTILS
// ==========================================

function switchTab(lang) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.code-view').forEach(view => view.classList.remove('active'));

    // Simple index check or logic
    if (lang === 'java') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('java-code').classList.add('active');
    } else {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('js-code').classList.add('active');
    }
}

// Initialize empty chart
window.onload = function () {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataset.map(n => `N=${n}`),
            datasets: [{ label: 'Data belum ada', data: [] }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: '#2d3246' } },
                x: { grid: { color: '#2d3246' } }
            }
        }
    });
};
