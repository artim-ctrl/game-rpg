"use strict";

(function() {
	let pressedKeys = [],
		mouse = {
			clickCoordinates: {
				x: null,
				y: null
			},
			setNull: function() {
				this.clickCoordinates.x = null;
				this.clickCoordinates.y = null;
			},
			coordinates: {
				x: null,
				y: null
			}
		};

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

	document.addEventListener('keydown', (key) => {
		Press(key, true);
	});

	document.addEventListener('keyup', (key) => {
		Press(key, false);
	});

	document.addEventListener('click', (e) => {
		mouse.clickCoordinates.x = e.pageX;
		mouse.clickCoordinates.y = e.pageY;
	});

	document.addEventListener('mousedown', () => {
		mouse.clicked = true;
	});

	document.addEventListener('mouseup', () => {
		mouse.clicked = false;
	});

	document.addEventListener('mousemove', (e) => {
		mouse.coordinates.x = e.pageX;
		mouse.coordinates.y = e.pageY;
	});

	window.input = {
		isPressed: (key) => {
			return pressedKeys[key.toUpperCase()];
		},
		mouse: mouse
	};
})();
