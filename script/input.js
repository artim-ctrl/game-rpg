"use strict";

(function() {
  let pressedKeys = [];

  function Press(key, status) {
    let code = key.keyCode;

    switch(code) {
      case 37:
        pressedKeys['LEFT'] = status;
        break;
      case 38:
        pressedKeys['UP'] = status;
        break;
      case 39:
        pressedKeys['RIGHT'] = status;
        break;
      case 40:
        pressedKeys['DOWN'] = status;
        break;
      default:
        pressedKeys[String.fromCharCode(code)] = status;// для букв латиницы и кириллицы
    }
  }

  function setNullMouseCoordinates() {
    pressedKeys['MOUSECLICK'] = null;
  }

  document.addEventListener('keydown', (key) => {
    Press(key, true);
  });

  document.addEventListener('keyup', (key) => {
    Press(key, false);
  });

  document.addEventListener('click', (e) => {
    pressedKeys['MOUSECLICK'] = [e.pageX, e.pageY];
  });

  document.addEventListener('mousedown', () => {
    pressedKeys['MOUSE'] = true;
  });

  document.addEventListener('mouseup', () => {
    pressedKeys['MOUSE'] = false;
  });

  window.isPressed = (key) => {
    return pressedKeys[key.toUpperCase()];
  };
  window.setNullMouseCoordinates = setNullMouseCoordinates;
})();
