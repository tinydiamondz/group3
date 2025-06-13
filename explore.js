let gameDay = 1;
let gameDate = new Date(); // tanggal dalam game
let gameHours = gameDate.getHours();
let gameMinutes = gameDate.getMinutes();
let decreaseMinute = 0;

function header(){
    const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    
    const namaHari = hari[gameDate.getDay()];
    const tanggal = gameDate.getDate();
    const namaBulan = bulan[gameDate.getMonth()];
    const tahun = gameDate.getFullYear();

    const teksTanggal = `${namaHari}, ${tanggal} ${namaBulan} ${tahun}`;
    const dayDiv = document.getElementById("dayid");
    if(dayDiv){
        dayDiv.innerText = `Day ${gameDay}`;
    }
    const dateDiv = document.getElementById("dateid");
    if(dateDiv){
        dateDiv.innerText = teksTanggal;
    }
}

// jam real-time
function realTimeClock(){
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    const clockDiv = document.getElementById("clockid");
    if(clockDiv){
        clockDiv.textContent = timeString;
    }
}
window.addEventListener('DOMContentLoaded', () => {
    header();
});

// greeting
function greetingPlayer(){
    const now = new Date();
    const hour = now.getHours();
    let greeting = '';
    if(hour >= 5 && hour < 12){
        greeting = 'Good Morning';
    } else if(hour >= 12 && hour < 17){
        greeting = 'Good Afternoon';
    } else if(hour >= 17 && hour < 21){
        greeting = 'Good Evening';
    } else{
        greeting = 'Good Night';
    }
    const username = localStorage.getItem('username') || 'Player';
    showAlert(`${greeting}, ${username}!`, 'greeting');
    document.getElementById('greetingid').innerHTML = `${greeting}, ${username}!`;
}
greetingPlayer();

function showAlert(message, type = 'greeting'){
    const alertBox = document.getElementById('customAlert');
    alertBox.querySelector('p').innerHTML = message;     
    const buttonsContainer = alertBox.querySelector('.alert-buttons');
    buttonsContainer.innerHTML = ''; // kosongin dulu
    if(type === 'greeting'){
        // cuma tombol OK
        const okBtn = document.createElement('button');
        okBtn.textContent = 'OK';
        okBtn.onclick = closeAlert;
        buttonsContainer.appendChild(okBtn);
    } else if(type === 'gameover'){
        // tombol restart Game
        const restartBtn = document.createElement('button');
        restartBtn.textContent = 'Restart';
        restartBtn.classList.add('btn-restart');
        restartBtn.onclick = restartGame;
        buttonsContainer.appendChild(restartBtn);
        //back to menu
        const backMenu = document.createElement('button');
        backMenu.textContent = 'Back to menu';
        backMenu.onclick = () => window.location.href = 'home.html';      
        buttonsContainer.appendChild(backMenu);
    }
    alertBox.style.display = 'block';
}

function closeAlert(){
    const alertBox = document.getElementById('customAlert');
    alertBox.style.display = 'none';
    startGameClock();
}

function startGameClock(){
    decreaseMinute = gameHours *10 + gameMinutes;
    clock = setInterval(gameClock, 1000);
}

function restartGame(){
    window.location.href = 'explore.html';
}

let stats = {
    health: 50,
    hygiene: 50,
    stamina: 50,
    hunger: 50,
    happiness: 50,
    money: 20,
}

function barSize(value){
    return Math.min(100, Math.max(0, value));
}

function statsBar(){
    document.querySelector('.fill.health').style.width = `${stats.health}%`;
    document.querySelector('.fill.hygiene').style.width = `${stats.hygiene}%`;
    document.querySelector('.fill.stamina').style.width = `${stats.stamina}%`;
    document.querySelector('.fill.hunger').style.width = `${stats.hunger}%`;
    document.querySelector('.fill.happiness').style.width = `${stats.happiness}%`;
    document.getElementById('money').textContent = `💰$${stats.money}`;
}
document.getElementById('clockid').textContent = `${gameHours.toString().padStart(2, '0')}:${gameMinutes.toString().padStart(2, '0')}`;
statsBar();

function gameClock(){
    gameMinutes += 1;
    if(gameMinutes >= 60){
        gameMinutes = 0;
        gameHours += 1;
    }
    if(gameHours >= 24){
        gameHours = 0;
        gameMinutes = 0;
        gameDay += 1;
        gameDate.setDate(gameDate.getDate() + 1);
        header();
    }
    const totalCurrentMinutes = gameHours *10 + gameMinutes;
    const diff = totalCurrentMinutes - decreaseMinute;
    if(diff >= 10 || diff < 0){
        stats.hygiene = barSize(stats.hygiene - 1);
        stats.stamina = barSize(stats.stamina - 5);
        stats.hunger = barSize(stats.hunger - 5);
        stats.happiness = barSize(stats.happiness - 2);
        statsBar();
        decreaseMinute = totalCurrentMinutes;
    }
    if(stats.hunger <= 0){
        stats.health = barSize(stats.health - 5); // turunin 5 kalau hunger 0
        statsBar();
    }
    const hoursStr = gameHours.toString().padStart(2, '0');
    const minutesStr = gameMinutes.toString().padStart(2, '0');
    document.getElementById('clockid').textContent = `${hoursStr}:${minutesStr}`;

    //game overnya disini
    if(stats.health <= 0){
        clearInterval(clock); // stop clock
        showAlert("Game Over!<br>You ran out of health.", 'gameover')  
        window.gameOver = true; //stop animasi gamenya  
    }
}

function applyActivityEffect(effects) {
    for (let stat in effects) {
        if (stats.hasOwnProperty(stat)) {
            stats[stat] = barSize(stats[stat] + effects[stat]);
        }
    }
    statsBar();
    closeAlert(); // Tutup pop-up setelah klik
}



