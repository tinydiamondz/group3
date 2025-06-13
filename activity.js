const activities = {    
    temple: [
        {name: "Pray", effect: {happiness: +10, hygiene: +10, health: +10, stamina: +5, hunger: -3}},
        {name: "Clean the Temple", effect: {hygiene: +10, stamina: +10, happiness: -10, hunger: -10}},
        {name: "Donate", effect: {stamina: -5, money: -10, happiness: +20, hunger: -8}}
    ],
    house: [
        {name: "Sleep", effect: {stamina: +20, health: +10, hunger: -15}},
        {name: "Eat", effect: {hunger: +20, health: +10, happiness: +5, hygiene: -10}},
        {name: "Shower", effect: {hygiene: +20, happiness: +5, stamina: -5}},
        {name: "Work from Home", effect: {money: +20, stamina: -15, hygiene: -10, hunger: -25}},
        {name: "Play games/social media", effect: {happiness: +15, hunger: -5, money: -5}}
    ],
    lake: [
        {name: "Relax by the Water", effect: {happiness: +20, stamina: -10, health: +5, hygiene: -10}},
        {name: "Fishing", effect: {hunger: +10, happiness: +10, stamina: -10, money: +10}}
    ],
    forest: [
        {name: "Camping", effect: {hunger: +10, stamina: +10, happiness: +20, hygiene: -10}},
        {name: "Hunting", effect: {hunger: -15, health: -15, stamina: -30, hygiene: -10, money: +50}}
    ],
    market: [
        {name: "Shopping", effect: {hunger: +10, happiness: +10, money: -20}},
        {name: "Sell Goods", effect: {money: +20, stamina: -10}},
        {name: "Street Food", effect: {hunger: +15, happiness: +5, money: -10}}
]};

function showActivity(zone){    
    const panel = document.getElementById("activityPanel");
    const title = document.getElementById("zoneTitle");
    const buttons = document.getElementById("activityButtons");
    panel.style.display = "block";
    title.textContent = zone.charAt(0).toUpperCase() + zone.slice(1);
    buttons.innerHTML = '';

    activities[zone].forEach(activity => {        
        const btn = document.createElement("button");
        btn.innerText = activity.name;
        btn.onclick = () => {
            console.log("Activity clicked:", activity.name);            
            updateStats(activity.effect);
            panel.style.display = "none";
        };
        buttons.appendChild(btn);
});}

function updateStats(effect){    
    for (let stat in effect){        
        const bar = document.querySelector(`.fill.${stat}`);
        if(bar){            
            let currentWidth = parseFloat(bar.style.width) || 0;
            let newVal = currentWidth + effect[stat];
            bar.style.width = Math.max(0, Math.min(100, newVal)) + "%";
        } else if(stat === "money"){            
            const moneyDisplay = document.querySelector(".money");
            const currentMoney = parseInt(moneyDisplay.textContent.replace("💰", ""));
            moneyDisplay.textContent = `💰${Math.max(0, currentMoney + effect[stat])}`;
        }
}}
