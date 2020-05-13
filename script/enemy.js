class Enemy extends Player {
	constructor(spriteUrl, pos, anims, speed, translation, size, maxHP, countSlots, hitHP, reductionHitTime, stay) {
		super(spriteUrl, pos, anims, speed, translation, size, maxHP, countSlots, stay);
		this.hitHP = hitHP;
		this.reductionHitTime = reductionHitTime;
		this.currReductionTime = 0;
	}

	// нужно добавить ИИ
	update(dt, player, enemy, box) {
		// если HP меньше 0 враг умирает
		if (this.HP <= 0) {
			for (let i = 0; i < enemy.length; i++) {
				if (enemy[i] === this) {// удаляем

					// создаем box на месте смерти перса
					box.push( new Box(
						enemy[i].countSlots,
						{// спрайт
						url: "source/box.png",
						pos: [0, 0],
						size: [24, 24]
						},
						[Math.floor(enemy[i].pos[0] / map.sizeBlock),
						Math.floor(enemy[i].pos[1] / map.sizeBlock)],
						[24 * player.scaleAll, 24 * player.scaleAll],
						enemy[i].slots
					) );

					enemy.splice(i, 1);// удаляем врага
					return;
				}
			}
		}

		// уменьшаем время восстановления удара
		if (this.currReductionTime > 0) {
			this.currReductionTime -= dt;
		} else if (this.currReductionTime < 0) {
			this.currReductionTime = 0;
		}

		// середины игрока и врага (данного)
		let midPlayer = [player.pos[0] + player.size[0] / 2, player.pos[1] + player.size[1] / 2];
		let midEnemy = [this.pos[0] + player.globalTranslation[0] + this.size[0] / 2,
						this.pos[1] + player.globalTranslation[1] + this.size[1] / 2];

		// координаты врага относительно игрока
		let vectorToPlayer = [midPlayer[0] - midEnemy[0], midPlayer[1] - midEnemy[1]];

		let distance = Math.sqrt(Math.pow(vectorToPlayer[0], 2) + Math.pow(vectorToPlayer[1], 2));
		// если расстнояние между игроком и врагом меньше заданного
		if (distance < 200) {
			// если расстояние меньше "расстояния удара"
			if (distance < 50) {
				this.stay = true;

				if (this.currReductionTime == 0) {
					// бьем игрока
					player.hit(this.hitHP);

					// чтобы шкала не уходила в минус
					if (player.HP < 0) {
						player.HP = 0;
					}

					// устанавливаем время восстановления игрока
					this.currReductionTime = this.reductionHitTime;
				}
			} else {
				// направляем врага к игроку
				this.translation[0] += (vectorToPlayer[0] / Math.abs(vectorToPlayer[0])) * dt * this.speed / 1000;
				this.translation[1] += (vectorToPlayer[1] / Math.abs(vectorToPlayer[1])) * dt * this.speed / 1000;
			}
		}

		this.pos[0] += this.translation[0];// сдвигаем врага
		this.pos[1] += this.translation[1];

		// анимации, тут все понятно
		if (this.translation[1] > 0) {
			this.currentAnim = "down";
		} else if (this.translation[1] < 0) {
			this.currentAnim = "up";
		}
		this.stay = false;

		if (this.translation[0] == 0 && this.translation[1] == 0) {
			this.stay = true;
			this.currentAnim = "down"
		}

		this._index += dt * this.animations[this.currentAnim].speed;// считаем кадр
		this.frame = this.animations[this.currentAnim].frames[Math.floor(this._index) % this.animations[this.currentAnim].frames.length];

		this.translation = [0, 0];// обнуляем сдвиг
	}

	render(ctx, player) {
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
			this.pos[0] + player.globalTranslation[0],
			this.pos[1] + player.globalTranslation[1],
			this.size[0], this.size[1]
		);
	}

	hit(k) {
		this.HP -= k;
	}
}
