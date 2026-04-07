// 1. Firebase Yapılandırması
const firebaseConfig = {
    apiKey: "AIzaSyBal_UHvT2NvH7kly-VzcNaVTj3Tr8GUOY",
    authDomain: "maze-gage.firebaseapp.com",
    databaseURL: "https://maze-gage-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "maze-gage",
    storageBucket: "maze-gage.firebasestorage.app",
    messagingSenderId: "426479057060",
    appId: "1:426479057060:web:3cef87d31189f6d05b8e31"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const database = firebase.database();

let currentLevel = 1;
let currentScore = 10;
const totalLevels = 25;
let timeLeft = 300; // 5 dakika (saniye cinsinden)
let timerInterval;

// Sorular (Örnek olarak bıraktım, kendi listenizi buraya ekleyin)
const sorular = [
    { s: "Dünya'nın uydusu hangisidir?", c: ["Ay", "Mars", "Güneş"], a: "Ay" },
    { s: "12 - 4 kaç eder?", c: ["3", "8", "5"], a: "8" }
];

// Sayacı Başlat
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        // HTML'de id="level-display" olan yerin yanına süreyi yazdırır
        document.getElementById("level-display").innerText = `Level: ${currentLevel} | Süre: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Süre bitti!");
            showSaveScreen();
        }
    }, 1000);
}

function loadQuestion() {
    if (currentLevel > totalLevels) {
        finishGame();
        return;
    }
    const q = sorular[Math.floor(Math.random() * sorular.length)];
    document.getElementById("question-text").innerText = q.s;
    const optDiv = document.getElementById("options");
    optDiv.innerHTML = "";
    
    q.c.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "opt-btn";
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt, q.a);
        optDiv.appendChild(btn);
    });
}

function checkAnswer(selected, correct) {
    if (selected === correct) {
        currentLevel++;
        currentScore = Math.round(currentScore * 1.5);
        document.getElementById("score-display").innerText = "Puan: " + currentScore;
        loadQuestion();
    } else {
        currentScore = Math.round(currentScore / 2);
        if (currentScore < 1) currentScore = 1; 
        document.getElementById("score-display").innerText = "Puan: " + currentScore;
        loadQuestion();
    }
}

function finishGame() {
    clearInterval(timerInterval);
    // Kalan dakikayı hesapla (Örn: 2:30 kaldıysa 2 dakika bonusu)
    let remainingMinutes = Math.floor(timeLeft / 60);
    if (remainingMinutes > 0) {
        currentScore = currentScore * remainingMinutes;
    }
    showSaveScreen();
}

function showSaveScreen() {
    clearInterval(timerInterval);
    document.getElementById("game-area").style.display = "none";
    document.getElementById("save-area").style.display = "block";
    document.getElementById("final-score").innerText = "Oyun Bitti! Toplam Puan: " + currentScore;
}

function saveScore() {
    const nick = document.getElementById("nickname").value;
    if (!nick) return alert("İsim giriniz!");
    database.ref('leaderboard/').push({ name: nick, score: currentScore }).then(() => {
        showLeaderboard();
    });
}

function showLeaderboard() {
    document.getElementById("save-area").style.display = "none";
    document.getElementById("leader-area").style.display = "block";
    database.ref('leaderboard/').orderByChild('score').limitToLast(10).once('value', (snap) => {
        const list = [];
        snap.forEach(child => { list.push(child.val()); });
        list.reverse();
        const body = document.getElementById("leader-list");
        body.innerHTML = "";
        list.forEach((item, i) => {
            body.innerHTML += `<tr><td>${i+1}</td><td>${item.name}</td><td>${item.score}</td></tr>`;
        });
    });
}

// Oyunu başlat
startTimer();
loadQuestion();
