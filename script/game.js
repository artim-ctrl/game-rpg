"use strict";

(function() {
	// переменные
	const mapArray = [// карта
			'###############',
			'#1111111111111#',
			'#1...........1#',
			'#1..~00000~..1#',
			'#1..~00000~..1#',
			'#1...........1#',
			'#1111111111111#',
			'###############'
		],
		sizeBlock = 64,// размер блока текстуры
		blockFactor = {
			'1': 0,// деревья
			'#': 1,// холмы
			'~': 2,// кусты
			'.': 3,// трава
			'0': 4// каменная дорожка
		},
		collisionBlocks = ['#', '1'];// обьекты с которыми перс сталкиваетсяи непроходит сквозь

	let box = [];// хранилища на карте

	let lastCurrBox = null;

	let enemy = [];// враги на карте

	let beginPos = [0, 0],// начало карты, зависит от массива (в init)
		endPos = [0, 0];// конец карты

	let indentMap = 250;

	let player;// наш перс

	let lastTime,// для вычисления отрезка времени от прошлого кадра до нынешнего
		dt = 0;

	let timeOpenInventory = 0;// ограничение по ремени открытия/закрытия инвентаря (для нормальной регистрации нажатия)

	let scaleAll = 3;// масштаб всего (еще поменять в variables)
	let playerSpeed = 100 * scaleAll;// скорость передвижения персонажа

	let $ = (e) => { return document.querySelector(e); };// для удобства

	window.map.sizeBlock = sizeBlock * scaleAll;

	let cnv = $('#canvas');// холст тащим с DOM
	let ctx = cnv.getContext('2d');
	cnv.width = window.innerWidth;
	cnv.height = window.innerHeight;

	//prepare
	resources.load(["source/player.png",// грузим ресуррсы
					"source/terrain.png",
					"source/box.png",
					"source/food.png",
					"source/weapon.png",
					"source/enemy.png"]);

	resources.onReady(() => {// после окончания загрузки создаем перса и заполняем карту
		player = new Player("source/player.png", [cnv.width / 2, cnv.height / 2], {
		down: {
			pos: [0, 0],
			speed: .01,
			size: [26, 36],
			frames: [0, 1, 2]
		},
		right: {
			pos: [0, 72],
			speed: .01,
			size: [26, 36],
			frames: [0, 1, 2]
		},
		left: {
			pos: [0, 36],
			speed: .01,
			size: [26, 36],
			frames: [0, 1, 2]
		},
		up: {
			pos: [0, 108],
			speed: .01,
			size: [26, 36],
			frames: [0, 1, 2]
		}
		}, playerSpeed, [0, 0], [26 * scaleAll, 36 * scaleAll], 100, 5);

		player.scaleAll = scaleAll;

		init();
	});

	function init() {// инициализация, выполняется один разза всю игру
		lastTime = Date.now();

		let middle = [cnv.width / 2, cnv.height / 2];//высчитывается начальная позиция для отрисовки карты и определения ее границ
		// beginPos = [middle[0] - mapArray[0].length * sizeBlock * scaleAll / 2, middle[1] - mapArray.length * sizeBlock * scaleAll / 2];
		beginPos = [0, 0];
		// позиция конца карты
		endPos = [beginPos[0] + mapArray[0].length * sizeBlock * scaleAll, beginPos[1] + mapArray.length * sizeBlock * scaleAll];

		player.globalTranslation = [-(cnv.width / 2), -(cnv.height / 2)];// Отрицательное = вверх, влево

		map.setMap("source/terrain.png", mapArray, sizeBlock, scaleAll, blockFactor, beginPos);

		box.push( new Box (
		...boxes.default_7
		));// добавление box-а

		enemy.push( new Enemy(
		...enemyies.bob
		));

		enemy.push( new Enemy(
		...enemyies.bob
		));

		enemy[0].setItem(new Food (// закинем один item в box
		...foods.meatPork
		), 7);

		enemy[1].setItem(new Weapon (// закинем один item в box
		...weapons.igril
		), 1);

		enemy[1].setItem(new Food (// закинем один item в box
		...foods.meatPork
		), 3);

		box[0].setItem(new Food (// закинем один item в box
		...foods.meatPork
		), 2);

		box[0].setItem(new Weapon (// закинем один item в box
		...weapons.notSuper
		), 1);

		player.setItem(new Food (// закинем один item в box
		...foods.meatPork
		), 9);

		main();
	}

	function main() {// основная event loop
		// если проиграли
		if (player.HP <= 0) {
			death();
			return;
		}

		dt = (Date.now() - lastTime) || 1;// чтоб ыне было бага если время кадра слишком низкое (равно 0)

		ctx.clearRect(0, 0, cnv.width, cnv.height);

		handleInput();

		update(dt);// просчет следующего кадра
		render(ctx);// отрисовка следующего кадра

		lastTime = Date.now();
		timeOpenInventory += dt;

		requestAnimationFrame(main);
	}

	function death() {
		// рисуем меню проигрыша игроку
		ctx.strokeStyle = "#C0C0C0";
		ctx.fillStyle = "#434343";
		ctx.strokeRect(cnv.width / 3, cnv.height / 3, cnv.width / 3, cnv.height / 3);
		ctx.fillRect(cnv.width / 3, cnv.height / 3, cnv.width / 3, cnv.height / 3);

		// говорим, что он проиграл :)
		let fontS = 50;
		let indentBetweenLines = 10;
		let indentTopAndLeft = 30;
		ctx.font = `${fontS}px serif`;
		ctx.fillStyle = "#C0C0C0";
		ctx.fillText("Вы проиграли, ", cnv.width / 3 + indentTopAndLeft, cnv.height / 3 + fontS / 2 + indentTopAndLeft);
		ctx.fillText("перезагрузите страницу!", cnv.width / 3 + indentTopAndLeft, cnv.height / 3 + fontS / 2 + indentBetweenLines + fontS + indentTopAndLeft);
	}

	function handleInput() {
		player.stay = true;// говорим обьекту стоять, если дальше сработают кнопки, то стоять не будем

		if (input.isPressed('UP') || input.isPressed('w')) {
			player.translation[1] = -dt * player.speed / 1000;//куда перемещается наш перс
			player.currentAnim = "up";// анимация
			player.stay = false;

			if (player.globalTranslation[1] != 0 && (player.pos[1] + player.translation[1]) < indentMap) {
				player.globalTranslation[1] -= player.translation[1];
				player.translation[1] = 0;
			}

			if (player.globalTranslation[1] > 0) {
				player.globalTranslation[1] = 0;
			}
		}
		if (input.isPressed('DOWN') || input.isPressed('s')) {
			player.translation[1] = dt * player.speed / 1000;
			player.currentAnim = "down";
			player.stay = false;

			if (player.globalTranslation[1] != -(endPos[1] - cnv.height) && (player.pos[1] + player.translation[1] + player.size[1]) > cnv.height - indentMap) {
				player.globalTranslation[1] -= player.translation[1];
				player.translation[1] = 0;
			}

			if (-player.globalTranslation[1] > endPos[1] - cnv.height) {
				player.globalTranslation[1] = -(endPos[1] - cnv.height);
			}
		}
		if (input.isPressed('LEFT') || input.isPressed('a')) {
			player.translation[0] = -dt * player.speed / 1000;
			player.currentAnim = "left";
			player.stay = false;

			if (player.globalTranslation[0] != 0 && (player.pos[0] + player.translation[0]) < indentMap) {
				player.globalTranslation[0] -= player.translation[0];
				player.translation[0] = 0;
			}

			if (player.globalTranslation[0] > 0) {
				player.globalTranslation[0] = 0;
			}
		}
		if (input.isPressed('RIGHT') || input.isPressed('d')) {
			player.translation[0] = dt * player.speed / 1000;
			player.currentAnim = "right";
			player.stay = false;

			if (player.globalTranslation[0] != -(endPos[0] - cnv.width) && (player.pos[0] + player.translation[0] + player.size[0]) > cnv.width - indentMap) {
				player.globalTranslation[0] -= player.translation[0];
				player.translation[0] = 0;
			}

			if (-player.globalTranslation[0] > endPos[0] - cnv.width) {
				player.globalTranslation[0] = -(endPos[0] - cnv.width);
			}
		}

		// проверяем на нажатие
		for (let i = 0; i < player.countSlots; i++) {
			if (input.isPressed(`${i + 1}`)) {// если нажат кнопка 1 - количество слотов перса
				if (player.slots[i]) {// если слот не пуст
					if (player.slots[i].item instanceof Food) {// если в этом слоте - еда, то "едим" ее
						if (player.slots[i].item.remainingTimeReduction == 0 && player.HP < player.maxHP) {
						player.slots[i].item.use(player);// прибавляем HP
						player.slots[i].count--;// уменьшаем количество

							if (player.slots[i].count == 0) {// если количество == 0 - удаляем
								player.slots[i] = undefined;
							}
						}
					} else if (player.slots[i].item instanceof Weapon) {// если в слоте оружие
						if (!player.currentWeapon) {
							player.currentWeapon = player.slots[i].item;
							player.slots.splice(i, 1);
						} else {
							let tempSlot = player.slots[i].item;
							player.slots[i].item = player.currentWeapon;
							player.currentWeapon = tempSlot;
						}
					}
				}
			}
		}

		if (input.isPressed('i') && timeOpenInventory > 300) {// если нажали - открываем инвентарь
			hood.showOrNotInventory();
			timeOpenInventory = 0;
		}

		if (input.mouse.clicked) {
			enemy.forEach((e) => {
				// середины игрока и врага (данного)
				let midPlayer = [player.pos[0] + player.size[0] / 2, player.pos[1] + player.size[1] / 2];
				let midEnemy = [e.pos[0] + player.globalTranslation[0] + e.size[0] / 2,
								e.pos[1] + player.globalTranslation[1] + e.size[1] / 2];

				// координаты врага относительно игрока
				let vectorToPlayer = [midPlayer[0] - midEnemy[0], midPlayer[1] - midEnemy[1]];

				let distance = Math.sqrt(Math.pow(vectorToPlayer[0], 2) + Math.pow(vectorToPlayer[1], 2));

				if(distance < 120 && player.timeWeaponReduction == 0) {
					// !!! если в руках нет оружия, то перс бьет с силой в 5 и восстановлением 2 секунды
					if (player.currentWeapon) {
						e.hit(player.currentWeapon.damage);
						player.timeWeaponReduction = player.currentWeapon.timeReduction;
					} else {
						e.hit(5);
						player.timeWeaponReduction = 2000;
					}
				}
			});
		}

		checkCollisions();
	}

	function checkCollisions() {
		checkCollisionsWithEnds();// коллизии с границами карты
		checkCollisionsWithBox();// коллизии с box-ами
	}

	function checkCollisionsWithEnds() {// прописать изменение GlobalTranslation
		if (player.pos[0] + player.translation[0] <= beginPos[0]) {// левый конец карты
			player.pos[0] = beginPos[0];
			player.translation[0] = 0;
		} else if (player.pos[0] + player.translation[0] + player.size[0] >= cnv.width) {
			player.pos[0] = cnv.width - player.size[0];
			player.translation[0] = 0;
		}
		if (player.pos[1] + player.translation[1] <= beginPos[1]) {// верхний конец карты
			player.pos[1] = beginPos[1];
			player.translation[1] = 0;
		} else if (player.pos[1] + player.translation[1] + player.size[1] >= cnv.height) {
			player.pos[1] = cnv.height - player.size[1];
			player.translation[1] = 0;
		}
	}

	function checkCollisionsWithBox() {
		for (let i = 0; i < box.length; i++) {
			if (boxCollides(player.pos, player.size, [box[i].pos[0] + player.globalTranslation[0], box[i].pos[1] + player.globalTranslation[1]], box[i].size)) {
				if (lastCurrBox != null) {// если на прошлом кадре мы касались бокса
					if (box[i] != lastCurrBox) {// уже другой box и мы его касаемся
						lastCurrBox = box[i]
						hood.setBox(true, box[i]);// говорим, что касаемся box-а и передаем ссылку на box, которого касаемся
					}
				} else {// если до этого момента, box-а мы не касались
					lastCurrBox = box[i]
					hood.setBox(true, box[i]);// говорим, что касаемся box-а и передаем ссылку на box, которого касаемся
					hood.setShowHintInventory(true);// Показываем подсказку
				}
				return;
			}
		}

		// обнуляем текущий бокс
		hood.setShowHintInventory(false);
		hood.setBox();
		hood.showOrNotInventory(false);// убираем меню инвентаря если выходим за пределы box-а
		lastCurrBox = null;
	}

	function collides(x, y, r, b, x2, y2, r2, b2) {// проверяем столкновение обьекта с позицией pos и размерами size с обьектом2 с позицией pos2 и размерами size2
		return !(r <= x2 || x > r2 ||
				b <= y2 || y > b2);
	}

	function boxCollides(pos, size, pos2, size2) {
		return collides(pos[0], pos[1],
						pos[0] + size[0], pos[1] + size[1],
						pos2[0], pos2[1],
						pos2[0] + size2[0], pos2[1] + size2[1]);
	}

	function update(dt) {
		player.update(dt);// просчет персонажа (анимации и движения)

		enemy.forEach((e) => {
			e.update(dt, player, enemy, box);
		});

		updateReduction(dt);
	}

	function updateReduction(dt) {// обновляем все восстановления (item-ов) у перса
		for (let i = 0; i < player.countSlots; i++) {// перебираем их
			if (player.slots[i]) {// если слот не пуст
				if (player.slots[i].item.remainingTimeReduction != undefined) {// если эта перемнная существует
					if (player.slots[i].item.remainingTimeReduction != 0) {// если не равна нулю
						player.slots[i].item.remainingTimeReduction -= dt;// отнимаем пройденное время

						if (player.slots[i].item.remainingTimeReduction < 0) {// должна быть не меньше нуля
							player.slots[i].item.remainingTimeReduction = 0;
						}
					}
				}
			}
		}

		if (player.timeWeaponReduction != 0) {// восстановление задержки удара
			player.timeWeaponReduction -= dt;

			if (player.timeWeaponReduction < 0) {
				player.timeWeaponReduction = 0;
			}
		}
	}

	function render(ctx) {
		map.render(ctx, player);// отрисовка карты

		renderBoxes(ctx, player);// отрисовка box-ов

		enemy.forEach((e) => {
			e.render(ctx, player);
		});

		player.render(ctx);// отрисовка персонажа

		hood.render(ctx, player, cnv, enemy);// отрисовка графического интерфейса
	}

	function renderBoxes(ctx, player) {
		box.forEach((e) => {
			e.render(ctx, beginPos, player);
		});
	}
})();
