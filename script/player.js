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

        // оружие
        this.weapon = null;

        // перс в роли ящика
        this.countSlots = params.countSlots;
        this.slots = {};
        this.countMinSlots = params.countMinSlots;
        this.minSlots = {};

        for (let i = 0; i < this.countMinSlots; i++) {
            this.minSlots[i] = null;
        }

        for (let i = 0; i < this.countSlots; i++) {
            this.slots[i] = null;
        }

        this.slots[0] = new Food(window.getVar('food.meet_pig'), 10);

        this.slots[4] = new Weapon(window.getVar('weapon.igril'), 1);
    }

    update() {
        // ограничение сокрости по диагонали
        if ((this.translation.x || this.lastgt.x != globalTranslation.x) && (this.translation.y || this.lastgt.y != globalTranslation.y)) {
            let speed = Math.sqrt(Math.pow(this.translation.x || this.translation.y, 2) / 2);
            this.translation.x = speed * ((this.translation.x / (Math.abs(this.translation.x))) || 0);
            this.translation.y = speed * ((this.translation.y / (Math.abs(this.translation.y))) || 0);
        }

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

    hit(k) {
        this.HP -= k;

        if (this.HP < 0) {
            this.HP = 0;
        }
    }

    setWeapon(weapon) {
        this.weapon = weapon;

        this.weapon.pos.x = this.size.x / 2;
        this.weapon.pos.y = this.size.y / 2 - this.weapon.size.y / 2;
    }
}