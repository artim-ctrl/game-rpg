"use strict";

let usingFood = false;// флаг, true если игрок сьел пищу и сейчас тикает таймер

let enemies = {
    1: null,
    2: null,
    3: null,
    4: null
};

let win = false;

let objs = [];

function main() {
    dt = (Date.now() - lastTime) || 1;// чтоб ыне было бага если время кадра слишком низкое (равно 0)

    if (player.HP <= 0) {
        die();
        return;
    }

    if (win) {
        winning();
        return;
    }

    handleInput();// ввод с клавиатуры или мыши

    update();// просчет следующего кадра
    render();// отрисовка следующего кадра

    lastTime = Date.now();

    requestAnimationFrame(main);
}

function handleInput() {
    if (input.isPressed('s') || input.isPressed('down')) {
        player.translation.y += dt * player.speed;

        if (globalTranslation.y != -(endPos.y - window.innerHeight) && (player.pos.y + player.translation.y + player.size.y) > window.innerHeight - indentMap) {
            globalTranslation.y -= player.translation.y;
            player.translation.y = 0;
        }

        if (-globalTranslation.y > endPos.y - window.innerHeight) {
            globalTranslation.y = -(endPos.y - window.innerHeight);
        }

        hood.showPlayerInventoryParam(false);
    }
    
    if (input.isPressed('w') || input.isPressed('up')) {
        player.translation.y -= dt * player.speed;

        if (globalTranslation.y != 0 && (player.pos.y + player.translation.y) < indentMap) {
            globalTranslation.y -= player.translation.y;
            player.translation.y = 0;
        }

        if (globalTranslation.y > 0) {
            globalTranslation.y = 0;
        }

        hood.showPlayerInventoryParam(false);
    }
    
    if (input.isPressed('a') || input.isPressed('left')) {
        player.translation.x -= dt * player.speed;

        if (globalTranslation.x != 0 && (player.pos.x + player.translation.x) < indentMap) {
            globalTranslation.x -= player.translation.x;
            player.translation.x = 0;
        }

        if (globalTranslation.x > 0) {
            globalTranslation.x = 0;
        }

        hood.showPlayerInventoryParam(false);
    }
    
    if (input.isPressed('d') || input.isPressed('right')) {
        player.translation.x += dt * player.speed;

        if (globalTranslation.x != -(endPos.x - window.innerWidth) && (player.pos.x + player.translation.x + player.size.x) > window.innerWidth - indentMap) {
            globalTranslation.x -= player.translation.x;
            player.translation.x = 0;
        }

        if (-globalTranslation.x > endPos.x - window.innerWidth) {
            globalTranslation.x = -(endPos.x - window.innerWidth);
        }

        hood.showPlayerInventoryParam(false);
    }

    // ограничение сокрости по диагонали
    // if (player.translation.x && player.translation.y) {
    //     let speed = Math.sqrt(Math.pow(player.translation.x, 2) / 2);
    //     player.translation.x = speed * (player.translation.x / (Math.abs(player.translation.x)));
    //     player.translation.y = speed * (player.translation.y / (Math.abs(player.translation.y)));
    // }

    checkCollisions();
}

function die() {
    hood.renderDeath();
}

function winning() {
    hood.renderWin();
}

function update() {
    player.update();

    // апдейтим врагов
    for (let i = 1; i <= 4; i++) {
        if (enemies[i] instanceof Enemy) enemies[i].update();
    }
}

function render() {
    map.render();// рисуем карту

    objs.forEach(obj => {
        obj.renderStat();
    });

    player.render();// рисуем перса

    if (player.weapon) player.weapon.render();

    // рисуем врагов
    for (let i = 1; i <= 4; i++) {
        if (enemies[i] instanceof Enemy) enemies[i].render(true);
    }

    hood.render();// рисуем худ
}

function checkCollisions() {
    checkCollisionsWithEnds();
}

function checkCollisionsWithEnds() {
    if (player.pos.x + player.translation.x <= 0) {// левый конец карты
        player.pos.x = 0;
        player.translation.x = 0;
    } else if (player.pos.x + player.translation.x + player.size.x >= window.innerWidth) {
        player.pos.x = window.innerWidth - player.size.x;
        player.translation.x = 0;
    }
    if (player.pos.y + player.translation.y <= 0) {// верхний конец карты
        player.pos.y = 0;
        player.translation.y = 0;
    } else if (player.pos.y + player.translation.y + player.size.y >= window.innerHeight) {
        player.pos.y = window.innerHeight - player.size.y;
        player.translation.y = 0;
    }
}

function generateEnemies() {
    enemies[1] = new Enemy(window.getVar('enemy.level_1'));
    enemies[1].pos = { x: startEnemyPos[1].x, y: startEnemyPos[1].y };

    enemies[2] = new Enemy(window.getVar('enemy.level_1'));
    enemies[2].pos = { x: startEnemyPos[2].x - enemies[2].size.x, y: startEnemyPos[2].y };

    enemies[3] = new Enemy(window.getVar('enemy.level_1'));
    enemies[3].pos = { x: startEnemyPos[3].x, y: startEnemyPos[3].y - enemies[3].size.y };

    enemies[4] = new Enemy(window.getVar('enemy.level_1'));
    enemies[4].pos = { x: startEnemyPos[4].x - enemies[4].size.x, y: startEnemyPos[4].y - enemies[4].size.y };
}

function takeItem() {
    for (let i = 0; i < objs.length; i++) {
        let obj = objs[i];

        if (!collidesWithPlayer({ x: obj.pos.x + globalTranslation.x, y: obj.pos.y + globalTranslation.y }, { x: 13 * scaleAll, y: 13 * scaleAll })) continue;

        for (let j = 0; j < player.countSlots; j++) {
            if (player.slots[j]) {
                if (player.slots[j].id == obj.id) {
                    if (player.slots[j].max >= player.slots[j].count + obj.count) {
                        player.slots[j].count += obj.count;
                        objs.splice(i, 1);
                        hood.setPlayerInventory(hood.invIsActive());
                        return;
                    } else {
                        let count = obj.count + player.slots[j].count - player.slots[j].max;
                        obj.count = count;
                        player.slots[j].count = player.slots[j].max;
                        hood.setPlayerInventory(hood.invIsActive());
                    }
                }
            } else {
                player.slots[j] = obj;
                objs.splice(i, 1);
                hood.setPlayerInventory(hood.invIsActive());
                return;
            }
        }
    }
}

function generateEnemy(i, level) {
    if (!window.varExist('enemy.level_' + level)) {
        enemies[i] = true;
        checkWin();
        return;
    }

    enemies[i] = new Enemy(window.getVar('enemy.level_' + level));
                    
    enemies[i].pos = { x: startEnemyPos[i].x, y: startEnemyPos[i].y };

    switch(i) {
        case 2:
            enemies[i].pos.x -= enemies[i].size.x;
            break;
        case 3:
            enemies[i].pos.y -= enemies[i].size.y;
            break;
        case 3:
            enemies[i].pos.x -= enemies[i].size.x;
            enemies[i].pos.y -= enemies[i].size.y;
            break;
    }
}

function checkWin() {
    for (let i = 1; i <= 4; i++) {
        if (enemies[i] !== true) {
            win = false;
            return;
        }
    }
    win = true;
}