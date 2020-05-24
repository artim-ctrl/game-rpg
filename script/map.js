"use strict";

(function() {
	let map = [],// карта
		size = 0,// размер блока текстуры
		factor = {},// индекс для идентификации нужного блока на спрайт-карте
		url = '';// ссылка на спрайт-карту для доступа из resources

	function setMap(params) {// устанавливаем карту
		url = params.url;
		map = params.mapArray;
		size = params.sizeBlock;
		factor = params.blockFactor;
	}

	function render() {
		for (let j = 0; j < map.length; j++) {
			let elem = map[j];

			for (let i = 0; i < elem.length; i++) {// берем элемент строки (символ блока)
				let pos_map = {
					x: (size * i * scaleAll + globalTranslation.x),
					y: (size * j * scaleAll + globalTranslation.y)
				};

				if (!collidesWithScreen(pos_map, { x: size * scaleAll, y: size * scaleAll })) continue;// не рисуем то, что за картой

				let x = factor[elem[i]] * size;

				ctx.drawImage(
					resources.get(url),
					x, 0,
					size, size,
					pos_map.x, pos_map.y,
					size * scaleAll, size * scaleAll
				);
			}
		}
	}

	function getMaxPos() {
		return {
			x: map[0].length * size * scaleAll,
			y: map.length * size * scaleAll
		};
	}

	window.map = {
		render: render,
		setMap: setMap,
		getMaxPos: getMaxPos
	};
})();
