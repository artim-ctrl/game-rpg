"use strict";

// глобальные константы
const scaleAll = 2;

//глобальные переменные
let ctx = null,// контекст (на нем будет все рисовать)
    globalTranslation = { x: 0, y: 0 },// глобальный сдвиг карты (аля камера)
    endPos = null,// глобальный сдвиг карты (аля камера)
    indentMap = 250;// расстояние от краев карты (для сдвига)

let lastTime,// для вычисления отрезка времени от прошлого кадра до нынешнего
    dt = 0;

let player = null;// переменная игрока

(function() {
    resources.load(["source/player.png",// грузим ресуррсы
                    "source/terrain.png",
                    "source/box.png",
                    "source/food.png",
                    "source/weapon.png",
                    "source/enemy.png"]);

    resources.onReady(() => {
        map.setMap({
            mapArray: [// карта
                '###############',
                '#1111111111111#',
                '#1...........1#',
                '#1..~00000~..1#',
                '#1..~00000~..1#',
                '#1...........1#',
                '#1111111111111#',
                '###############'
            ],
            url: 'source/terrain.png',// ссылка на спрайт карты
            sizeBlock: 64,// размер блока карты (в пикселях)
            scaleAll: scaleAll,// масштаб мира
            blockFactor: {
                '1': 0,// деревья
                '#': 1,// холмы
                '~': 2,// кусты
                '.': 3,// трава
                '0': 4// каменная дорожка
            }
        });
        
        // задаем контекст
        let cnv = document.querySelector('#canvas');
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
        ctx = cnv.getContext('2d');

        init();
    });

    function init() {
        lastTime = Date.now();

        endPos = map.getMaxPos();

        player = new Player(getVar('player'));

        input.callbacks.keydown.i = [];
        input.callbacks.keydown.i.push(() => hood.showPlayerInventory());

        input.callbacks.mousedown.push(() => hood.setDragItem(true));
        input.callbacks.mouseup.push(() => hood.setDragItem(false));

        for (let i = 1; i <= player.countMinSlots; i++) {
            input.callbacks.keydown[i] = [];
            input.callbacks.keydown[i].push(() => {
                if (player.minSlots[i]) {
                    player.minSlots[i].use(i);
                }
            });
        }

        input.callbacks.mousemove.push(() => {
            hood.setActiveItem();
        });

        main();
    }
})();

(function() {
    let vars = {
        player: {
            pos: { x: 200, y: 200 },
            size: { x: 26 * scaleAll, y: 36 * scaleAll },
            speed: 0.3,
            stayFrame: 1,
            maxHP: 100,
            sprite: {
                anim: {
                    down: {
                        pos: { x: 0, y: 0 },
                        speed: .01,
                        size: { x: 26, y: 36 },
                        frames: [0, 1, 2]
                    },
                    right: {
                        pos: { x: 0, y: 72 },
                        speed: .01,
                        size: { x: 26, y: 36 },
                        frames: [0, 1, 2]
                    },
                    left: {
                        pos: { x: 0, y: 36 },
                        speed: .01,
                        size: { x: 26, y: 36 },
                        frames: [0, 1, 2]
                    },
                    up: {
                        pos: { x: 0, y: 108 },
                        speed: .01,
                        size: { x: 26, y: 36 },
                        frames: [0, 1, 2]
                    } 
                },
                url: 'source/player.png'
            }
        },
        food: {
            meet_pig: {
                name: 'Свинина',
                id: 'meet_pig',
                max: 10,
                description: 'Свинка пепа. хорошоая была свинка но плохая но блин хорошая черт возьми мы гуляли вместе но пошла она в жопу плохая',
                timeout: 500,
                HP: 10,
                sprite: {
                    url: 'source/food.png',
                    pos: { x: 0, y: 0 },
                    size: { x: 16, y: 16 }
                }
            }
        }
    };

    window.getVar = (key) => {
        let keys = key.split('.');

        if (keys.length != 1) return JSON.parse(JSON.stringify(vars[keys[0]][keys[1]]));

        return JSON.parse(JSON.stringify(vars[key]));
    };
})();