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
    { s: "'Aşk-ı Memnu' dizisinde 'Behlül' karakterini kim canlandırdı? 🍎", opts: ["🎬 Kıvanç Tatlıtuğ", "🎬 Kenan İmirzalıoğlu", "🎬 Çağatay Ulusoy"], a: 0 },
    { s: "'Ezel' dizisinin başrol oyuncusu kimdir? ♠️", opts: ["🎬 Tuncel Kurtiz", "🎬 Kenan İmirzalıoğlu", "🎬 Barış Falay"], a: 1 },
    { s: "'Muhteşem Yüzyıl'da 'Kanuni Sultan Süleyman'ı kim oynadı? 👑", opts: ["🎬 Halit Ergenç", "🎬 Ozan Güven", "🎬 Burak Özçivit"], a: 0 },
    { s: "'Kurtlar Vadisi'nin Polat Alemdar'ı kimdir? 🕵️‍♂️", opts: ["🎬 Gürkan Uygun", "🎬 Oktay Kaynarca", "🎬 Necati Şaşmaz"], a: 2 },
    { s: "'Yargı' dizisinde 'Ilgaz Savcı' karakterini kim canlandırıyor? ⚖️", opts: ["🎬 Kaan Urgancıoğlu", "🎬 Uğur Aslan", "🎬 Aras Bulut İynemli"], a: 0 },
    { s: "'İçerde' dizisinde Sarp karakterine kim hayat verdi? 🕵️", opts: ["🎬 Çağatay Ulusoy", "🎬 Aras Bulut İynemli", "🎬 Çetin Tekindor"], a: 0 },
    { s: "'Diriliş Ertuğrul'un başrol oyuncusu kimdir? 🏹", opts: ["🎬 Engin Altan Düzyatan", "🎬 Osman Sınav", "🎬 Nurettin Sönmez"], a: 0 },
    { s: "'Medcezir' dizisinde Yaman karakterini kim oynadı? 🎸", opts: ["🎬 Çağatay Ulusoy", "🎬 Taner Ölmez", "🎬 Metin Akdülger"], a: 0 },
    { s: "'Behzat Ç.' karakteriyle efsaneleşen oyuncu? 🚨", opts: ["🎬 Erdal Beşikçioğlu", "🎬 Nejat İşler", "🎬 Fatih Artman"], a: 0 },
    { s: "'Kiralık Aşk' dizisinde Ömer karakterini kim canlandırdı? 👠", opts: ["🎬 Barış Arduç", "🎬 Seçkin Özdemir", "🎬 Can Yaman"], a: 0 },
    { s: "'Çukur' dizisinin Yamaç Koçovalı'sı kimdir? 〽️", opts: ["🎬 Necip Memili", "🎬 Erkan Kolçak Köstendil", "🎬 Aras Bulut İynemli"], a: 2 },
    { s: "'Kuzey Güney' dizisinde Kuzey'i kim oynadı? 👊", opts: ["🎬 Buğra Gülsoy", "🎬 Kıvanç Tatlıtuğ", "🎬 Rıza Kocaoğlu"], a: 1 },
    { s: "'Poyraz Karayel'in başrol oyuncusu kimdir? 🕵️", opts: ["🎬 İlker Kaleli", "🎬 Burçin Terzioğlu", "🎬 Musa Uzunlar"], a: 0 },
    { s: "'Avrupa Yakası'nda Burhan Altıntop'u kim canlandırdı? 🛋️", opts: ["🎬 Ata Demirer", "🎬 Engin Günaydın", "🎬 Gazanfer Özcan"], a: 1 },
    { s: "'Gümüş' dizisiyle büyük çıkış yapan oyuncu? ✨", opts: ["🎬 Kıvanç Tatlıtuğ", "🎬 Songül Öden", "🎬 Serkan Çayoğlu"], a: 0 },
    { s: "'Söz' dizisinde Sarı Komutan Yavuz'u kim oynadı? 🪖", opts: ["🎬 Tolga Sarıtaş", "🎬 Nihat Altınkaya", "🎬 Görkem Sevindik"], a: 0 },
    { s: "'Fi' dizisinde Can Manay karakterini kim canlandırdı? 🥤", opts: ["🎬 Ozan Güven", "🎬 Mehmet Günsür", "🎬 Berrak Tüzünataç"], a: 0 },
    { s: "'Şahsiyet' dizisindeki performansıyla Emmy alan oyuncu? 🎭", opts: ["🎬 Haluk Bilginer", "🎬 Şener Şen", "🎬 Metin Akdülger"], a: 0 },
    { s: "'Bir Zamanlar Çukurova'nın Züleyha'sı kimdir? 🌾", opts: ["🎬 Hilal Altınbilek", "🎬 Vahide Perçin", "🎬 Selin Yeninci"], a: 0 },
    { s: "'Masumlar Apartmanı'nda Han karakterini kim oynadı? 🧼", opts: ["🎬 Birkan Sokullu", "🎬 Farah Zeynep Abdullah", "🎬 Ezgi Mola"], a: 0 },
    { s: "'Sen Çal Kapımı' dizisinin Serkan Bolat'ı kimdir? 🏗️", opts: ["🎬 Kerem Bürsin", "🎬 Hande Erçel", "🎬 Anıl İlter"], a: 0 },
    { s: "'Fatmagül'ün Suçu Ne?' dizisinde Kerim'i kim oynadı? ⚓", opts: ["🎬 Engin Akyürek", "🎬 Fırat Çelik", "🎬 Beren Saat"], a: 0 },
    { s: "'Karadayı' dizisinin Mahir Kara'sı kimdir? ⚖️", opts: ["🎬 Kenan İmirzalıoğlu", "🎬 Bergüzar Korel", "🎬 Çetin Tekindor"], a: 0 },
    { s: "'Vatanım Sensin'de Cevdet karakterini kim canlandırdı? 🇹🇷", opts: ["🎬 Halit Ergenç", "🎬 Boran Kuzum", "🎬 Bergüzar Korel"], a: 0 },
    { s: "'Leyla ile Mecnun'un Mecnun'u kimdir? 🐲", opts: ["🎬 Ali Atay", "🎬 Serkan Keskin", "🎬 Ahmet Mümtaz Taylan"], a: 0 },
    { s: "'Asmalı Konak'ın Seymen Ağa'sı kimdir? 🍇", opts: ["🎬 Özcan Deniz", "🎬 Nurgül Yeşilçay", "🎬 Selda Alkor"], a: 0 },
    { s: "'Yılan Hikayesi'nde Memoli'yi kim oynadı? 👮", opts: ["🎬 Mehmet Ali Alabora", "🎬 Meltem Cumbul", "🎬 Emre Kınay"], a: 0 },
    { s: "'İstanbullu Gelin'in Faruk Boran'ı kimdir? 🎻", opts: ["🎬 Özcan Deniz", "🎬 Aslı Enver", "🎬 Salih Bademci"], a: 0 },
    { s: "'Sadakatsiz' dizisinde Volkan karakterini kim oynadı? 💍", opts: ["🎬 Caner Cindoruk", "🎬 Cansu Dere", "🎬 Melis Sezen"], a: 0 },
    { s: "'Kızılcık Şerbeti'nde Doğa karakterini kim canlandırıyor? ☕", opts: ["🎬 Sıla Türkoğlu", "🎬 Evrim Alasya", "🎬 Müjde Uzman"], a: 0 },
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
