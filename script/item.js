class Item {
    constructor(params, count) {
        this.name = params.name;// название итема
        this.max = params.max;// максимальное количество на слот
        this.sprite = params.sprite;// спрайт (url, pos, size)
        this.count = count;// количество
        this.id = params.id;// идентификатор
        this.description = params.description;// идентификатор
    }

    renderStat() {
        ctx.drawImage(resources.get(this.sprite.url),
            this.sprite.pos.x,
            this.sprite.pos.y,
            this.sprite.size.x,
            this.sprite.size.y,
            this.pos.x + globalTranslation.x, this.pos.y + globalTranslation.y,
            13 * scaleAll, 13 * scaleAll
        );
    }
}

class Food extends Item {
    constructor(params, count) {
        super(params, count);

        this.timeout = params.timeout;// время восстановления
        this.HP = params.HP;// сколько HP добавляет при сьедении
        
        this.using = false;
    }

    use(i) {
        if (!usingFood) {
            usingFood = true;

            this.count--;
            player.addHP(this.HP);

            setTimeout(() => {
                usingFood = false;
            }, this.timeout);

            if (this.count == 0) {
                player.minSlots[i] = null;
            }
            hood.setMinPlayerInventory();
        }
    }
}

class Weapon extends Item {
    constructor(params, count) {
        super(params, count);

        this.timeout = params.timeout;// время восстановления
        this.HP = params.HP;// сколько HP отнимает при ударе

        this.pos = params.pos;
        this.size = params.size;

        this.frame = 0;// Текущий кадр
        this._index = 0;// для вычисления кадра
        this.stay = true;
    }

    use(i) {
        let weapon_was = player.weapon;

        player.setWeapon(this);

        player.minSlots[i] = null;

        if (weapon_was) player.minSlots[i] = weapon_was;

        hood.setMinPlayerInventory();
    }

    bump() {
        this.stay = false;

        for (let i = 1; i <= 4; i++) {
            let tranX = (player.currAnim == 'left' || player.currAnim == 'up') ? this.size.x : 0;
            if ((enemies[i] instanceof Enemy) && boxCollides({ x: enemies[i].pos.x + globalTranslation.x, y: enemies[i].pos.y + globalTranslation.y}, enemies[i].size, { x: this.pos.x + player.pos.x - tranX, y: this.pos.y + player.pos.y}, this.size)) {
                if (this.using) return;
                
                enemies[i].hit(this.HP);

                setTimeout(() => {
                    this.using = false;
                }, this.timeout);

                this.using = true;
                return;
            }
        }
    }

    render() {
        this._index += dt * this.sprite.anim.speed;// считаем кадр
        this.frame = this.sprite.anim.frames[Math.floor(this._index) % this.sprite.anim.frames.length];
        
        // считаем какой кадр анимации воспроизвести
        let x = 0;
        
        if (!this.stay)// если не стоит на месте, то проигрываем анимацию
            x += this.sprite.anim.pos.x + this.frame * this.sprite.anim.size.x;

        let pos = {
            x: this.pos.x + player.pos.x
        };

        if (player.currAnim == 'left' || player.currAnim == 'up') {
            ctx.setTransform(-1, 0, 0, 1, 0, 0);
            pos.x = -pos.x;
        }

        // рисуем кадр
        ctx.drawImage(resources.get(this.sprite.url),
            x,
            this.sprite.anim.pos.y,
            this.sprite.anim.size.x,
            this.sprite.anim.size.y,
            pos.x, this.pos.y + player.pos.y,
            this.size.x, this.size.y
        );
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        if (this.frame == this.sprite.anim.frames.length - 1) this.stay = true;
    }
}