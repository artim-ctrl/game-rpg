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