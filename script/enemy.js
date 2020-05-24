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

        for (let i = 0; i < params.possible.length; i++) {
            let elems = params.possible[i].split(':');
            let clas = elems[0],
                obj = window.getVar(elems[1]),
                chance = elems[2];

            let count = 0;
            for (let j = 1; j <= obj.max; j++) {
                if (Math.random() > Math.pow(chance, j)) break;
                count++;
            }
            
            if (count) {
                for (let j = 0; j < this.countSlots; j++) {
                    if (!this.slots[j]) {
                        this.slots[j] = eval('new ' + clas + '(' + JSON.stringify(obj) + ', ' + count + ');');
                        return;
                    }
                }
            }
        }
    }

    update() {
        if (this.HP <= 0) this.die();

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

    hit(k) {
        this.HP -= k;

        if (this.HP < 0) {
            this.HP = 0;
        }
    }

    die() {
        for (let i = 1; i <= 4; i++) {
            if (this === enemies[i]) {
                setTimeout(() => {
                    generateEnemy(i, this.level);
                }, 5000);

                enemies[i] = null;

                this.giveItems();
            }
        }
    }

    giveItems() {
        for (let i = 0; i < this.countSlots; i++) {
            if (!this.slots[i]) continue;

            let pos = {
                x: ((Math.random() > 0.5) ? 1 : -1) * (Math.random() * 10 * scaleAll),
                y: ((Math.random() > 0.5) ? 1 : -1) * (Math.random() * 10 * scaleAll)
            };
            
            this.slots[i].pos = { x: this.pos.x + pos.x, y: this.pos.y + pos.y };
            objs.push(this.slots[i]);
        }
    }
}