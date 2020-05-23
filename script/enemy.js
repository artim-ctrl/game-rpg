class Enemy extends GameObject {
    constructor(params) {
        super(params);

        // переменная сдвига на следующем кадре
        this.translation = { x: 0, y: 0 };
        this.speed = params.speed;

        // здоровье
        this.maxHP = params.maxHP;
        this.HP = this.maxHP;

        // итемы врага
        this.countSlots = params.countSlots;
        this.slots = {};

        for (let i = 0; i < this.countSlots; i++) {
            this.slots[i] = null;
        }

        // наносимый урон
        this.hitHP = params.hitHP;

        // флаг, тикает ли таймер после удара
        this.hiting = false;
        this.timeoutHit = params.timeoutHit;

        // расстояние на котором враг видит игрока и идет к нему
        this.distance = params.distance;

        // уровень врага
        this.level = params.level;
    }

    update() {
        // ограничение сокрости по диагонали
        if (this.translation.x && this.translation.y) {
            let speed = Math.sqrt(Math.pow(this.translation.x || this.translation.y, 2) / 2);
            this.translation.x = speed * ((this.translation.x / (Math.abs(this.translation.x))) || 0);
            this.translation.y = speed * ((this.translation.y / (Math.abs(this.translation.y))) || 0);
        }

        this.pos.x += this.translation.x;
        this.pos.y += this.translation.y;

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
            this.currAnim = 'down';
            this.stay = false;
        } else if (this.translation.x < 0) {
            this.currAnim = 'down';
            this.stay = false;
        }
        
        this.translation = { x: 0, y: 0 };

        let vector = { x: null, y: null };
        let distance = distanceWithPlayer({ x: this.pos.x + globalTranslation.x, y: this.pos.y + globalTranslation.y }, this.size, vector);

        if (distance <= this.distance) {
            if ((distance <= this.distance / 3) && collidesWithPlayer({ x: this.pos.x + globalTranslation.x, y: this.pos.y + globalTranslation.y }, this.size)) {
                if (!this.hiting) {
                    player.hit(this.hitHP);
    
                    setTimeout(() => {
                        this.hiting = false;
                    }, this.timeoutHit);
        
                    this.hiting = true;
                }
            } else {
                // идем к игроку
                this.translation.x += (vector.x / Math.abs(vector.x)) * dt * this.speed;
                this.translation.y += (vector.y / Math.abs(vector.y)) * dt * this.speed;
            }
        }
    }
}