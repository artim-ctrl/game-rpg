class Player extends GameObject {
    constructor(params) {
        super(params);

        // переменная сдвига на следующем кадре
        this.translation = { x: 0, y: 0 };
        this.speed = params.speed;

        // запоминает globalTranslation прошлого кадра, сравнивает с текущим и если не равны позволяет анимации проигрываться
        this.lastgt = { x: 0, y: 0 };

        // здоровье
        this.maxHP = params.maxHP;
        this.HP = this.maxHP;

        // перс в роли ящика
        this.countSlots = 7;
        this.slots = {};
        this.countMinSlots = 4;
        this.minSlots = {};

        for (let i = 0; i < this.countMinSlots; i++) {
            this.minSlots[i] = null;
        }

        for (let i = 0; i < this.countSlots; i++) {
            this.slots[i] = null;
        }

        this.slots[0] = new Food(window.getVar('food.meet_pig'), 2);

        this.slots[1] = new Food(window.getVar('food.meet_pig'), 5);

        this.slots[2] = new Food(window.getVar('food.meet_pig'), 6);
    }

    update() {
        this.pos.x += this.translation.x;
        this.pos.y += this.translation.y;

        this.stay = true;

        // анимация
        if (this.translation.y > 0 || this.lastgt.y > globalTranslation.y) {
            this.currAnim = 'down';
            this.stay = false;
        } else if (this.translation.y < 0 || this.lastgt.y < globalTranslation.y) {
            this.currAnim = 'up';
            this.stay = false;
        }

        if (this.translation.x > 0 || this.lastgt.x > globalTranslation.x) {
            this.currAnim = 'right';
            this.stay = false;
        } else if (this.translation.x < 0 || this.lastgt.x < globalTranslation.x) {
            this.currAnim = 'left';
            this.stay = false;
        }
        
        this.translation = { x: 0, y: 0 };

        this.lastgt = { x: globalTranslation.x, y: globalTranslation.y };
    }

    addHP(k) {
        player.HP += k;

        if (player.HP > player.maxHP) {
            player.HP = player.maxHP;
        }
    }
}