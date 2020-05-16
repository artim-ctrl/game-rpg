class Player extends GameObject {
    constructor(params) {
        super(params);

        // переменная сдвига на следующем кадре
        this.translation = { x: 0, y: 0 };
        this.speed = params.speed;

        // запоминает globalTranslation прошлого кадра, сравнивает с текущим и если не равны позволяет анимации проигрываться
        this.lastgt = { x: 0, y: 0 };
    }

    update() {
        this.pos.x += this.translation.x;
        this.pos.y += this.translation.y;

        if (this.lastgt.x == globalTranslation.x && this.lastgt.y == globalTranslation.y)
            this.stay = true;

        // анимация
        if (this.translation.y > 0) {
            this.currAnim = 'down';
            this.stay = false;
        } else if (this.translation.y < 0) {
            this.currAnim = 'up';
            this.stay = false;
        }

        if (this.translation.x > 0) {
            this.currAnim = 'right';
            this.stay = false;
        } else if (this.translation.x < 0) {
            this.currAnim = 'left';
            this.stay = false;
        }
        
        this.translation = { x: 0, y: 0 };

        this.lastgt = { x: globalTranslation.x, y: globalTranslation.y };
    }
}