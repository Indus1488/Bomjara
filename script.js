// Начальные параметры
let health = 100;
let hunger = 100; // 100 - сыт, 0 - голоден
let energy = 100;
let money = 0;
let bottles = 0;
let age = 17;

const logBox = document.getElementById('log');

// Функция для вывода текста в лог
function log(message) {
    const p = document.createElement('p');
    p.textContent = message;
    logBox.appendChild(p);
    logBox.scrollTop = logBox.scrollHeight; // Автоскролл вниз
}

// Функция обновления интерфейса (полоски и цифры)
function updateUI() {
    document.getElementById('health-bar').style.width = health + '%';
    document.getElementById('hunger-bar').style.width = hunger + '%';
    document.getElementById('energy-bar').style.width = energy + '%';
    
    document.getElementById('age').textContent = age;
    document.getElementById('money').textContent = money;
    document.getElementById('bottles').textContent = bottles;
}

// Функция проверки на смерть
function checkDeath() {
    if (health <= 0) {
        log("Вы умерли от истощения. Игра окончена.");
        return true;
    }
    return false;
}

// Действия
function actionGarbage() {
    if (energy < 10) { log("Вы слишком устали, чтобы копаться в мусоре."); return; }
    
    energy -= 10;
    hunger -= 5;
    
    let found = Math.floor(Math.random() * 3); // 0, 1 или 2
    if (found === 0) {
        log("Вы ничего не нашли на помойке.");
    } else if (found === 1) {
        bottles += 1;
        log("Вы нашли 1 бутылку.");
    } else {
        bottles += 2;
        money += 5;
        log("Вы нашли 2 бутылки и 5 рублей!");
    }
    updateUI();
}

function actionBeg() {
    if (energy < 5) { log("Нет сил даже просить."); return; }
    
    energy -= 5;
    hunger -= 2;
    
    let luck = Math.random();
    if (luck > 0.7) {
        money += 20;
        log("Сердобольная бабушка дала вам 20 рублей.");
    } else if (luck > 0.3) {
        money += 5;
        log("Вам подали 5 рублей.");
    } else {
        health -= 10;
        log("Вас прогнал охранник. -10 к здоровью.");
    }
    updateUI();
    checkDeath();
}

function actionWork() {
    if (bottles === 0) {
        log("У вас нет бутылок, чтобы их сдать.");
        return;
    }
    let earned = bottles * 2; // 2 рубля за бутылку
    money += earned;
    log(`Вы сдали ${bottles} бутылок и получили ${earned} рублей.`);
    bottles = 0;
    updateUI();
}

function actionEat() {
    if (money < 10) {
        log("У вас нет денег на еду.");
        return;
    }
    money -= 10;
    hunger += 30;
    if (hunger > 100) hunger = 100;
    log("Вы купили шаурму и наелись. Вкусно!");
    updateUI();
}

function actionSleep() {
    energy += 40;
    if (energy > 100) energy = 100;
    hunger -= 20;
    log("Вы поспали в теплотрассе. Энергия восстановлена, но вы проголодались.");
    updateUI();
    
    // Случайное событие
    if (Math.random() > 0.8) {
        money -= 10;
        if (money < 0) money = 0;
        log("Пока вы спали, у вас украли 10 рублей.");
        updateUI();
    }
}

// Ежедневное обновление (добавим простую кнопку "Прожить день" позже, а пока просто проверим голод)
setInterval(() => {
    hunger -= 1;
    if (hunger <= 0) {
        health -= 5;
        if (hunger < 0) hunger = 0;
    }
    updateUI();
    checkDeath();
}, 5000); // Каждые 5 секунд голод уменьшается

updateUI();