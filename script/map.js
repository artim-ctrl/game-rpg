"use strict";

(function() {
  let map = [],// карта
      size = 0,// размер блока текстуры
      scale = 0,// увеличение (общее)
      factor = {},// индекс для идентификации нужного блока на спрайт-карте
      beginPos = [0, 0],// начальная позиция (слева вверху) для отрисовки посередине
      url = "";// ссылка на спрайт-карту для доступа из resources

  function setMap(urlSprite, mapArr, sizeBlock, scaleAll, blockFactor, beginP) {
    url = urlSprite;
    map = mapArr;
    size = sizeBlock;
    scale = scaleAll;
    factor = blockFactor;
    beginPos = beginP;
  }

  function render(ctx, player) {
    for (let j = 0; j < map.length; j++) {
      let elem = map[j];

      for (let i = 0; i < elem.length; i++) {// берем элемент строки (символ блока)
        let x = factor[elem[i]] * size;

        ctx.drawImage(
          resources.get(url),
          x, 0,
          size, size,
          beginPos[0] + size * i * scale + player.globalTranslation[0], beginPos[1] + size * j * scale + player.globalTranslation[1],
          size * scale, size * scale
        );
      }
    }
  }

  window.map = {
    render: render,
    setMap: setMap
  };
})();
