
const dataset = [0, 10, 50, 100, 500, 1000, 5000, 10000];
let performanceChart = null;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));


function caraIteratif(n) {
    if (n === 0) return "0";
    let biner = "";
    while (n > 0) {
        biner = (n % 2) + biner;
        n = Math.floor(n / 2);
    }
    return biner;
}

function runRecursiveAlgo(n) {
    if (n === 0) return "0";

    function recurse(num) {
        if (num === 0) return "";
        return recurse(Math.floor(num / 2)) + (num % 2);
    }
    return recurse(n);
}

async function runIterativeVisual(n) {
    const logContainer = document.getElementById('iterativeSteps');
    const resultBox = document.getElementById('iterativeResult');
    logContainer.innerHTML = '';
    resultBox.innerText = '...';

    if (n === 0) {
        resultBox.innerText = "0";
        return;
    }

    let biner = "";
    let current = n;
    let step = 1;

    while (current > 0) {
        const sisa = current % 2;
        const next = Math.floor(current / 2);

        const div = document.createElement('div');
        div.className = 'border-b border-slate-800 pb-1 mb-1 animate-pulse';
        div.innerHTML = `<span class="text-accentBlue">Step ${step}:</span> ${current} / 2 = ${next} sisa <b class="text-accentCyan">${sisa}</b>`;

        logContainer.appendChild(div);
        logContainer.scrollTop = logContainer.scrollHeight;

        biner = sisa + biner;
        resultBox.innerText = biner;

        current = next;
        step++;

        await sleep(600);
        div.classList.remove('animate-pulse');
    }

    const doneDiv = document.createElement('div');
    doneDiv.className = 'text-emerald-400 mt-2 font-bold';
    doneDiv.innerText = `>> Selesai! Hasil: ${biner}`;
    logContainer.appendChild(doneDiv);
    logContainer.scrollTop = logContainer.scrollHeight;
}

async function runRecursiveVisual(n, depth = 0) {
    const logContainer = document.getElementById('recursiveSteps');

    if (depth === 0) {
        logContainer.innerHTML = '';
        document.getElementById('recursiveResult').innerText = '...';
    }

    // --- FASE CALL (PUSH) ---
    const indent = depth * 12; // Indentasi visual
    let callDiv = document.createElement('div');
    callDiv.className = 'mb-1 text-slate-300';
    callDiv.style.paddingLeft = `${indent}px`;
    callDiv.innerHTML = `→ Call: f(${n})`;
    logContainer.appendChild(callDiv);
    logContainer.scrollTop = logContainer.scrollHeight;

    await sleep(400);

    // Base Case
    if (n === 0) {
        let baseDiv = document.createElement('div');
        baseDiv.className = 'mb-1 text-accentPurple font-bold';
        baseDiv.style.paddingLeft = `${indent}px`;
        baseDiv.innerText = `← Base Case: return ""`;
        logContainer.appendChild(baseDiv);
        return "";
    }

    // Rekursi
    const hasilRekursi = await runRecursiveVisual(Math.floor(n / 2), depth + 1);
    const sisa = n % 2;

    // --- FASE RETURN (POP) ---
    const result = hasilRekursi + sisa;

    let returnDiv = document.createElement('div');
    returnDiv.className = 'mb-1 text-emerald-400';
    returnDiv.style.paddingLeft = `${indent}px`;
    returnDiv.innerHTML = `← Return: "${hasilRekursi}" + ${sisa} = <b>"${result}"</b>`;
    logContainer.appendChild(returnDiv);
    logContainer.scrollTop = logContainer.scrollHeight;

    await sleep(400);

    if (depth === 0) {
        document.getElementById('recursiveResult').innerText = result;
        const doneDiv = document.createElement('div');
        doneDiv.className = 'text-emerald-400 mt-2 font-bold border-t border-slate-700 pt-1';
        doneDiv.innerText = `>> Stack Empty. Hasil Final: ${result}`;
        logContainer.appendChild(doneDiv);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    return result;
}

function runIterative() {
    const input = document.getElementById('numberInput').value;
    const isVisual = document.getElementById('visualMode').checked;

    if (input === "") return;
    const n = parseInt(input);

    if (isVisual) {
        runIterativeVisual(n);
    } else {
        const start = performance.now();
        for (let i = 0; i < 1000; i++) caraIteratif(n);
        const end = performance.now();

        document.getElementById('iterativeResult').innerText = caraIteratif(n);
        document.getElementById('iterativeTime').innerText = `${((end - start)).toFixed(5)} ms`;
        document.getElementById('iterativeSteps').innerHTML = '<div class="text-slate-500">Log visual dimatikan pada mode cepat.</div>';
    }
}

function runRecursive() {
    const input = document.getElementById('numberInput').value;
    const isVisual = document.getElementById('visualMode').checked;

    if (input === "") return;
    const n = parseInt(input);

    if (isVisual) {
        runRecursiveVisual(n);
    } else {
        const start = performance.now();
        for (let i = 0; i < 1000; i++) runRecursiveAlgo(n);
        const end = performance.now();

        document.getElementById('recursiveResult').innerText = runRecursiveAlgo(n);
        document.getElementById('recursiveTime').innerText = `${((end - start)).toFixed(5)} ms`;
        document.getElementById('recursiveSteps').innerHTML = '<div class="text-slate-500">Log visual dimatikan pada mode cepat.</div>';
    }
}

function runBenchmark() {
    const resultsIter = [];
    const resultsRecur = [];
    const tableBody = document.querySelector('#benchmarkTable tbody');
    tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-accentCyan animate-pulse">Running Benchmark...</td></tr>';

    // Non-blocking loop simulation
    let index = 0;
    const getIterations = (n) => n < 1000 ? 50000 : (n < 5000 ? 10000 : 2000);

    function processNext() {
        if (index >= dataset.length) {
            updateChart(resultsIter, resultsRecur);
            updateTable(resultsIter, resultsRecur);
            return;
        }

        const n = dataset[index];
        const iterations = getIterations(n);

        // Iterative
        const s1 = performance.now();
        for (let i = 0; i < iterations; i++) caraIteratif(n);
        const e1 = performance.now();
        resultsIter.push((e1 - s1) / iterations);

        // Recursive
        const s2 = performance.now();
        for (let i = 0; i < iterations; i++) runRecursiveAlgo(n);
        const e2 = performance.now();
        resultsRecur.push((e2 - s2) / iterations);

        index++;
        setTimeout(processNext, 10);
    }
    processNext();
}

function updateTable(iter, recur) {
    const tbody = document.querySelector('#benchmarkTable tbody');
    tbody.innerHTML = '';
    dataset.forEach((n, i) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-800 hover:bg-slate-800/50 transition-colors';
        tr.innerHTML = `
                    <td class="p-3 text-white font-bold">${n}</td>
                    <td class="p-3 text-white">${iter[i].toFixed(6)}</td>
                    <td class="p-3 text-gray-400">${recur[i].toFixed(6)}</td>
                `;
        tbody.appendChild(tr);
    });
}

function updateChart(iterData, recurData) {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    if (performanceChart) performanceChart.destroy();

    // Chart Global Defaults
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = '#334155';

    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataset.map(n => `N=${n}`),
            datasets: [
                {
                    label: 'Iteratif',
                    data: iterData,
                    borderColor: '#4facfe',
                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Rekursif',
                    data: recurData,
                    borderColor: '#7b2ff7',
                    backgroundColor: 'rgba(123, 47, 247, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Kompleksitas Waktu (ms)', color: '#fff' }
            },
            scales: {
                y: { grid: { color: '#1e293b' } },
                x: { grid: { color: '#1e293b' } }
            }
        }
    });
}

// Init Empty Chart
window.onload = function () {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    Chart.defaults.color = '#64748b';
    Chart.defaults.borderColor = '#1e293b';
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataset.map(n => `N=${n}`),
            datasets: [{ label: 'Menunggu Data...', data: [] }]
        },
        options: {
            scales: { y: { grid: { color: '#1e293b' } }, x: { grid: { color: '#1e293b' } } }
        }
    });
};


document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    const links = document.querySelectorAll('.mobile-link');

    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

        // Close menu when link clicked
        links.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        });
    }
});
