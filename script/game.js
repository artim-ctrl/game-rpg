"use strict";

let _objects = {};

function main() {
    dt = (Date.now() - lastTime) || 1;// чтоб ыне было бага если время кадра слишком низкое (равно 0)

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
    }

    // ограничение сокрости по диагонали
    if (player.translation.x && player.translation.y) {
        let speed = Math.sqrt(Math.pow(player.translation.x, 2) / 2);
        player.translation.x = speed * (player.translation.x / (Math.abs(player.translation.x)));
        player.translation.y = speed * (player.translation.y / (Math.abs(player.translation.y)));
    }

    checkCollisions();
}

function update() {
    player.update();
}

function render() {
    map.render();// рисуем карту

    player.render();// рисуем перса
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