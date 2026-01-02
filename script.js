// iteratif
function caraIteratif(n) {
    if (n === 0) return "0";

    // Pisahkan Integer dan Pecahan
    let integerPart = Math.floor(n);
    let fractionalPart = n - integerPart;

    // A. Proses Bagian Bulat (Divide by 2)
    let binerInt = "";
    if (integerPart === 0) {
        binerInt = "0";
    } else {
        while (integerPart > 0) {
            binerInt = (integerPart % 2) + binerInt;
            integerPart = Math.floor(integerPart / 2);
        }
    }

    // B. Proses Bagian Pecahan (Multiply by 2)
    // batas aman (64 bit)
    let binerFrac = "";
    if (fractionalPart > 0) {
        binerFrac = ".";
        let limit = 0;
        while (fractionalPart > 0 && limit < 64) {
            fractionalPart *= 2;
            if (fractionalPart >= 1) {
                binerFrac += "1";
                fractionalPart -= 1;
            } else {
                binerFrac += "0";
            }
            limit++;
        }
    }

    return binerInt + binerFrac;
}

// rekursif

// Helper Rekursif: Bagian Bulat
function integerRecursive(n) {
    if (n === 0) return "";
    return integerRecursive(Math.floor(n / 2)) + (n % 2);
}

// Helper Rekursif: Bagian Pecahan
function fractionRecursive(frac, limit) {
    // Base Case: Pecahan habis ATAU limit tercapai
    if (frac === 0 || limit >= 64) return "";

    let val = frac * 2;
    let bit = (val >= 1) ? 1 : 0;
    // Recursive Call
    let nextFrac = (val >= 1) ? val - 1 : val;
    return bit + fractionRecursive(nextFrac, limit + 1);
}

//Fungsi Utama Rekursif
function runRecursiveAlgo(n) {
    if (n === 0) return "0";

    const integerPart = Math.floor(n);
    const fractionalPart = n - integerPart;

    const intRes = (integerPart === 0) ? "0" : integerRecursive(integerPart);
    const fracRes = (fractionalPart > 0) ? "." + fractionRecursive(fractionalPart, 0) : "";

    return intRes + fracRes;
}

//bagian ui

const dataset = [0, 10, 50, 100, 500, 1000, 5000, 10000];
let performanceChart = null;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// --- State Variables for Comparison ---
let lastIterativeTime = null;
let lastRecursiveTime = null;
let currentInput = null;

// Convert ms to nanoseconds (1 ms = 1,000,000 ns)
function formatTime(ms) {
    const ns = ms * 1e6;
    return ns.toLocaleString('id-ID', { maximumFractionDigits: 0 }) + " ns";
}


function measureTime(fn, arg) {
    const BATCHES = 5;
    const MIN_DURATION = 50;
    const results = [];

    let startWarm = performance.now();
    while (performance.now() - startWarm < 10) { fn(arg); }

    for (let i = 0; i < BATCHES; i++) {
        let start = performance.now();
        let count = 0;

        while ((performance.now() - start) < MIN_DURATION) {
            fn(arg);
            count++;
        }

        let end = performance.now();
        results.push((end - start) / count);
    }

    return Math.min(...results);
}

function updateCaseIndicator(type, n) {
    const el = document.getElementById(type + 'Case');
    el.classList.remove('hidden', 'bg-emerald-500/10', 'text-emerald-500', 'border-emerald-500/20',
        'bg-indigo-500/10', 'text-indigo-400', 'border-indigo-500/20');

    if (n === 0) {
        // Best Case: Tidak ada pembagian sama sekali
        el.innerHTML = '<b>Best Case (O(1))</b><br><span class="opacity-75 font-normal">Input 0 selesai instan</span>';
        el.classList.add('bg-emerald-500/10', 'text-emerald-500', 'border-emerald-500/20');
    } else {
        // Average/Worst Case: Butuh log2(n) langkah
        const steps = Math.floor(Math.log2(n || 1)) + 1;
        el.innerHTML = `<b>Worst/Avg Case (O(log N))</b><br><span class="opacity-75 font-normal">±${steps} langkah pembagian.</span>`;
        el.classList.add('bg-indigo-500/10', 'text-indigo-400', 'border-indigo-500/20');
    }
}

function updateComparisonUI(inputVal) {
    const compBox = document.getElementById('demoComparison');

    if (currentInput !== inputVal) {
        lastIterativeTime = null;
        lastRecursiveTime = null;
        currentInput = inputVal;
        compBox.classList.add('hidden');
        return;
    }

    if (lastIterativeTime !== null && lastRecursiveTime !== null) {
        compBox.classList.remove('hidden');

        let diff = Math.abs(lastIterativeTime - lastRecursiveTime);
        let msg = "";

        if (diff < 0.00000001) {
            msg = `<span class="text-white font-bold">Imbang!</span> Kedua algoritma memiliki kecepatan yang sama.`;
        } else if (lastIterativeTime < lastRecursiveTime) {
            msg = `<span class="text-accentBlue font-bold">Iteratif</span> lebih cepat <span class="text-emerald-400 font-mono">${formatTime(diff)}</span> dibandingkan Rekursif.`;
        } else {
            msg = `<span class="text-accentPurple font-bold">Rekursif</span> lebih cepat <span class="text-emerald-400 font-mono">${formatTime(diff)}</span> dibandingkan Iteratif.`;
        }

        compBox.innerHTML = `<p class="text-slate-300 text-lg">${msg}</p>`;
    }
}


// Handler Tombol "Jalankan Proses" (Iteratif)
async function runIterative() {
    const input = document.getElementById('numberInput').value;
    const isVisual = document.getElementById('visualMode').checked;

    if (input === "") return;
    const n = parseFloat(input);

    updateCaseIndicator('iterative', n);
    updateComparisonUI(n);

    if (isVisual) {
        await runIterativeVisual(n);
    } else {
        const avgTime = measureTime(caraIteratif, n);

        document.getElementById('iterativeResult').innerText = caraIteratif(n);
        document.getElementById('iterativeTime').innerText = `${formatTime(avgTime)}`;
        document.getElementById('iterativeSteps').innerHTML = '<div class="text-slate-500">Log visual dimatikan pada mode cepat.</div>';

        lastIterativeTime = avgTime;
        updateComparisonUI(n);
    }
}

// Handler Tombol "Jalankan Proses" (Rekursif)
async function runRecursive() {
    const input = document.getElementById('numberInput').value;
    const isVisual = document.getElementById('visualMode').checked;

    if (input === "") return;
    const n = parseFloat(input);

    updateCaseIndicator('recursive', n);
    updateComparisonUI(n);

    if (isVisual) {
        await runRecursiveVisual(n);
    } else {
        const avgTime = measureTime(runRecursiveAlgo, n);

        document.getElementById('recursiveResult').innerText = runRecursiveAlgo(n);
        document.getElementById('recursiveTime').innerText = `${formatTime(avgTime)}`;
        document.getElementById('recursiveSteps').innerHTML = '<div class="text-slate-500">Log visual dimatikan pada mode cepat.</div>';

        lastRecursiveTime = avgTime;
        updateComparisonUI(n);
    }
}

// Visualizer Logic
async function runIterativeVisual(n) {
    const logContainer = document.getElementById('iterativeSteps');
    const resultBox = document.getElementById('iterativeResult');
    logContainer.innerHTML = '';
    resultBox.innerText = '...';

    if (n === 0) {
        resultBox.innerText = "0";
        return;
    }

    let currentInt = Math.floor(n);
    let fraction = n - currentInt;
    let step = 1;
    let binerInt = "";

    // Visual: Integer Part
    let divHeader = document.createElement('div');
    divHeader.className = 'text-accentBlue font-bold mt-2 mb-1';
    divHeader.innerText = `--- Bagian Bulat ---`;
    logContainer.appendChild(divHeader);

    if (currentInt === 0) binerInt = "0";

    while (currentInt > 0) {
        const sisa = currentInt % 2;
        const next = Math.floor(currentInt / 2);

        const div = document.createElement('div');
        div.className = 'border-b border-slate-800 pb-1 mb-1 animate-pulse';
        div.innerHTML = `<span class="text-accentBlue">Step ${step}:</span> ${currentInt} / 2 = ${next} sisa <b class="text-accentCyan">${sisa}</b>`;
        logContainer.appendChild(div);
        logContainer.scrollTop = logContainer.scrollHeight;

        binerInt = sisa + binerInt;
        resultBox.innerText = binerInt + "...";
        currentInt = next;
        step++;
        await sleep(400);
        div.classList.remove('animate-pulse');
    }

    // Visual: Fraction Part
    let binerFrac = "";
    if (fraction > 0) {
        let divFracFunc = document.createElement('div');
        divFracFunc.className = 'text-accentBlue font-bold mt-4 mb-1';
        divFracFunc.innerText = `--- Bagian Pecahan ---`;
        logContainer.appendChild(divFracFunc);

        binerFrac = ".";
        let limit = 0;

        while (fraction > 0 && limit < 64) {
            let oldFrac = fraction;
            fraction *= 2;
            let bit = (fraction >= 1) ? 1 : 0;

            const div = document.createElement('div');
            div.className = 'border-b border-slate-800 pb-1 mb-1 animate-pulse';
            div.innerHTML = `<span class="text-slate-400">Step ${step}:</span> ${oldFrac.toFixed(5)} * 2 = <b>${fraction.toFixed(5)}</b> → Ambil <b class="text-emerald-400">${bit}</b>`;

            if (fraction >= 1) fraction -= 1;
            logContainer.appendChild(div);
            logContainer.scrollTop = logContainer.scrollHeight;

            binerFrac += bit;
            resultBox.innerText = binerInt + binerFrac;

            limit++;
            step++;
            await sleep(100);
            div.classList.remove('animate-pulse');
        }
    }

    const finalRes = binerInt + binerFrac;
    resultBox.innerText = finalRes;

    const doneDiv = document.createElement('div');
    doneDiv.className = 'text-emerald-400 mt-2 font-bold';
    doneDiv.innerText = `>> Selesai! Hasil: ${finalRes}`;
    logContainer.appendChild(doneDiv);
}

async function runRecursiveVisual(n) {
    const logContainer = document.getElementById('recursiveSteps');
    const resultBox = document.getElementById('recursiveResult');
    logContainer.innerHTML = '';
    resultBox.innerText = '...';

    if (n === 0) {
        resultBox.innerText = "0";
        return;
    }

    let integer = Math.floor(n);
    let fraction = n - integer;

    // Visual: Integer
    let divHeader = document.createElement('div');
    divHeader.className = 'text-accentPurple font-bold mt-2 mb-1';
    divHeader.innerText = `--- Bagian Bulat ---`;
    logContainer.appendChild(divHeader);

    async function visInt(num, depth) {
        const indent = depth * 15;
        let callDiv = document.createElement('div');
        callDiv.className = 'mb-1 text-slate-300';
        callDiv.style.paddingLeft = `${indent}px`;
        callDiv.innerHTML = `→ call int(${num})`;
        logContainer.appendChild(callDiv);
        logContainer.scrollTop = logContainer.scrollHeight;
        await sleep(200);

        if (num === 0) {
            let retDiv = document.createElement('div');
            retDiv.className = 'mb-1 text-slate-500';
            retDiv.style.paddingLeft = `${indent}px`;
            retDiv.innerText = `← Return "" (Base)`;
            logContainer.appendChild(retDiv);
            return "";
        }

        let res = await visInt(Math.floor(num / 2), depth + 1);
        let bit = num % 2;

        let retDiv = document.createElement('div');
        retDiv.className = 'mb-1 text-emerald-400';
        retDiv.style.paddingLeft = `${indent}px`;
        retDiv.innerHTML = `← Return "${res}" + ${bit}`;
        logContainer.appendChild(retDiv);
        logContainer.scrollTop = logContainer.scrollHeight;
        await sleep(200);
        return res + bit;
    }

    let binerInt = (integer === 0) ? "0" : await visInt(integer, 0);

    // Visual: Fraction
    let binerFrac = "";
    if (fraction > 0) {
        let divFracHeader = document.createElement('div');
        divFracHeader.className = 'text-accentPurple font-bold mt-4 mb-1';
        divFracHeader.innerText = `--- Bagian Pecahan ---`;
        logContainer.appendChild(divFracHeader);

        async function visFrac(frac, limit, depth) {
            if (frac === 0 || limit >= 64) return "";

            const indent = depth * 15;
            let val = frac * 2;
            let bit = (val >= 1) ? 1 : 0;
            let nextFrac = (val >= 1) ? val - 1 : val;

            let callDiv = document.createElement('div');
            callDiv.className = 'mb-1 text-slate-300';
            callDiv.style.paddingLeft = `${indent}px`;
            callDiv.innerHTML = `→ call frac(${frac.toFixed(4)}) * 2 = <b>${val.toFixed(4)}</b>`;
            logContainer.appendChild(callDiv);
            logContainer.scrollTop = logContainer.scrollHeight;
            await sleep(100);

            let res = await visFrac(nextFrac, limit + 1, depth + 1);
            return bit + res;
        }

        binerFrac = "." + await visFrac(fraction, 0, 0);
    }

    const finalRes = binerInt + binerFrac;
    resultBox.innerText = finalRes;

    const doneDiv = document.createElement('div');
    doneDiv.className = 'text-accentPurple mt-2 font-bold border-t border-slate-700 pt-1';
    doneDiv.innerText = `>> Hasil Akhir: ${finalRes}`;
    logContainer.appendChild(doneDiv);
}

// --- Benchmark & Charts ---

function runBenchmark() {
    const resultsIter = [];
    const resultsRecur = [];
    const tableBody = document.querySelector('#benchmarkTable tbody');
    const summaryBox = document.getElementById('benchmarkSummary');
    const summaryText = document.getElementById('benchmarkText');

    tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-accentCyan animate-pulse">Running Benchmark (Stabilizing)...</td></tr>';
    summaryBox.classList.add('hidden');

    let index = 0;

    function processNext() {
        if (index >= dataset.length) {
            updateChart(resultsIter, resultsRecur);
            updateTable(resultsIter, resultsRecur);

            // Calculate Comparison Summary
            let iterTotal = resultsIter.reduce((a, b) => a + b, 0);
            let recurTotal = resultsRecur.reduce((a, b) => a + b, 0);

            summaryBox.classList.remove('hidden');
            if (iterTotal < recurTotal) {
                summaryText.innerHTML = `Secara keseluruhan, <span class="text-accentBlue font-bold">Iteratif</span> lebih stabil dan cepat. <br>Total Execution Time: <span class="font-mono text-white">${formatTime(iterTotal)}</span> vs <span class="font-mono text-gray-400">${formatTime(recurTotal)}</span>`;
            } else {
                summaryText.innerHTML = `Secara keseluruhan, <span class="text-accentPurple font-bold">Rekursif</span> unggul pada benchmark ini. <br>Total Execution Time: <span class="font-mono text-white">${formatTime(recurTotal)}</span> vs <span class="font-mono text-gray-400">${formatTime(iterTotal)}</span>`;
            }
            return;
        }

        const n = dataset[index];

        const timeIter = measureTime(caraIteratif, n);
        resultsIter.push(timeIter);

        const timeRecur = measureTime(runRecursiveAlgo, n);
        resultsRecur.push(timeRecur);

        index++;
        setTimeout(processNext, 10);
    }
    processNext();
}

function updateTable(iter, recur) {
    const tbody = document.querySelector('#benchmarkTable tbody');
    tbody.innerHTML = '';

    // Hitung rata-rata global (Mean) dari total waktu (Iter + Recur)
    let totalAll = 0;
    const times = dataset.map((_, i) => {
        const t = iter[i] + recur[i];
        totalAll += t;
        return t;
    });
    const mean = totalAll / dataset.length;

    // Cari index yang paling mendekati rata-rata (Avg Case)
    let avgIdx = -1;
    let minDiff = Infinity;

    times.forEach((t, i) => {
        const diff = Math.abs(t - mean);
        if (diff < minDiff) {
            minDiff = diff;
            avgIdx = i;
        }
    });

    dataset.forEach((n, i) => {
        let label = "";
        if (i === avgIdx) {
            label = '<span class="ml-2 text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30">Avg (Mean)</span>';
        } else if (times[i] < times[avgIdx]) {
            label = '<span class="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">Best (< Avg)</span>';
        } else {
            label = '<span class="ml-2 text-xs bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded border border-rose-500/30">Worst (> Avg)</span>';
        }

        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-800 hover:bg-slate-800/50 transition-colors';
        tr.innerHTML = `
                    <td class="p-3 text-white font-bold flex items-center">
                        ${n} ${label}
                    </td>
                    <td class="p-3 text-white">${formatTime(iter[i])}</td>
                    <td class="p-3 text-gray-400">${formatTime(recur[i])}</td>
                `;
        tbody.appendChild(tr);
    });
}

function updateChart(iterData, recurData) {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    if (performanceChart) performanceChart.destroy();

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
                title: { display: true, text: 'Rata-rata Waktu Eksekusi (Nanoseconds)', color: '#fff' }
            },
            scales: {
                y: {
                    grid: { color: '#1e293b' },
                    title: { display: true, text: 'Nanoseconds (ns)' },
                    ticks: {
                        callback: function (value) { return (value * 1e6).toFixed(0); } // Convert MS tick to NS
                    }
                },
                x: { grid: { color: '#1e293b' } }
            },
            tooltips: {
                callbacks: {
                    label: function (context) {
                        return context.dataset.label + ': ' + (context.raw * 1e6).toLocaleString() + ' ns';
                    }
                }
            }
        }
    });
}

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
        btn.addEventListener('click', () => { menu.classList.toggle('hidden'); });
        links.forEach(link => {
            link.addEventListener('click', () => { menu.classList.add('hidden'); });
        });
    }

    // Real-time Case Indicator Update
    const numInput = document.getElementById('numberInput');
    if (numInput) {
        numInput.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val)) {
                updateCaseIndicator('iterative', val);
                updateCaseIndicator('recursive', val);
                updateComparisonUI(val); // Hides comparison if changed
            } else {
                // Hide if invalid
                document.getElementById('iterativeCase').classList.add('hidden');
                document.getElementById('recursiveCase').classList.add('hidden');
            }
        });
    }
});


