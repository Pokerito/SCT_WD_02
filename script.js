// Stopwatch variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let laps = [];
let autoLapTimer = null;
let isRunning = false;

// DOM elements
const display = document.getElementById('display');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');
const exportBtn = document.getElementById('export');
const themeToggleBtn = document.getElementById('theme-toggle');
const soundToggle = document.getElementById('sound-toggle');
const autoLapCheckbox = document.getElementById('auto-lap');
const autoLapIntervalInput = document.getElementById('auto-lap-interval');
const lapsList = document.getElementById('laps');
const bestLapDiv = document.getElementById('best-lap');
const averageLapDiv = document.getElementById('average-lap');
const lapSound = document.getElementById('lap-sound');

// --- Animated background particles ---
const particleCount = 30;
const particles = [];
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = 0;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

function randomColor() {
    const colors = [
        '#43cea2', '#185a9d', '#f7971e', '#ffd200', '#fbc2eb', '#a6c1ee', '#ff9a9e', '#fad0c4'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function createParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: 8 + Math.random() * 16,
            dx: (Math.random() - 0.5) * 0.7,
            dy: (Math.random() - 0.5) * 0.7,
            color: randomColor(),
            alpha: 0.15 + Math.random() * 0.25
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.restore();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < -p.r) p.x = canvas.width + p.r;
        if (p.x > canvas.width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = canvas.height + p.r;
        if (p.y > canvas.height + p.r) p.y = -p.r;
    }
    requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

createParticles();
drawParticles();

// --- Motivational Quotes ---
const quotes = [
    "Every second counts. ⏱️",
    "Push your limits!",
    "You are your only limit.",
    "Great things take time.",
    "Stay focused and never give up.",
    "Make every lap better than the last.",
    "Consistency is the key to success.",
    "Believe in yourself!",
    "Small progress is still progress.",
    "Keep going, you're doing great!"
];
const quoteDiv = document.createElement('div');
quoteDiv.style.position = 'fixed';
quoteDiv.style.bottom = '24px';
quoteDiv.style.left = '50%';
quoteDiv.style.transform = 'translateX(-50%)';
quoteDiv.style.background = 'rgba(255,255,255,0.85)';
quoteDiv.style.color = '#222';
quoteDiv.style.padding = '0.7rem 1.5rem';
quoteDiv.style.borderRadius = '12px';
quoteDiv.style.fontSize = '1.1rem';
quoteDiv.style.fontWeight = '500';
quoteDiv.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
quoteDiv.style.zIndex = 10;
quoteDiv.style.transition = 'background 0.3s, color 0.3s';
document.body.appendChild(quoteDiv);

function showRandomQuote() {
    quoteDiv.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}
showRandomQuote();
setInterval(showRandomQuote, 12000);

function updateQuoteTheme() {
    if (document.body.classList.contains('dark')) {
        quoteDiv.style.background = 'rgba(34,37,38,0.92)';
        quoteDiv.style.color = '#ffe066';
    } else {
        quoteDiv.style.background = 'rgba(255,255,255,0.85)';
        quoteDiv.style.color = '#222';
    }
}

// --- Confetti on Best Lap ---
function confettiBurst() {
    for (let i = 0; i < 24; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.position = 'fixed';
        conf.style.left = (50 + Math.random() * 30 - 15) + '%';
        conf.style.top = '40%';
        conf.style.width = '10px';
        conf.style.height = '18px';
        conf.style.background = randomColor();
        conf.style.opacity = 0.8;
        conf.style.borderRadius = '3px';
        conf.style.transform = `rotate(${Math.random() * 360}deg)`;
        conf.style.zIndex = 100;
        conf.style.transition = 'transform 1.2s cubic-bezier(.17,.67,.83,.67), opacity 1.2s';
        document.body.appendChild(conf);
        setTimeout(() => {
            conf.style.transform += ` translateY(${180 + Math.random() * 120}px) scale(${0.7 + Math.random() * 0.7})`;
            conf.style.opacity = 0;
        }, 10);
        setTimeout(() => conf.remove(), 1300);
    }
}

// --- Sound for Best Lap ---
const bestLapAudio = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_115b9e1b6e.mp3');

// --- Helper functions ---
function formatTime(ms) {
    const centiseconds = Math.floor((ms % 1000) / 10);
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return (
        (hours > 0 ? String(hours).padStart(2, '0') + ':' : '') +
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0') + '.' +
        String(centiseconds).padStart(2, '0')
    );
}

function updateDisplay() {
    display.textContent = formatTime(elapsedTime);
}

function updateButtons() {
    startBtn.disabled = isRunning;
    pauseBtn.disabled = !isRunning;
    resetBtn.disabled = !elapsedTime && laps.length === 0;
    lapBtn.disabled = !isRunning;
    exportBtn.disabled = laps.length === 0;
}

function updateLaps() {
    lapsList.innerHTML = '';
    if (laps.length === 0) {
        bestLapDiv.textContent = '';
        averageLapDiv.textContent = '';
        return;
    }
    let bestIndex = 0;
    let bestValue = laps[0];
    let sum = laps[0];
    for (let i = 1; i < laps.length; i++) {
        sum += laps[i];
        if (laps[i] < bestValue) {
            bestValue = laps[i];
            bestIndex = i;
        }
    }
    laps.forEach((lap, i) => {
        const li = document.createElement('li');
        li.textContent = `Lap ${i + 1}: ${formatTime(lap)}`;
        if (i === bestIndex) li.classList.add('best');
        lapsList.appendChild(li);
    });
    // Confetti and sound only on new best lap
    if (laps.length > 1 && laps[laps.length - 1] === bestValue) {
        confettiBurst();
        bestLapAudio.currentTime = 0;
        bestLapAudio.play();
    }
    bestLapDiv.textContent = `Best Lap: ${formatTime(bestValue)}`;
    averageLapDiv.textContent = `Average Lap: ${formatTime(Math.floor(sum / laps.length))}`;
}

function playLapSound() {
    if (soundToggle.checked) {
        lapSound.currentTime = 0;
        lapSound.play();
    }
}

function startAutoLap() {
    stopAutoLap();
    if (autoLapCheckbox.checked && isRunning) {
        let interval = parseInt(autoLapIntervalInput.value, 10);
        if (isNaN(interval) || interval < 1) interval = 60;
        autoLapTimer = setInterval(() => {
            recordLap();
        }, interval * 1000);
    }
}

function stopAutoLap() {
    if (autoLapTimer) {
        clearInterval(autoLapTimer);
        autoLapTimer = null;
    }
}

// Stopwatch logic
function startStopwatch() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateDisplay();
        }, 10);
        isRunning = true;
        updateButtons();
        startAutoLap();
    }
}

function pauseStopwatch() {
    if (isRunning) {
        clearInterval(timerInterval);
        timerInterval = null;
        elapsedTime = Date.now() - startTime;
        isRunning = false;
        updateButtons();
        stopAutoLap();
    }
}

function resetStopwatch() {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedTime = 0;
    startTime = 0;
    isRunning = false;
    laps = [];
    updateDisplay();
    updateButtons();
    updateLaps();
    stopAutoLap();
}

function recordLap() {
    if (!isRunning) return;
    let lapTime = elapsedTime;
    if (laps.length > 0) {
        lapTime -= laps.reduce((a, b) => a + b, 0);
    }
    laps.push(lapTime);
    updateLaps();
    updateButtons();
    playLapSound();
}

function exportLaps() {
    if (laps.length === 0) return;
    let csv = 'Lap,Time\n';
    laps.forEach((lap, i) => {
        csv += `${i + 1},${formatTime(lap)}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stopwatch_laps.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Theme toggle
function toggleTheme() {
    document.body.classList.toggle('dark');
    themeToggleBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    updateQuoteTheme();
}

// Event listeners
startBtn.addEventListener('click', startStopwatch);
pauseBtn.addEventListener('click', pauseStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', recordLap);
exportBtn.addEventListener('click', exportLaps);
themeToggleBtn.addEventListener('click', toggleTheme);

autoLapCheckbox.addEventListener('change', () => {
    if (autoLapCheckbox.checked && isRunning) {
        startAutoLap();
    } else {
        stopAutoLap();
    }
});
autoLapIntervalInput.addEventListener('change', () => {
    if (autoLapCheckbox.checked && isRunning) {
        startAutoLap();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    switch (e.key.toLowerCase()) {
        case ' ':
            if (isRunning) pauseStopwatch();
            else startStopwatch();
            e.preventDefault();
            break;
        case 'l':
            if (isRunning) recordLap();
            break;
        case 'r':
            resetStopwatch();
            break;
        case 't':
            toggleTheme();
            break;
    }
});

// Initialize
updateDisplay();
updateButtons();
updateLaps();
themeToggleBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
updateQuoteTheme();