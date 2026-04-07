// Firebase Yapılandırması (Sizin paylaştığınız bilgiler)
const firebaseConfig = {
    apiKey: "AIzaSyBal_UHvT2NvH7kly-VzcNaVTj3Tr8GUOY",
    authDomain: "maze-gage.firebaseapp.com",
    databaseURL: "https://firebaseio.com", // Veritabanı linkiniz
    projectId: "maze-gage",
    storageBucket: "maze-gage.firebasestorage.app",
    messagingSenderId: "426479057060",
    appId: "1:426479057060:web:3cef87d31189f6d05b8e31"
};

// Firebase Başlatma
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let currentLevel = 1;
let currentScore = 100;
const totalLevels = 25;

// ÖRNEK SORULAR (Buraları çoğaltın)
const sorular = [
    { s: "Dünya'nın uydusu hangisidir?", c: ["Ay", "Mars", "Güneş"], a: "Ay" },
    { s: "Türkiye'nin başkenti neresidir?", c: ["İstanbul", "Ankara", "İzmir"], a: "Ankara" },
    { s: "Barış Manço'nun doğum yılı nedir? 🎸", opts: ["🗓️ 1943", "🗓️ 1950", "🗓️ 1938"], a: 0 },
    { s: "Mustafa Kemal Atatürk'ün doğum yılı? 🇹🇷", opts: ["🗓️ 1880", "🗓️ 1881", "🗓️ 1885"], a: 1 },
    { s: "Dünya Kupası'nı en fazla kazanan ülke hangisidir? 🏆", opts: ["⚽ Brezilya", "⚽ Almanya", "⚽ Arjantin"], a: 0 },
{ s: "Ballon d'Or ödülünü en fazla kazanan futbolcu kimdir? ✨", opts: ["⚽ Cristiano Ronaldo", "⚽ Lionel Messi", "⚽ Pele"], a: 1 },
{ s: "Şampiyonlar Ligi kupasını en fazla müzesine götüren takım hangisidir? 🏰", opts: ["⚽ AC Milan", "⚽ Liverpool", "⚽ Real Madrid"], a: 2 },
{ s: "Dünya Kupası tarihinde en çok gol atan oyuncu kimdir? 👟", opts: ["⚽ Miroslav Klose", "⚽ Ronaldo Nazário", "⚽ Just Fontaine"], a: 0 },
{ s: "Hangi ülke 2022 FIFA Dünya Kupası'nı kazanmıştır? 🇦🇷", opts: ["⚽ Fransa", "⚽ Arjantin", "⚽ Hırvatistan"], a: 1 },
{ s: "Premier Lig tarihinde en çok gol atan oyuncu kimdir? 🏴󠁧󠁢󠁥󠁮󠁧󠁿", opts: ["⚽ Wayne Rooney", "⚽ Thierry Henry", "⚽ Alan Shearer"], a: 2 },
{ s: "Süper Lig'de 'namağlup şampiyon' unvanına sahip tek takım hangisidir? 🦁", opts: ["⚽ Beşiktaş", "⚽ Galatasaray", "⚽ Fenerbahçe"], a: 0 },
{ s: "Bir takvim yılında (91 gol) en çok gol atan futbolcu kimdir? 📅", opts: ["⚽ Gerd Müller", "⚽ Lionel Messi", "⚽ Robert Lewandowski"], a: 1 },
{ s: "Avrupa Şampiyonası (EURO) kupasını en çok kazanan ülkelerden biri hangisidir? 🇪🇺", opts: ["⚽ İspanya", "⚽ İtalya", "⚽ Portekiz"], a: 0 },
{ s: "UEFA Kupası'nı kazanan ilk ve tek Türk takımı hangisidir? 🇹🇷", opts: ["⚽ Fenerbahçe", "⚽ Beşiktaş", "⚽ Galatasaray"], a: 2 },
{ s: "Cristiano Ronaldo hangi yıl doğmuştur? ⚽", opts: ["🗓️ 1985", "🗓️ 1987", "🗓️ 1990"], a: 0 },
    { s: "Elon Musk'ın doğum yılı hangisidir? 🚀", opts: ["🗓️ 1971", "🗓️ 1965", "🗓️ 1980"], a: 0 },
    { s: "Albert Einstein hangi yıl doğdu? 🧠", opts: ["🗓️ 1879", "🗓️ 1900", "🗓️ 1855"], a: 0 },
    { s: "Kemal Sunal'ın doğum yılı nedir? 🎭", opts: ["🗓️ 1944", "🗓️ 1950", "🗓️ 1940"], a: 0 },
    { s: "Lionel Messi'nin doğum yılı? ⚽", opts: ["🗓️ 1987", "🗓️ 1989", "🗓️ 1985"], a: 0 },
    { s: "Michael Jackson hangi yıl doğdu? 🕺", opts: ["🗓️ 1958", "🗓️ 1960", "🗓️ 1955"], a: 0 },
    { s: "Steve Jobs'un doğum yılı hangisidir? 🍎", opts: ["🗓️ 1955", "🗓️ 1950", "🗓️ 1960"], a: 0 },
    { s: "Bill Gates hangi yıl dünyaya geldi? 💻", opts: ["🗓️ 1955", "🗓️ 1958", "🗓️ 1962"], a: 0 },

    { s: "2 + 2 kaç eder?", c: ["3", "4", "5"], a: "4" }
];

function loadQuestion() {
    if (currentLevel > totalLevels) {
        showSaveScreen();
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
        document.getElementById("level-display").innerText = "Level: " + currentLevel;
        document.getElementById("score-display").innerText = "Puan: " + currentScore;
        loadQuestion();
    } else {
        alert("Yanlış cevap! 1. Levele dönüyorsun.");
        currentLevel = 1;
        currentScore = 100;
        document.getElementById("level-display").innerText = "Level: 1";
        document.getElementById("score-display").innerText = "Puan: 100";
        loadQuestion();
    }
}

function showSaveScreen() {
    document.getElementById("game-area").style.display = "none";
    document.getElementById("save-area").style.display = "block";
    document.getElementById("final-score").innerText = "Toplam Puan: " + currentScore;
}

function saveScore() {
    const nick = document.getElementById("nickname").value;
    if (!nick) return alert("İsim giriniz!");
    
    database.ref('leaderboard/').push({
        name: nick,
        score: currentScore
    }).then(() => {
        showLeaderboard();
    });
}

function showLeaderboard() {
    document.getElementById("save-area").style.display = "none";
    document.getElementById("leader-area").style.display = "block";
    
    database.ref('leaderboard/').orderByChild('score').limitToLast(15).once('value', (snap) => {
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

// Oyunu Başlat
loadQuestion();
