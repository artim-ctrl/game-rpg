class Player {
	constructor(spriteUrl, pos, anims, speed, translation, size, maxHP, countSlots, stay = false) {
		this.spriteUrl = spriteUrl;// ссылка на спрайт
		this.animations = anims;// массив с анимациями
		this.pos = pos;// позиция на холсте
		this.speed = speed;// скорость передвижения
		this.translation = translation;// сдвиг на след кадре
		this.stay = stay;// флаг (перс стоит на месте или нет)
		this.size = size;// размер перса на холсте
		this._index = 0;// для вычисления кадра
		this.frame = 0;// текущий кадр
		this.currentAnim= "down";// текущая анимация
		this.HP = maxHP;// здоровье при создании перса = максимальному
		this.maxHP = maxHP;//максимальное здоровье перса
		this.countSlots = countSlots;// максимальное количество слотов собственного инвентаря игрока
		this.slots = [];// конкретно слоты занятые чем-либо
		this.currentWeapon = undefined;// выбранное оружие
		this.timeWeaponReduction = 0;// задержка удара оружием
	}

	update(dt) {
		this.pos[0] += this.translation[0];// сдвигаем игрока
		this.pos[1] += this.translation[1];

		this._index += dt * this.animations[this.currentAnim].speed;// считаем кадр
		this.frame = this.animations[this.currentAnim].frames[Math.floor(this._index) % this.animations[this.currentAnim].frames.length];

		this.translation = [0, 0];// обнуляем сдвиг
	}

	render(ctx) {// отрисовка перса
		let x = this.animations[this.currentAnim].pos[0];

		if (!this.stay) {
			x += this.frame * this.animations[this.currentAnim].size[0];
		} else {
			x = 1 * this.animations[this.currentAnim].size[0];
		}

		ctx.drawImage(resources.get(this.spriteUrl),
			x,
			this.animations[this.currentAnim].pos[1],
			this.animations[this.currentAnim].size[0],
			this.animations[this.currentAnim].size[1],
			this.pos[0], this.pos[1],
			this.size[0], this.size[1]
		);

		if (this.currentWeapon) {
			// рисуем свою пушку
			let indent = 18;

			if (this.currentAnim == "right" || this.currentAnim == "down") {
				ctx.drawImage(resources.get(this.currentWeapon.spriteURL),
							this.currentWeapon.pos[0], this.currentWeapon.pos[1],
							this.currentWeapon.size[0], this.currentWeapon.size[1],
							this.pos[0] + this.size[0],
							this.pos[1] + this.size[1] / 2 - this.currentWeapon.size[1] / 2,
							this.currentWeapon.size[0] * this.scaleAll, this.currentWeapon.size[1] * this.scaleAll);
			} else {
				ctx.setTransform(-1, 0, 0, 1, 0, 0);
				ctx.drawImage(resources.get(this.currentWeapon.spriteURL),
							this.currentWeapon.pos[0], this.currentWeapon.pos[1],
							this.currentWeapon.size[0], this.currentWeapon.size[1],
							-(this.pos[0]),
							this.pos[1] + this.size[1] / 2 - this.currentWeapon.size[1] / 2,
							this.currentWeapon.size[0] * this.scaleAll, this.currentWeapon.size[1] * this.scaleAll);
				ctx.setTransform(1, 0, 0, 1, 0, 0);
			}
		}
	}

	setItem(item, count) {
		let slot = {
			count: count,
			item: item
		}
		this.slots.push(slot);
	}

	hit(hp) {
		this.HP -= hp;
	}

	addHP(k) {// прибавляем HP
		this.HP += k;
		this.HP = this.HP > this.maxHP ? this.maxHP : this.HP;
	}
}
