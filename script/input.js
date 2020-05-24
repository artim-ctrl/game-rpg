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
				down: {
					x: null,
					y: null
				},
				up: {
					x: null,
					y: null
				},
				x: null,
				y: null
			}
		},
		callbacks = {// колбэки срабатывабщие по событию
			mouseupl: [],
			mousedownl: [],
			mouseupr: [],
			mousedownr: [],
			keydown: {},// обьект потому что клавиш много, на каждую можно повесить событие
			keyup: {},
			mousemove: []
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
		let was = false;
		if (pressedKeys[key.key.toUpperCase()]) was = true;

		Press(key, true);

		if (!was)
			playCallbacks('keydown', key.key);
	});

	document.addEventListener('keyup', (key) => {
		Press(key, false);

		playCallbacks('keyup', key.key);
	});

	document.addEventListener('click', (e) => {
		mouse.clickCoordinates.x = e.pageX;
		mouse.clickCoordinates.y = e.pageY;
	});

	document.addEventListener('mousedown', (e) => {
		mouse.clicked = true;

		mouse.coordinates.down.x = e.pageX;
		mouse.coordinates.down.y = e.pageY;
		
		playCallbacks('mousedown' + (e.button == 0 ? 'l' : 'r'));
	});

	document.addEventListener('mouseup', (e) => {
		mouse.clicked = false;
		
		mouse.coordinates.up.x = e.pageX;
		mouse.coordinates.up.y = e.pageY;

		playCallbacks('mouseup' + (e.button == 0 ? 'l' : 'r'));
	});

	document.addEventListener('mousemove', (e) => {
		mouse.coordinates.x = e.pageX;
		mouse.coordinates.y = e.pageY;

		playCallbacks('mousemove');
	});

	document.addEventListener('contextmenu', (e) => {
		e.preventDefault();
	});

	function playCallbacks(caller, key = null) {
		if (key) {
			if (callbacks[caller][key]) {
				callbacks[caller][key].forEach(callback => callback());
			}
			return;
		}

		callbacks[caller].forEach(callback => callback());
	}

	window.input = {
		isPressed: (key) => {
			return pressedKeys[key.toUpperCase()];
		},
		mouse: mouse,
		callbacks: callbacks
	};
})();
