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

let startEnemyPos = {
    1: null,
    2: null,
    3: null,
    4: null
};

let player = null;// переменная игрока

(function() {
    resources.load(["source/player.png",// грузим ресуррсы
                    "source/terrain.png",
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

        globalTranslation.x = -(endPos.x / 2 - window.innerWidth / 2);
        globalTranslation.y = -(endPos.y / 2 - window.innerHeight / 2);

        player = new Player(getVar('player'));

        input.callbacks.keydown.i = [];
        input.callbacks.keydown.i.push(() => { hood.showPlayerInventory() });

        input.callbacks.keydown.f = [];
        input.callbacks.keydown.f.push(() => { takeItem() });

        input.callbacks.mousedownl.push(() => { hood.setDragItem(true) });
        input.callbacks.mouseupl.push(() => { hood.setDragItem(false) });
        
        input.callbacks.mousedownl.push(() => {
            if (!hood.invIsActive()) {
                if (player.weapon) player.weapon.bump();
            }
        });
        
        input.callbacks.mouseupr.push(() => { hood.removeItem() });

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

        startEnemyPos[1] = { x: 150, y: 150 };
        startEnemyPos[2] = { x: endPos.x - 150, y: 150 };
        startEnemyPos[3] = { x: 150, y: endPos.y - 150 };
        startEnemyPos[4] = { x: endPos.x - 150, y: endPos.y - 150 };

        generateEnemies();

        main();
    }
})();

(function() {
    let vars = {
        player: {
            pos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            size: { x: 26 * scaleAll, y: 36 * scaleAll },
            speed: 0.3,
            stayFrame: 1,
            maxHP: 100,
            countMinSlots: 4,
            countSlots: 9,
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
                description: 'Свинка пепа',
                timeout: 800,
                HP: 3,
                sprite: {
                    url: 'source/food.png',
                    pos: { x: 0, y: 0 },
                    size: { x: 16, y: 16 }
                }
            }
        },
        weapon: {
            igril: {
                name: 'Игриль',
                id: 'igril',
                max: 1,
                pos: { x: null, y: null },
                size: { x: 40 * scaleAll, y: 50 * scaleAll },
                description: 'Детская игрушка',
                timeout: 800,
                HP: 5,
                stayFrame: 0,
                sprite: {
                    pos: { x: 0, y: 0 },// это для отображения в слотах
                    size: { x: 35, y: 31 },

                    anim: {// это анимации для "отважной" битвы xD
                        pos: { x: 0, y: 0 },
                        speed: .01,
                        size: { x: 40, y: 50 },
                        frames: [0, 1, 2]
                    },
                    url: 'source/weapon.png'
                }
            }
        },
        enemy: {
            level_1: {
                pos: { x: null, y: null },
                size: { x: 26 * scaleAll, y: 36 * scaleAll },
                speed: 0.15,
                stayFrame: 1,
                maxHP: 25,
                timeoutHit: 1000,
                countSlots: 2,
                hitHP: 5,
                distance: 85 * scaleAll,
                possible: ['Food:food.meet_pig:0.8'],
                level: 1,
                sprite: {
                    anim: {
                        up: {
                            pos: { x: 0, y: 0 },
                            speed: .01,
                            size: { x: 26, y: 36 },
                            frames: [0, 1, 2]
                        },
                        down: {
                            pos: { x: 0, y: 36 },
                            speed: .01,
                            size: { x: 26, y: 36 },
                            frames: [0, 1, 2]
                        }
                    },
                    url: 'source/enemy.png'
                }
            }
        }
    };

    window.getVar = (key) => {
        let keys = key.split('.');

        if (keys.length != 1) {
            return JSON.parse(JSON.stringify(vars[keys[0]][keys[1]]));
        }

        return JSON.parse(JSON.stringify(vars[key]));
    };

    window.varExist = (key) => {
        let keys = key.split('.');

        if (keys.length != 1) {
            if (!vars[keys[0]][keys[1]]) return false;
        }

        if (!vars[key]) return false;

        return true;
    };
})();