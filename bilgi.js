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

// Firebase Başlatma
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

let currentLevel = 1;
let currentScore = 10;
const totalLevels = 25;

// TÜM SORULAR AYNI FORMATTA DÜZENLENDİ (s: soru, c: seçenekler, a: doğru cevap metni)
const sorular = [
    { s: "Dünya'nın uydusu hangisidir?", c: ["Ay", "Mars", "Güneş"], a: "Ay" },
    { s: "Türkiye'nin başkenti neresidir?", c: ["İstanbul", "Ankara", "İzmir"], a: "Ankara" },
    { s: "Barış Manço'nun doğum yılı nedir? 🎸", c: ["1943", "1950", "1938"], a: "1943" },
    { s: "Mustafa Kemal Atatürk'ün doğum yılı? 🇹🇷", c: ["1880", "1881", "1885"], a: "1881" },
    { s: "Dünya Kupası'nı en fazla kazanan ülke? 🏆", c: ["Brezilya", "Almanya", "Arjantin"], a: "Brezilya" },
    { s: "Ballon d'Or ödülünü en fazla kazanan futbolcu? ✨", c: ["Ronaldo", "Messi", "Pele"], a: "Messi" },
    { s: "Şampiyonlar Ligi'ni en çok kazanan takım? 🏰", c: ["Milan", "Liverpool", "Real Madrid"], a: "Real Madrid" },
    { s: "Hangi ülke 2022 Dünya Kupası'nı kazanmıştır? 🇦🇷", c: ["Fransa", "Arjantin", "Hırvatistan"], a: "Arjantin" },
    { s: "UEFA Kupası'nı kazanan tek Türk takımı? 🇹🇷", c: ["Fenerbahçe", "Beşiktaş", "Galatasaray"], a: "Galatasaray" },
    { s: "Cristiano Ronaldo doğum yılı? ⚽", c: ["1985", "1987", "1990"], a: "1985" },
    { s: "Elon Musk'ın doğum yılı hangisidir? 🚀", c: ["1971", "1965", "1980"], a: "1971" },
    { s: "Albert Einstein hangi yıl doğdu? 🧠", c: ["1879", "1900", "1855"], a: "1879" },
    { s: "Kemal Sunal'ın doğum yılı nedir? 🎭", c: ["1944", "1950", "1940"], a: "1944" },
    { s: "Michael Jackson hangi yıl doğdu? 🕺", c: ["1958", "1960", "1955"], a: "1958" },
    { s: "Steve Jobs'un doğum yılı hangisidir? 🍎", c: ["1955", "1950", "1960"], a: "1955" },
    { s: "Bill Gates hangi yıl dünyaya geldi? 💻", c: ["1955", "1958", "1962"], a: "1955" },
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
        // Doğru cevapta puanı 1.5 katına çıkar (İstersen burayı değiştirebilirsin)
        currentScore = Math.round(currentScore * 1.5);
        
        document.getElementById("level-display").innerText = "Level: " + currentLevel;
        document.getElementById("score-display").innerText = "Puan: " + currentScore;
        loadQuestion();
    } else {
        // YANLIŞ CEVAP DURUMU:
        alert("Yanlış cevap! Puanın yarıya düştü.");
        
        // Puanı yarıya indir (Math.round ile küsuratı yuvarlıyoruz)
        currentScore = Math.round(currentScore / 2);
        
        // Eğer puan 0'a veya altına düşerse oyunu bitir veya minimum 1 yap
        if (currentScore < 1) currentScore = 1; 

        document.getElementById("score-display").innerText = "Puan: " + currentScore;
        
        // Yanlış cevapta aynı soruda mı kalsın yoksa yeni soru mu gelsin? 
        // Yeni soru için:
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
        score: currentScore,
        date: Date.now()
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
