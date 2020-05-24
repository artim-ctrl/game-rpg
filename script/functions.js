function collides(x, y, r, b, x2, y2, r2, b2) {// проверяем столкновение обьекта с позицией pos и размерами size с обьектом2 с позицией pos2 и размерами size2
    return !(r <= x2 || x > r2 ||
            b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos.x, pos.y,
                    pos.x + size.x, pos.y + size.y,
                    pos2.x, pos2.y,
                    pos2.x + size2.x, pos2.y + size2.y);
}

function collidesWithScreen(pos, size) {
    return boxCollides(pos, size, { x: 0, y: 0 }, { x: window.innerWidth, y: window.innerHeight });
}

function collidesWithDot(pos, size, pos2) {
    return boxCollides(pos, size, pos2, { x: 0, y: 0 });
}

function collidesWithPlayer(pos, size) {
    return boxCollides(pos, size, player.pos, player.size);
}

function distanceWithBox(pos, size, pos2, size2, vector = null) {
    let mid1 = { x: pos.x + size.x / 2, y: pos.y + size.y / 2 },
        mid2 = { x: pos2.x + size2.x / 2, y: pos2.y + size2.y / 2 };

    let coors = { x: mid2.x - mid1.x, y: mid2.y - mid1.y };

    if (vector) {
        vector.x = coors.x;
        vector.y = coors.y;
    }

    return Math.sqrt(coors.x * coors.x + coors.y * coors.y);
}

function distanceWithPlayer(pos, size, vector = null) {
    return distanceWithBox(pos, size, player.pos, player.size, vector);
}