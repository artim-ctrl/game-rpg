(function () {
    let playerInventory = null;

    function render() {
        renderHealth();
        renderPlayerInventory();
    }// дописать тип image в renderMenu, у него отдельный indent, рисуется всегда по центру (родитель - рамочка или рамочка с background)

    function renderPlayerInventory() {
        if (!playerInventory) return;

        let indent = 5;

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
                                    x = (window.innerHeight - params.size.x) / 2;
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

                ctx.font = `${params.font}px sans-serif`;// рисуем текст (количество HP)
                ctx.fillStyle = params.color;
                ctx.fillText(params.text, x, y + params.font);
                break;
        }
    }

    window.hood = {
        render: render,
        setPlayerInventory: inventory => {
            playerImventory = inventory;
        }
    }
})();