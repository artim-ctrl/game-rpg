class GameObject {
    constructor(params) {
        // основные переменные
        this.pos = params.pos;// позиция в реальном мире
        this.size = params.size;// размеры в реальном мире
        this.sprite = params.sprite;// анимация, ссылка на спрайт, позиция и размеры на спрайтеs
        this.stayFrame = params.stayFrame;// анимация "стояния на месте"
        this.stay = true;// проигрывается анимация или нет

        // меняющиеся переменные
        this.currAnim = 'down';// текущая анимация
        this.frame = 0;// Текущий кадр
        this._index = 0;// для вычисления кадра
    }

    update() {
        
    }

    render(globTran = false) {// отрисовка обьекта
        let gt = { x: 0, y: 0 };

        if (globTran) gt = globalTranslation;
        
        if (!collidesWithScreen({ x: this.pos + gt.x, y: this.pos.y + gt.y }, this.size)) return;// не рисуем то, что находится за картой

        this._index += dt * this.sprite.anim[this.currAnim].speed;// считаем кадр
        this.frame = this.sprite.anim[this.currAnim].frames[Math.floor(this._index) % this.sprite.anim[this.currAnim].frames.length];
        
        // считаем какой кадр анимации воспроизвести
        let x = this.sprite.anim[this.currAnim].pos.x;
        
        if (!this.stay)// если не стоит на месте, то проигрываем анимацию
            if (this.sprite.anim[this.currAnim].frames.length)// если нет анимации
                x += this.sprite.anim[this.currAnim].pos.x + this.frame * this.sprite.anim[this.currAnim].size.x;
            else
                x = this.stayFrame * this.sprite.anim[this.currAnim].size.x;
        else
            x = this.stayFrame * this.sprite.anim[this.currAnim].size.x;

        // рисуем кадр
        ctx.drawImage(resources.get(this.sprite.url),
            x,
            this.sprite.anim[this.currAnim].pos.y,
            this.sprite.anim[this.currAnim].size.x,
            this.sprite.anim[this.currAnim].size.y,
            this.pos.x + gt.x, this.pos.y + gt.y,
            this.size.x, this.size.y
        );
    }
}