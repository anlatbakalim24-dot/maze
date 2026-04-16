// 1. Firebase Yapılandırması (databaseURL buradan silindi, hata vermemesi için)
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
// Firebase Başlatma (Sadece bir kez çağrılmalı)
const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
const dbUrl = "https://maze-gage-default-rtdb.europe-west1.firebasedatabase.app/";

// HATANIN KESİN ÇÖZÜMÜ: Eski kütüphane için doğru yazım budir
const database = app.database(dbUrl);

let currentLevel = 1;
let currentScore = 5; // Başlangıç puanı 5
const totalLevels = 25;
let timeLeft = 180; // 3 dakika
let timerInterval;

const sorular = [
    { s: "Dünya'nın uydusu hangisidir?", c: ["Ay", "Mars", "Güneş"], a: "Ay" },
    { s: "Tiyatrocular arasında hangi Shakespeare oyununun adını sahnede anmak büyük uğursuzluktur?", c: ["Macbeth", "Hamlet", "Romeo ve Juliet"], a: "Macbeth" },
    { s: "1700 lerde bir gemide hangi meyva'nın taşınması felaket sebebi sayılırdı.", c: ["Ayva", "Hindistan Cevizi", "Muz"], a: "Muz" },
    { s: "Antik Roma’da damadın gelini eşikten kucağında taşıyarak geçirmesinin sebebi neydi?", c: ["Evdeki kötü ruhları korkutmak", "Gelinin yorulmasını engellemek", "Gelinin ayağının takılmasının uğursuzluk sayılması"], a: "Gelinin ayağının takılmasının uğursuzluk sayılması" },
    { s: "Bitcoin arzı kaç adet ile sınırlandırılmıştır? ₿ ", c: ["18Milyon", "21Milyon", "31Milyon"], a: "21Milyon" },
    { s: "2021 yılında Bitcoin'i resmi para birimi (legal tender) olarak kabul eden ilk ülke?", c: ["ElSalvador", "Arjantin", "Panama"], a: "ElSalvador" },
    { s: "Dogecoin hangi yıl, bir 'şaka' (meme) olarak piyasaya sürülmüştür?", c: ["2017", "2013", "2015"], a: "2013" },
    { s: "Bir altcoinin kendi blokzinciri yoksa ona ne ad verilir?", c: ["Fork", "Mainnet", "Token"], a: "Token" },
    { s: "2025 yılında G20 ülkeleri arasında %7,6 ile en hızlı büyüme oranına ulaşan ülke?", c: ["Türkiye", "Hindistan", "Çin"], a: "Hindistan" },
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
    { s: "Zürafa dilleri ne renktir.? 💻", c: ["Pembe", "Siyah-Mor", "Kırmızı"], a: "Siyah-Mor" },
    { s: "Kemal Sunal'ın doğum yılı nedir? 🎭", c: ["1944", "1950", "1940"], a: "1944" },
    { s: "Hangi hayvan uyurken bir gözü açıktır? 💻", c: ["Tavşan", "Tilki", "Yunus"], a: "Yunus" },
    { s: "1 kilo bal yapmak için arı kaç çiceğe konar.? 💻", c: ["100 bin", "1 Milyon", "4 Milyon"], a: "4 Milyon" },
    { s: "Michael Jackson hangi yıl doğdu? 🕺", c: ["1958", "1960", "1955"], a: "1958" },
    { s: "Steve Jobs'un doğum yılı hangisidir? 🍎", c: ["1955", "1950", "1960"], a: "1955" },
    { s: "'Aşk-ı Memnu' dizisinde 'Behlül'ü kim canlandırdı?", c: ["Kıvanç Tatlıtuğ", "Kenan İmirzalıoğlu", "Çağatay Ulusoy"], a: "Kıvanç Tatlıtuğ" },
    { s: "'Ezel' dizisinin başrol oyuncusu kimdir? ♠️", c: ["Tuncel Kurtiz", "Kenan İmirzalıoğlu", "Barış Falay"], a: "Kenan İmirzalıoğlu" },
    { s: "'Muhteşem Yüzyıl'da 'Kanuni'yi kim oynadı? 👑", c: ["Halit Ergenç", "Ozan Güven", "Burak Özçivit"], a: "Halit Ergenç" },
    { s: "'Kurtlar Vadisi'nin Polat Alemdar'ı kimdir?", c: ["Gürkan Uygun", "Oktay Kaynarca", "Necati Şaşmaz"], a: "Necati Şaşmaz" },
    { s: "'Yargı' dizisinde Ilgaz Savcı kimdir? ⚖️", c: ["Kaan Urgancıoğlu", "Uğur Aslan", "Aras Bulut İynemli"], a: "Kaan Urgancıoğlu" },
    { s: "'İçerde' dizisinde Sarp'ı kim oynadı? 🕵️", c: ["Çağatay Ulusoy", "Aras Bulut İynemli", "Çetin Tekindor"], a: "Çağatay Ulusoy" },
    { s: "'Behzat Ç.' karakterini kim canlandırdı? 🚨", c: ["Erdal Beşikçioğlu", "Nejat İşler", "Fatih Artman"], a: "Erdal Beşikçioğlu" },
    { s: "'Çukur' dizisinin Yamaç Koçovalı'sı kimdir?", c: ["Necip Memili", "Erkan Kolçak Köstendil", "Aras Bulut İynemli"], a: "Aras Bulut İynemli" },
    { s: "'Leyla ile Mecnun'un Mecnun'u kimdir? 🐲", c: ["Ali Atay", "Serkan Keskin", "Ahmet Mümtaz Taylan"], a: "Ali Atay" },
    { s: "Lumiere Kardeşler tarihteki ilk halka açık film gösterisini kaç yılda yaptı?", c: ["1915", "1895", "1912"], a: "1895" },
    { s: "Bill Gates hangi yıl dünyaya geldi?", c: ["1955", "1958", "1962"], a: "1955" },
    { s: "Bir zürafanın boynunda kaç adet kemik (omur) bulunur?", c: ["7", "14", "21"], a: "7" },
    { s: "Arı kuşu bir saniyede yaklaşık kaç kez kanat çırpar?", c: ["20-30", "50-80", "110-130"], a: "50-80" },
    { s: "Bir aslanın kükremesi yaklaşık kaç kilometre mesafeden duyulabilir?", c: ["4", "6", "8"], a: "8" },
    { s: "Üç adet kalbi olan hayvan?", c: ["Ahtapot", "Karides", "Salyangoz"], a: "Ahtapot" },
    { s: "Machu Picchu hangi ülkededir?", c: ["Bolivya", "Peru", "Kolombiya"], a: "Peru" },
    { s: "12 - 4 kaç eder?", c: ["3", "8", "5"], a: "8" }
];

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        
        const levelElem = document.getElementById("level-display");
        if(levelElem) {
            levelElem.innerText = "Level: " + currentLevel;
        }
        
        const timerElem = document.getElementById("timer-display");
        if(timerElem) {
            // Görünmez karakterler temizlendi
            timerElem.innerText = "Süre: " + mins + ":" + (secs < 10 ? "0" : "") + secs;
        }
        
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
    document.getElementById("score-display").innerText = "Puan: " + currentScore;
    
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
        currentScore = Math.round(currentScore * 1.25);
        loadQuestion();
    } else {
        alert("Yanlış cevap! Puanın yarıya düştü.");
        currentScore = Math.round(currentScore / 2);
        if (currentScore < 1) currentScore = 1; 
        loadQuestion();
    }
}

function finishGame() {
    clearInterval(timerInterval);
    if (timeLeft > 0) {
        currentScore = Math.round(currentScore * (timeLeft / 60));
    }
    showSaveScreen();
}

function showSaveScreen() {
    document.getElementById("game-area").style.display = "none";
    document.getElementById("save-area").style.display = "block";
    document.getElementById("final-score").innerText = "Toplam Puan: " + currentScore;
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

// OYUNU BAŞLAT
window.onload = function() {
    startTimer();
    loadQuestion();
};
// Cloudflare korumalı silme fonksiyonu
window.adminReset = async function(sifre) {
    const workerUrl = "https://hizlij3s.anlatbakalim24.workers.dev"; // BURAYI KENDİ WORKER URL'NİZLE DEĞİŞTİRİN

    try {
        const response = await fetch(workerUrl, {
            method: "POST",
            body: JSON.stringify({ password: sifre }),
            headers: { "Content-Type": "application/json" }
        });

        const result = await response.json();

        if (result.success) {
            if (confirm("Şifre doğru. Firebase verileri silinsin mi?")) {
                database.ref('leaderboard/').remove()
                    .then(() => {
                        alert("İşlem başarılı!");
                        location.reload();
                    });
            }
        } else {
            alert("Hatalı şifre! Yetkiniz yok.");
        }
    } catch (err) {
        alert("Bağlantı hatası: " + err);
    }
}
