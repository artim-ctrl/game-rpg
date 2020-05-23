class Item {
    constructor(params, count) {
        this.name = params.name;// название итема
        this.max = params.max;// максимальное количество на слот
        this.sprite = params.sprite;// спрайт (url, pos, size)
        this.count = count;// количество
        this.id = params.id;// идентификатор
        this.description = params.description;// идентификатор
    }
}

class Food extends Item {
    constructor(params, count) {
        super(params, count);

        this.timeout = params.timeout;// время восстановления
        this.HP = params.HP;// сколько HP добавляет при сьедении
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