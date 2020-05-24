(function () {
    let playerInventory = null,
        minPlayerInventory = null;

    let sizeInventoryBlock = 38,
        indentBetweenItem = 5;

    let dragingSlot = null;

    let firstSlot = {
            inventory: null,
            id: null
        },
        secondSlot = {
            inventory: null,
            id: null
        };

    let activeInvItem = null;

    function render() {
        renderEnemyHealth();
        renderHealth();
        renderPlayerInventory();

        if (dragingSlot) renderDragingSlot();
    }

    function renderPlayerInventory() {
        if (!minPlayerInventory) setMinPlayerInventory();
        if (!playerInventory) setPlayerInventory();

        renderMenu(playerMinInventory);
        if (playerInventory.active) renderMenu(playerInventory);

        if (activeInvItem && playerInventory.active) renderActiveItem();
    }

    function renderHealth() {
        renderMenu({
            type: 'menu',
            size: { x: 450, y: 40 },
            pos: { x: 15, y: 15 },
            border: '#c9c9c9',
            align: false,
            background: '#c9c9c9',
            children: [
                {
                    type: 'menu',
                    pos: { x: 3, y: 3 },
                    border: 'white',
                    align: 'c',
                    background: false,
                    children: [
                        {
                            type: 'menu',
                            pos: { x: 0, y: 0 },
                            size: { x: 444 * player.HP / player.maxHP },
                            border: false,
                            align: 'y',
                            background: 'red',
                            children: [
                                {
                                    type: 'text',
                                    text: `${player.HP} / ${player.maxHP}`,
                                    pos: { x: 4 },
                                    font: 25,
                                    color: 'yellow',
                                    align: 'y'
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    }

    function renderEnemyHealth() {
        for (let i = 1; i <= 4; i++) {
            if (!(enemies[i] instanceof Enemy)) continue;
            if (!collidesWithScreen({ x: enemies[i].pos.x + globalTranslation.x, y: enemies[i].pos.y + globalTranslation.y }, { x: enemies[i].size.x, y: enemies[i].size.y })) continue;
            renderMenu({
                type: 'menu',
                pos: { x: 0, y: 0 },
                size: { x: enemies[i].size.x, y: enemies[i].size.y / 10 },
                border: 'white',
                background: '#c9c9c9',
                children: [
                    {
                        type: 'menu',
                        pos: { x: 0, y: 0 },
                        size: { x: enemies[i].size.x * enemies[i].HP / enemies[i].maxHP },
                        align: 'y',
                        background: 'red'
                    }
                ]
            }, { pos: { x: enemies[i].pos.x + globalTranslation.x, y: enemies[i].pos.y + globalTranslation.y }, size: { x: enemies[i].size.x, y: enemies[i].size.y } });
        }
    }

    function renderDragingSlot() {
        dragingSlot.pos.x = input.mouse.coordinates.x;
        dragingSlot.pos.y = input.mouse.coordinates.y;

        renderMenu(dragingSlot);
    }

    function renderActiveItem() {
        let size = { x: 300, y: 400 };
        renderMenu({
            type: 'menu',
            pos: { x: playerInventory.pos.x - 30 - size.x },
            size: size,
            border: 'white',
            background: '#c9c9c9',
            align: 'y',
            children: [
                {
                    type: 'menu',
                    pos: { x: 20, y: 20 },
                    size: { x: 90, y: 90 },
                    border: 'white',
                    children: [
                        {
                            type: 'image',
                            indent: 5,
                            item: activeInvItem
                        }
                    ]
                },
                {
                    type: 'text',
                    text: activeInvItem.name,
                    font: 20,
                    pos: { x: 20, y: 115 },
                    color: 'white'
                },
                {
                    type: 'text',
                    text: activeInvItem.description,
                    font: 16,
                    over: true,
                    pos: { x: 20, y: 145 },
                    color: 'white'
                },
                {
                    type: 'text',
                    text: 'Максимум на слот: ' + activeInvItem.max,
                    font: 17,
                    pos: { x: 20, y: 300 },
                    color: 'white'
                },
                {
                    type: 'text',
                    text: 'Время восстановления: ' + activeInvItem.timeout / 1000 + ' сек',
                    font: 17,
                    pos: { x: 20, y: 330 },
                    color: 'white'
                },
                {
                    type: 'text',
                    text: 'Прибавляет(отнимает) HP: ' + activeInvItem.HP,
                    font: 17,
                    pos: { x: 20, y: 360 },
                    color: 'white'
                }
            ]
        });
    }

    function setMinPlayerInventory() {
        let children = [];

        let indent = indentBetweenItem * scaleAll,
            sizeBlock = sizeInventoryBlock * scaleAll;

        let size = { x: indent + (indent + sizeBlock) * player.countMinSlots, y: indent * 2 + sizeBlock },
            pos = { x: (window.innerWidth - size.x) / 2, y: 10 };

        for (let i = 1; i <= player.countMinSlots; i++) {
            let x = indent + (indent + sizeBlock) * (i - 1),
                y = indent;

            children.push({
                type: 'menu',
                pos: { x: x, y: y },
                size: { x: sizeBlock, y: sizeBlock },
                border: 'white',
                absolutePos: { x: pos.x + x, y: pos.y + y },
                children: [
                    {
                        type: 'image',
                        indent: indent,
                        item: player.minSlots[i],
                        children: [
                            {
                                type: 'text',
                                text: {
                                    func: 'getCountMinItem',
                                    params: {
                                        i: i
                                    }
                                },
                                pos: { x: -3, y: -7},
                                font: 13,
                                color: 'white'
                            },
                            {
                                type: 'text',
                                text: i,
                                font: 13,
                                pos: { x: -3, y: sizeBlock - 7},
                                color: 'white'
                            }
                        ]
                    }
                ]
            });
        }

        playerMinInventory = {
            align: false,
            type: 'menu',
            pos: pos,
            size: size,
            border: 'white',
            background: '#c9c9c9',
            children: children
        };
    }

    function setPlayerInventory(active = false) {
        let line = Math.ceil(Math.sqrt(player.countSlots)),
            countLines = Math.ceil(player.countSlots / line);

        let children = [];

        let indent = indentBetweenItem * scaleAll,
            sizeBlock = sizeInventoryBlock * scaleAll;

        let size = { x: indent + (indent + sizeBlock) * line, y: indent + (indent + sizeBlock) * countLines },
            pos = { x: (window.innerWidth - size.x) / 2, y: (window.innerHeight - size.y) / 2 };

        for (let i = 0; i < countLines; i++) {
            for (let j = 0; j < line; j++) {
                let x = indent + (indent + sizeBlock) * j,
                    y = indent + (indent + sizeBlock) * i;

                children.push({
                    type: 'menu',
                    pos: { x: x, y: y },
                    size: { x: sizeBlock, y: sizeBlock },
                    align: false,
                    border: 'white',
                    absolutePos: { x: pos.x + x, y: pos.y + y },
                    children: [
                        {
                            type: 'image',
                            indent: indent,
                            item: player.slots[i * countLines + j],
                            children: [
                                {
                                    type: 'text',
                                    text: {
                                        func: 'getCountItem',
                                        params: {
                                            i: i * countLines + j
                                        }
                                    },
                                    pos: { x: -3, y: -7},
                                    font: 13,
                                    color: 'white'
                                }
                            ]
                        }
                    ]
                });

                if (i * countLines + j + 1 == player.countSlots) break;
            }
        }

        playerInventory = {
            active: active,
            type: 'menu',
            pos: pos,
            size: size,
            border: 'white',
            background: '#c9c9c9',
            children: children
        };
        activeInvItem = null;
    }

    function renderDeath() {
        renderMenu({
            type: 'menu',
            size: { x: 300, y: 200 },
            border: 'white',
            align: 'c',
            background: '#c9c9c9',
            children: [
                {
                    type: 'text',
                    text: 'Вы проиграли!',
                    font: 20,
                    pos: { x: 15, y: 20},
                    color: 'white'
                },
                {
                    type: 'text',
                    text: 'Перезагрузите страницу, чтобы начать снова!',
                    font: 18,
                    over: true,
                    pos: { x: 15, y: 50},
                    color: 'white'
                }
            ]
        });
    }

    function renderWin() {
        renderMenu({
            type: 'menu',
            size: { x: 300, y: 200 },
            border: 'white',
            align: 'c',
            background: '#c9c9c9',
            children: [
                {
                    type: 'text',
                    text: 'Вы выиграли!',
                    font: 20,
                    pos: { x: 15, y: 20},
                    color: 'white'
                },
                {
                    type: 'text',
                    text: 'Перезагрузите страницу, чтобы начать снова!',
                    font: 18,
                    over: true,
                    pos: { x: 15, y: 50},
                    color: 'white'
                }
            ]
        });
    }

    /*
    * pos - позиция (не указываем если center == true)
    * size - размеры
    * align - выравнивание 'c' - по центру, 'x' - по горизонтали, 'y' - по вертикали
    * border - цвет обводки
    * background - цвет заднего фона
    * 
    * если align == 'c', то указываем pos или size, если 'x' - pos.y и size.y, если 'y' - pos.x и size.x
    */
    function renderMenu(params, parent = { pos: null, size: null }) {// в parent хранится позиция и размеры предка
        let x, y;
                
        switch (params.type) {
            case 'menu':
                let sx, sy;

                if (params.align) {
                    switch (params.align) {
                        case 'c':
                            if (params.pos) {
                                x = params.pos.x;
                                y = params.pos.y;

                                if (parent.size) {
                                    sx = parent.size.x - params.pos.x * 2;
                                    sy = parent.size.y - params.pos.y * 2;
                                } else {
                                    sx = window.innerWidth - params.pos.x * 2;
                                    sy = window.innerHeight - params.pos.y * 2;
                                }
                            } else {
                                sx = params.size.x;
                                sy = params.size.y;

                                if (parent.size) {
                                    x = (parent.size.x - params.size.x) / 2;
                                    y = (parent.size.y - params.size.y) / 2;
                                } else {
                                    x = (window.innerWidth - params.size.x) / 2;
                                    y = (window.innerHeight - params.size.y) / 2;
                                }
                            }
                            break;
                        case 'x':
                            y = params.pos.y;
                            sy = params.size.y;

                            if (params.pos.x != null) {
                                x = params.pos.x;

                                if (parent.size) {
                                    sx = parent.size.x - x * 2
                                } else {
                                    sx = window.innerHeight - x * 2;
                                }
                            } else {
                                sx = params.size.x;

                                if (parent.size) {
                                    x = (parent.size.x - params.size.x) / 2;
                                } else {
                                    x = (window.innerWidth - params.size.x) / 2;
                                }
                            }
                            break;
                        case 'y':
                            x = params.pos.x;
                            sx = params.size.x;

                            if (params.pos.y != null) {
                                y = params.pos.y;

                                if (parent.size) {
                                    sy = parent.size.y - y * 2;
                                } else {
                                    sy = window.innerWidth - y * 2;
                                }
                            } else {
                                sy = params.size.y;

                                if (parent.size) {
                                    y = (parent.size.y - params.size.y) / 2;
                                } else {
                                    y = (window.innerHeight - params.size.y) / 2;
                                }
                            }
                            break;
                    }
                } else {
                    x = params.pos.x;
                    y = params.pos.y;
                    sx = params.size.x;
                    sy = params.size.y;
                }

                // относительность позиции
                if (parent.pos) {
                    x += parent.pos.x;
                    y += parent.pos.y;
                }

                if (params.absolutePos) {
                    params.absolutePos.x = x;
                    params.absolutePos.y = y;
                }

                if (params.border) {
                    ctx.strokeStyle = params.border;
                    ctx.strokeRect(x, y, sx, sy);
                }

                if (params.background) {
                    ctx.fillStyle = params.background;
                    ctx.fillRect(x, y, sx, sy);
                }

                if (params.children) {
                    if (params.children.length) {
                        for (let child of params.children) {
                            renderMenu(child, { pos: { x: x, y: y }, size: { x: sx, y: sy } });
                        }
                    }
                }
                break;
            case 'text':
                if (params.align) {
                    switch (params.align) {
                        case 'y':
                            x = params.pos.x;
                            
                            if (parent.size) {
                                y = (parent.size.y - params.font) / 2;
                            } else {
                                y = (window.innerHeight - params.font) / 2;
                            }
                            break;
                    }
                } else {
                    x = params.pos.x;
                    y = params.pos.y;
                }

                // относительность позиции
                if (parent.pos) {
                    x += parent.pos.x;
                    y += parent.pos.y;
                }

                let text = null;
                if (params.text instanceof Object) {
                    text = eval(params.text.func + `(${JSON.stringify(params.text.params)})`);
                } else {
                    text = params.text;   
                }

                ctx.font = `${params.font}px sans-serif`;// рисуем текст (количество HP)
                ctx.fillStyle = params.color;

                if (params.over) {
                    y += params.font;

                    // символов будет в строке
                    let countSym = Math.floor(parent.size.x / 10),
                        countLines = Math.ceil(params.text.length / countSym);

                    for (let i = 0; i < countLines; i++) {
                        ctx.fillText(text.substr(i * countSym, countSym), x, y + (params.font + 3) * i);
                    }
                } else {
                    ctx.fillText(text, x, y + params.font);
                }
                break;
            case 'image':
                if (params.item) {
                    let indent = 5;

                    x = indent + parent.pos.x;
                    y = indent + parent.pos.y;

                    ctx.drawImage(resources.get(params.item.sprite.url),
                        params.item.sprite.pos.x, params.item.sprite.pos.y,
                        params.item.sprite.size.x, params.item.sprite.size.y,
                        x, y,
                        parent.size.x - indent * 2, parent.size.y - indent * 2);

                    if (params.children) {
                        if (params.children.length) {
                            for (let child of params.children) {
                                renderMenu(child, parent);
                            }
                        }
                    }
                }
                break;
        }
    }

    function setDragItem(drag) {
        if (drag) {
            let res = getSlotByPos(input.mouse.coordinates.down, firstSlot);

            if (res && res.item) {
                dragingSlot = {
                    type: 'menu',
                    active: false,
                    pos: { x: input.mouse.coordinates.x, y: input.mouse.coordinates.y },
                    size: { x: 20 * scaleAll, y: 20 * scaleAll },
                    align: false,
                    children: [
                        {
                            type: 'image',
                            indent: 0,
                            item: res.item
                        }
                    ]
                };
            }
        } else {
            let res = getSlotByPos(input.mouse.coordinates.up, secondSlot);

            if (res && dragingSlot) {
                if (res.item) {// если оба слота не null, то действуем (проверяем есть ли конкретный Item и в зависимости от этого  меняем местами или заменяем содержимое)
                    if (res.item != dragingSlot.children[0].item) {
                        // меняем местами
                        if (res.item.id == dragingSlot.children[0].item.id) {
                            if (secondSlot.inventory[secondSlot.id].max >= secondSlot.inventory[secondSlot.id].count + firstSlot.inventory[firstSlot.id].count) {
                                secondSlot.inventory[secondSlot.id].count += firstSlot.inventory[firstSlot.id].count;
                                firstSlot.inventory[firstSlot.id] = null;
                            } else {
                                let count = secondSlot.inventory[secondSlot.id].count + firstSlot.inventory[firstSlot.id].count - secondSlot.inventory[secondSlot.id].max;
                                secondSlot.inventory[secondSlot.id].count = secondSlot.inventory[secondSlot.id].max;
                                firstSlot.inventory[firstSlot.id].count = count;
                            }
                        } else {
                            let slot_tmp = firstSlot.inventory[firstSlot.id];
                            firstSlot.inventory[firstSlot.id] = secondSlot.inventory[secondSlot.id];
                            secondSlot.inventory[secondSlot.id] = slot_tmp;
                        }
                    }
                } else {
                    // перемещаем
                    secondSlot.inventory[secondSlot.id] = firstSlot.inventory[firstSlot.id];
                    firstSlot.inventory[firstSlot.id] = null;
                }
            
                setPlayerInventory(true);
                setMinPlayerInventory();
            }

            dragingSlot = null;
            firstSlot = {
                id: null,
                inventory: null
            };
            secondSlot = {
                id: null,
                inventory: null
            };
        }
    }

    function getSlotByPos(pos, target) {
        if (playerInventory.active) {
            for (let slot_tmp of playerInventory.children) {
                if (collidesWithDot(slot_tmp.absolutePos, slot_tmp.size, pos)) {
                    target.inventory = player.slots;
                    target.id = slot_tmp.children[0].children[0].text.params.i;
                    return slot_tmp.children[0];
                }
            }
        }

        for (let slot_tmp of playerMinInventory.children) {
            if (collidesWithDot(slot_tmp.absolutePos, slot_tmp.size, pos)) {
                target.inventory = player.minSlots;
                target.id = slot_tmp.children[0].children[0].text.params.i;
                return slot_tmp.children[0];
            }
        }

        return null;
    }

    function setItemByPos() {
        for (let slot_tmp of playerInventory.children) {
            if (collidesWithDot(slot_tmp.absolutePos, slot_tmp.size, { x: input.mouse.coordinates.x, y: input.mouse.coordinates.y })) {
                activeInvItem = slot_tmp.children[0].item;
                return;
            }
        }
        activeInvItem = null;
    }

    function getCountItem(params) {
        return player.slots[params.i].count != 1 ? player.slots[params.i].count : '';
    }

    function getCountMinItem(params) {
        return player.minSlots[params.i].count != 1 ? player.minSlots[params.i].count : '';
    }

    function setActiveItem() {
        if (playerInventory.active) {
            setItemByPos();
        } else {
            activeInvItem = null;
        }
    }

    function removeItem() {
        removeItemByPos();
    }

    function removeItemByPos() {
        if (playerInventory.active) {
            for (let slot_tmp of playerInventory.children) {
                if (collidesWithDot(slot_tmp.absolutePos, slot_tmp.size, input.mouse.coordinates.up)) {
                    player.slots[slot_tmp.children[0].children[0].text.params.i] = null;
                    setPlayerInventory(true);
                }
            }
        }

        for (let slot_tmp of playerMinInventory.children) {
            if (collidesWithDot(slot_tmp.absolutePos, slot_tmp.size, input.mouse.coordinates.up)) {
                player.minSlots[slot_tmp.children[0].children[0].text.params.i] = null;
                setMinPlayerInventory();
            }
        }
    }

    window.hood = {
        render: render,
        showPlayerInventory: () => playerInventory.active = !playerInventory.active,
        showPlayerInventoryParam: (show) => playerInventory.active = show,
        setDragItem: setDragItem,
        setMinPlayerInventory: setMinPlayerInventory,
        setPlayerInventory: setPlayerInventory,
        setActiveItem: setActiveItem,
        renderDeath: renderDeath,
        invIsActive: () => { return playerInventory.active },
        removeItem: removeItem,
        renderWin: renderWin
    }
})();