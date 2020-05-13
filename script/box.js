class Box {
	constructor(countSlots, sprite, pos, size, slots = []) {
		this.countSlots = countSlots;// максимальное количество
		this.sprite = sprite;// обьект, внутри - (ссылка на спрайт-карту, нужная позиция, нужные размеры)
		this.size = size;// размер на холсте
		this.slots = slots;// конкретные слоты занятые чем-либо
		this.pos = [pos[0] * map.sizeBlock + (map.sizeBlock - this.size[0]) / 2,// позиция на холсте
					pos[1] * map.sizeBlock + (map.sizeBlock - this.size[1]) / 2];
	}

	setItem(item, count) {// вставить item (в количестве count) в box
		let slot = {
			count: count,
			item: item
		}
		this.slots.push(slot);
	}

	render(ctx, pos, player) {
		ctx.drawImage(resources.get(this.sprite.url),
			this.sprite.pos[0], this.sprite.pos[1],
			this.sprite.size[0], this.sprite.size[1],
			this.pos[0] + pos[0] + player.globalTranslation[0], this.pos[1] + pos[1] + player.globalTranslation[1],
			this.size[0], this.size[1]
		);
	}
}
