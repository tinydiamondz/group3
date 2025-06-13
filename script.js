//game ruless
document.getElementById('gamerules').addEventListener('click', function(){
    showAlert(`
    1. Every 10 in-game minutes, you'll lose all statuses except Health, which decreases by 5% only when Hunger is empty.
    \n2. You can visit different places to perform activities that affect your character's status.
    \n3. If Health reaches zero, it will result in an immediate game over.
    \n4. Time moves faster in-game, where one real-life second equals one in-game minute.
    \n5. When the game clock hits 00:00, the day advances to the next and the date automatically updates.`);
});

//tanggal
function header(){
    const titleDiv = document.querySelector(".localtime");
    const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const now = new Date();
    const namaHari = hari[now.getDay()];
    const tanggal = now.getDate();
    const namaBulan = bulan[now.getMonth()];
    const tahun = now.getFullYear();
    const teksTanggal = `${namaHari}, ${tanggal} ${namaBulan} ${tahun}`;
    if(titleDiv){
        titleDiv.innerText = teksTanggal;
    }
}
window.addEventListener('DOMContentLoaded', header);

//jam real
function realTimeClock(){
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    document.getElementById('clockid').textContent = timeString;
}
setInterval(realTimeClock, 1000);
realTimeClock();

// avatar n button
const avatarList = [
    'img/girl.png', 
    'img/boy.png', 
    'img/skeleton.png', 
    'img/dog.png', 
];

let currentIndex = 0;

function avatarGame(){
    const avatar = document.getElementById('avatar');
    avatar.style.backgroundImage = `url('${avatarList[currentIndex]}')`;
}
document.getElementById('prevBtn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + avatarList.length) % avatarList.length;
    avatarGame();
});
document.getElementById('nextBtn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % avatarList.length;
    avatarGame();
});
window.onload = avatarGame;

//alertt
function startExploring(){
    const username = document.getElementById('username').value;
    const avatar = avatarList[currentIndex];
    if(!username){
        showAlert("Please enter your name!");
        return;
    }
    localStorage.setItem('username', username);
    localStorage.setItem('playerAvatar', avatar);
    window.location.href = 'explore.html';
}
           
//desain alert
function showAlert(message){
    const alertBox = document.getElementById('customAlert');
    alertBox.querySelector('p').textContent = message;
    alertBox.style.display = 'block';
}

function closeAlert(){
    const alertBox = document.getElementById('customAlert');
    alertBox.style.display = 'none';
}