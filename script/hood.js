"use strict";

(function() {
	let showInventory = false,// флаг (показываем инвентарь перса)
		besideBox = false,// флаг (показываем хранилище-box)
		currentBox,//коробка которой касаемся сейчас
		sizeBetweenSlots = 15,// расстояние между слотами
		sizeSlot = 64,// размер слота
		indentInSlot = 2,// отступ по краям внетри слота
		showHintInventory = false,// флаг, показываем подсказку или нет
		selectedSlot = null,// выбранный на данный момент слот хранилища
		selectedSlotInPlayerInventory = null;// выбранный на данный момент слот в инвентаре игрока

	function render(ctx, player, cnv, enemy) {
		renderEnemyHealth(ctx, player, enemy);// отрисовка HP врагов

		renderHealth(ctx, player, cnv);

		// отрисовка  инвентаря
		if (showInventory) {// если нажата 'i'
			if (besideBox) {// если показываем хранилище-box (если находимся рядом с таковым)
				renderBoxSlots(ctx, cnv, player);
			}
		} else {
			input.mouse.setNull();
			selectedSlot = null;
			selectedSlotInPlayerInventory = null;
		}
		renderInventory(ctx, player, cnv);

		if (showHintInventory) {// Если нужно показать подсказку - показываем
			renderHintInventory(ctx, cnv);// Рисуем подсказку
		}
	}

	function renderHintInventory(ctx, cnv) {
		let indent = 15;// Отступ от краев экрана

		let size = [300, 200];
		let pos = [cnv.width - indent - size[0], indent];

		let fontS = 30;

		ctx.strokeStyle = "#C0C0C0";
		ctx.fillStyle = "#434343";
		ctx.strokeRect(pos[0], pos[1], size[0], size[1]);
		ctx.fillRect(pos[0], pos[1], size[0], size[1]);

		ctx.font = `${fontS}px serif`;
		ctx.fillStyle = "#FFFAFA";
		ctx.fillText("Жмите 'i', чтобы", pos[0] + indent, pos[1] + indent + fontS);
		ctx.fillText("открыть/закрыть", pos[0] + indent, pos[1] + (indent + fontS) * 2);
		ctx.fillText("сундук/карман врага", pos[0] + indent, pos[1] + (indent + fontS) * 3);
	}

	function setShowHintInventory(b) {
		showHintInventory = b;
	}

	function getShowInventory() {
		return showInventory;
	}

	function showOrNotInventory(b) {
		if (b === false) {
			showInventory = false;
		} else {
			showInventory = !showInventory;
		}
	}

	function setBox(besBox = null, box = null) {
		besideBox = besBox;
		currentBox = box;
	}

	function renderHealth(ctx, player, cnv) {// переопределяемый метод, отрисовывает линию здоровья
		let x = 5,// позиция внешней  формы
			y = 5,
			sx = 410,// размеры внешней формы
			sy = 46;

		ctx.strokeStyle = "#C0C0C0";// рисуем форму
		ctx.fillStyle = "#434343";
		ctx.strokeRect(x, y, sx, sy);
		ctx.fillRect(x, y, sx, sy);

		let indent = 7;

		x = x + indent;// позиция шкалы
		y = y + indent;
		sx = sx - indent * 2;// размеры шкалы
		sy = sy - indent * 2;

		ctx.fillStyle = "#ff0800";// рисуем шкалу HP
		ctx.strokeStyle = "#C0C0C0";
		ctx.strokeRect(x, y, sx, sy);
		ctx.fillRect(x, y, sx / player.maxHP * player.HP, sy);

		let fontS = 20;

		ctx.font = `${fontS}px serif`;// рисуем текст (количество HP)
		ctx.fillStyle = "#E2A300";
		ctx.fillText(`${player.HP} / ${player.maxHP}`, x + indent, y + sy - (sy - fontS) / 2);
	}

	function renderBoxSlots(ctx, cnv, player) {// отрисовываем худ (просчитываем положение слотов (3х3, 5х2))

		let countSlotsOnLine = Math.ceil(Math.sqrt(currentBox.countSlots));// количество слотов на одной линии

		let countLines = Math.ceil(currentBox.countSlots / countSlotsOnLine);// количество строк слотов

		let sizeM = [sizeBetweenSlots * (countSlotsOnLine + 1) + countSlotsOnLine * sizeSlot,// размеры формы инвентаря
					sizeBetweenSlots * (countLines + 1) + sizeSlot * countLines];

		let posM = [(cnv.width - sizeM[0]) / 2, (cnv.height - sizeM[1]) / 2];// позиция формы инвентаря

		ctx.strokeStyle = "#C0C0C0";// рисуем форму
		ctx.fillStyle = "#434343";
		ctx.strokeRect(posM[0], posM[1], sizeM[0], sizeM[1]);
		ctx.fillRect(posM[0], posM[1], sizeM[0], sizeM[1]);

		if (input.mouse.clickCoordinates != null) {// если пользователь нажал куда-то - берем координаты и ищем а затем выделаем нужный слот
			// считаем какой элемент выделили и обнуляем pressedKeys
			let pos = [input.mouse.clickCoordinates.x - posM[0] - sizeBetweenSlots,// это позиция относительно первого слота (слева сверху)
				input.mouse.clickCoordinates.y - posM[1] - sizeBetweenSlots];

			if (pos[0] >= 0 && pos[0] < sizeM[0] &&// если кликнули внутри этой меню
				pos[1] >= 0 && pos[1] < sizeM[1]) {

				// позиция курсора не по пикселям а по положению на слоте (на каком слоте стоит)
				let posByPos = [Math.floor(pos[0] / (sizeSlot + sizeBetweenSlots)),
							Math.floor(pos[1] / (sizeSlot + sizeBetweenSlots))];

				if ((pos[0] - (posByPos[0] * (sizeSlot + sizeBetweenSlots))) < sizeSlot &&// если кликнули четко на слот
					(pos[1] - (posByPos[1] * (sizeSlot + sizeBetweenSlots))) < sizeSlot) {
					// наш выделенный слот
					let tempSelectedSlot = (posByPos[1]) * countSlotsOnLine + posByPos[0];
					input.mouse.setNull();

					if (tempSelectedSlot < currentBox.countSlots) {// если кликнули на 7 слот к примеру (в случае если в данном хранилище 8 предметов)
						if (selectedSlotInPlayerInventory == null) {// если в инвентаре игрока ничего не выбрано, то можем выбирать в хранилище
							//если в хранилище уже есть выбранный слот
							if (selectedSlot != null) {
								// если выбранный только что - пустой, то перемещаем
								if (!currentBox.slots[tempSelectedSlot]) {
									currentBox.slots[tempSelectedSlot] = currentBox.slots[selectedSlot];
									currentBox.slots[selectedSlot] = undefined;
								} else {// если нет, то меняем местами
									let tempSlot = currentBox.slots[tempSelectedSlot];
									currentBox.slots[tempSelectedSlot] = currentBox.slots[selectedSlot];
									currentBox.slots[selectedSlot] = tempSlot;
								}
								selectedSlot = null;
							} else if (currentBox.slots[tempSelectedSlot]) {// если в выбранном только что слоте не пусто, то можем выбрать его
								// если только что выделенный элемент совпадает с уже выделенным то снимаем выделение
								selectedSlot = tempSelectedSlot == selectedSlot ? null : tempSelectedSlot;
							}
						} else {// иначе - в инвентаре игрока выбран слот
							// если в выбранном только что слоте не пусто - меняем местами содержимое
							if (currentBox.slots[tempSelectedSlot]) {
								// проверка на совпадение видов содержимого БУДЕТ ТОЛЬКО ПРИ JSON-ФОРМАТЕ!!!

								// простой обмен с помощью одной переменной
								let tempSlot = currentBox.slots[tempSelectedSlot];
								currentBox.slots[tempSelectedSlot] = player.slots[selectedSlotInPlayerInventory];
								player.slots[selectedSlotInPlayerInventory] = tempSlot;
							} else {// иначе перемещаем содержимое из слота в инвентаре игрока в только что выбранный слот
								currentBox.slots[tempSelectedSlot] = player.slots[selectedSlotInPlayerInventory];
								player.slots[selectedSlotInPlayerInventory] = undefined;
							}
							selectedSlotInPlayerInventory = null;// теперь слоты не выбраны
						}
					}
				}
			}
		}

		// берем каждый слот
		for (let i = 0; i < countLines; i++) {

			// рисуем слоты до окончания строки
			for (let j = 0; j < countSlotsOnLine; j++) {

				if (currentBox.countSlots < i * countSlotsOnLine + j + 1)// выводим только нужное количество слотов, не больше
				return;

				if (selectedSlot == i * countSlotsOnLine + j) {// выделяем зеленым цветом выбранный слот
					ctx.strokeStyle = "#00ff00";
				} else {
					ctx.strokeStyle = "#C0C0C0";
				}

				ctx.fillStyle = "#434343";

				// рисуем сам слот
				ctx.strokeRect(posM[0] + sizeBetweenSlots + (sizeBetweenSlots + sizeSlot) * j,
							posM[1] + sizeBetweenSlots + (sizeBetweenSlots + sizeSlot) * i,
							sizeSlot, sizeSlot);

				ctx.fillRect(posM[0] + sizeBetweenSlots + (sizeBetweenSlots + sizeSlot) * j,
							posM[1] + sizeBetweenSlots + (sizeBetweenSlots + sizeSlot) * i,
							sizeSlot, sizeSlot);

				if (currentBox.slots[i * countSlotsOnLine + j]) {// Если слот не пустой, то рисуем его содержимое
					// рисуем item в слоте
					ctx.drawImage(resources.get(currentBox.slots[i * countSlotsOnLine + j].item.spriteURL),
								currentBox.slots[i * countSlotsOnLine + j].item.pos[0],
								currentBox.slots[i * countSlotsOnLine + j].item.pos[1],
								currentBox.slots[i * countSlotsOnLine + j].item.size[0],
								currentBox.slots[i * countSlotsOnLine + j].item.size[1],
								posM[0] + sizeBetweenSlots + (sizeBetweenSlots + sizeSlot) * j + indentInSlot,
								posM[1] + sizeBetweenSlots + (sizeBetweenSlots + sizeSlot) * i + indentInSlot,
								sizeSlot - indentInSlot * 2,
								sizeSlot - indentInSlot * 2);

					if (currentBox.slots[i * countSlotsOnLine + j].count != 1) {//не пишем количество если предмет один
						// рисуем количество item-ов в данном хранилище
						ctx.font = "10px serif";
						ctx.fillStyle = "#FFFAFA";
						ctx.fillText(`${currentBox.slots[i * countSlotsOnLine + j].count}`,
									posM[0] + sizeBetweenSlots + (sizeBetweenSlots + sizeSlot) * j + indentInSlot,
									posM[1] + sizeBetweenSlots + (sizeBetweenSlots + sizeSlot) * i - indentInSlot + sizeSlot);
					}
				}
			}
		}
	}

	function renderInventory(ctx, player, cnv) {
		let indent = 20;// отступ сверху

		let size = [sizeBetweenSlots + (sizeBetweenSlots + sizeSlot) * player.countSlots, sizeBetweenSlots * 2 + sizeSlot];
		let pos = [(cnv.width - size[0]) / 2, indent];

		if (input.mouse.clickCoordinates != null && showInventory) {// если пользователь нажал куда-то - берем координаты и ищем а затем выделаем нужный слот
			// считаем какой элемент выделили и обнуляем pressedKeys
			let posS = [input.mouse.clickCoordinates.x - pos[0] - sizeBetweenSlots,// это позиция относительно первого слота (слева сверху)
					input.mouse.clickCoordinates.y - pos[1] - sizeBetweenSlots];

			if (posS[0] >= 0 && posS[0] < size[0] &&// если кликнули внутри этой меню
				posS[1] >= 0 && posS[1] < size[1]) {

				// позиция курсора не по пикселям а по положению на слоте (на каком слоте стоит)
				let posByPos = [Math.floor(posS[0] / (sizeSlot + sizeBetweenSlots)), 0];

				if ((posS[0] - (posByPos[0] * (sizeSlot + sizeBetweenSlots))) < sizeSlot &&// если кликнули четко на слот
					posS[1] < sizeSlot) {
					// наш выделенный слот
					let tempSelectedSlot = posByPos[0];
					input.mouse.setNull();

					if (tempSelectedSlot < player.countSlots) {
						if (selectedSlot == null) {// если в хранилище ничего не выбрано, то можем выбирать в инвентаре игрока
							if (selectedSlotInPlayerInventory != null) {
								// если выбранный только что - пустой, то перемещаем
								if (!player.slots[tempSelectedSlot]) {
									player.slots[tempSelectedSlot] = player.slots[selectedSlotInPlayerInventory];
									player.slots[selectedSlotInPlayerInventory] = undefined;
								} else {// если нет, то меняем местами
									let tempSlot = player.slots[tempSelectedSlot];
									player.slots[tempSelectedSlot] = player.slots[selectedSlotInPlayerInventory];
									player.slots[selectedSlotInPlayerInventory] = tempSlot;
								}
								selectedSlotInPlayerInventory = null;
							} else if (player.slots[tempSelectedSlot]) {// если в выбранном только что слоте не пусто, то можем выбрать его
								// если только что выделенный элемент совпадает с уже выделенным то снимаем выделение
								selectedSlotInPlayerInventory = tempSelectedSlot == selectedSlotInPlayerInventory ? null : tempSelectedSlot;
							}
						} else {// иначе - в хранилище выбран слот
							// если в выбранном только что слоте не пусто - меняем местами содержимое
							if (player.slots[tempSelectedSlot]) {
								// простой обмен с помощью одной переменной
								let tempSlot = player.slots[tempSelectedSlot];
								player.slots[tempSelectedSlot] = currentBox.slots[selectedSlot];
								currentBox.slots[selectedSlot] = tempSlot;
							} else {// иначе перемещаем содержимое из слота в хранилище в только что выбранный слот
								player.slots[tempSelectedSlot] = currentBox.slots[selectedSlot];
								currentBox.slots[selectedSlot] = undefined;
							}
							selectedSlot = null;// теперь слоты не выбраны
						}
					}
				}
			}
		}

		ctx.strokeStyle = "#C0C0C0";// рисуем форму
		ctx.fillStyle = "#434343";
		ctx.strokeRect(pos[0], pos[1], size[0], size[1]);
		ctx.fillRect(pos[0], pos[1], size[0], size[1]);

		// берем слоты игрока и отрисовываем
		for (let i = 0; i < player.countSlots; i++) {

			if (selectedSlotInPlayerInventory == i && showInventory) {// выделяемый выбранный элемент
				ctx.strokeStyle = "#00ff00";
			} else {
				ctx.strokeStyle = "#C0C0C0";
			}

			ctx.fillStyle = "#434343";

			// рисуем сам слот
			ctx.strokeRect(pos[0] + sizeBetweenSlots + (sizeBetweenSlots + sizeSlot) * i,
							pos[1] + sizeBetweenSlots,
							sizeSlot, sizeSlot);

			ctx.fillRect(pos[0] + sizeBetweenSlots + (sizeBetweenSlots + sizeSlot) * i,
						pos[1] + sizeBetweenSlots,
						sizeSlot, sizeSlot);

			if (player.slots[i]) {// есть слот не пуст
				// рисуем item в слоте
				ctx.drawImage(resources.get(player.slots[i].item.spriteURL),
							player.slots[i].item.pos[0],
							player.slots[i].item.pos[1],
							player.slots[i].item.size[0],
							player.slots[i].item.size[1],
							pos[0] + sizeBetweenSlots + (sizeBetweenSlots + sizeSlot) * i + indentInSlot,
							pos[1] + sizeBetweenSlots + indentInSlot,
							sizeSlot - indentInSlot * 2,
							sizeSlot - indentInSlot * 2);

				if (player.slots[i].count != 1) {//не пишем количество если предмет один
					// рисуем количество item-ов в данном хранилище
					ctx.font = "10px serif";
					ctx.fillStyle = "#FFFAFA";
					ctx.fillText(`${player.slots[i].count}`,
									pos[0] + sizeBetweenSlots + (sizeBetweenSlots + sizeSlot) * i + indentInSlot,
									pos[1] + sizeSlot + sizeBetweenSlots - indentInSlot);
				}
				// рисуем клавишу нажав на которую можно использовать этот item
				ctx.font = "10px serif";
				ctx.fillStyle = "#FFFAFA";
				ctx.fillText(`${i + 1}`,
							pos[0] + sizeBetweenSlots + (sizeBetweenSlots + sizeSlot) * i + indentInSlot,
							pos[1] + sizeBetweenSlots - indentInSlot);

				// если оставшееся время восстановления не равно 0
				if (player.slots[i].item.remainingTimeReduction) {
					// рисуем оставшееся время восстановления
					let maxWidth = 15;// максимальная ширина текста (добавил, чтобы хоть примерно на середине был текст)
					ctx.font = "15px serif";
					ctx.fillStyle = "#FFFAFA";
					ctx.fillText(`${Math.floor(player.slots[i].item.remainingTimeReduction / 100) / 10}`,
								pos[0] + sizeBetweenSlots + (sizeBetweenSlots + sizeSlot) * i + indentInSlot + sizeSlot / 2 - maxWidth / 2,
								pos[1] + sizeBetweenSlots - indentInSlot + sizeSlot / 2, maxWidth);
				}
			}
		}
	}

	function renderEnemyHealth(ctx, player, enemy) {
		enemy.forEach((e) => {
			let indentTop = 5,
				indentOnSides = 1;

			let sx = e.size[0] + indentOnSides * 2,
				sy = 7;

			let x = e.pos[0] - indentOnSides + player.globalTranslation[0],
				y = e.pos[1] + indentTop + sy + player.globalTranslation[1];

			ctx.fillStyle = "#ff0800";// рисуем шкалу HP
			ctx.strokeStyle = "#C0C0C0";
			ctx.strokeRect(x, y, sx, sy);
			ctx.fillRect(x, y, sx / e.maxHP * e.HP, sy);
		});
	}

	window.hood = {
		render: render,
		showOrNotInventory: showOrNotInventory,
		setBox: setBox,
		getShowInventory: getShowInventory,
		setShowHintInventory: setShowHintInventory
	}
})();
