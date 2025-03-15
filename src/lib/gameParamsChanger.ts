//var _ = require('lodash');
import { izip, cycle } from 'itertools';
import { engine } from '../game/engine/engine.ts';
import { gameStatePersisted } from '../stores.ts';
import { gameParams, gameStateTemp } from '../game/states.ts';
import { G } from '@svgdotjs/svg.js';

// pos is cursor position when right click occur
let pos = { x: 0, y: 0 };
// menu is dimension (height and width) of context menu
let menu = { h: 0, y: 0 };
// browser/window dimension (height and width)
let browser = { h: 0, y: 0 };
// showMenu is state of context-menu visibility
let showMenu = false;
// to display some text
let content;

function rightClickContextMenu(e) {
	showMenu = true;
	browser = {
		w: window.innerWidth,
		h: window.innerHeight
	};
	pos = {
		x: e.clientX,
		y: e.clientY
	};
	// If bottom part of context menu will be displayed
	// after right-click, then change the position of the
	// context menu. This position is controlled by `top` and `left`
	// at inline style.
	// Instead of context menu is displayed from top left of cursor position
	// when right-click occur, it will be displayed from bottom left.
	if (browser.h - pos.y < menu.h) pos.y = pos.y - menu.h;
	if (browser.w - pos.x < menu.w) pos.x = pos.x - menu.w;
}
function onPageClick(e) {
	// To make context menu disappear when
	// mouse is clicked outside context menu
	showMenu = false;
}
function getContextMenuDimension(node) {
	// This function will get context menu dimension
	// when navigation is shown => showMenu = true
	let height = node.offsetHeight;
	let width = node.offsetWidth;
	menu = {
		h: height,
		w: width
	};
}
function changeDifficulty() {
	//content.textContent = "Hard/Medium/Easy"
	gameStatePersisted.TICK = cycle(500, 10000, 100000, 0);
}
function addPlayers() {
	let currentLocation = $gameStatePersisted.user.currentLocation;
	let newBot;
	newBot = engine.ab();
	$gameStatePersisted.locationUserMap[currentLocation].push(newBot);
	console.debug($gameStatePersisted.locationUserMap[currentLocation].length);
}
function teleport2City() {}
function settings() {
	content.textContent = 'Settings...';
}
function restart() {
	content.textContent = 'Restart game...';
}
// export dict and vars
const customParams = {
	changeDifficulty: changeDifficulty,
	addPlayers: addPlayers,
	teleport2City: teleport2City,
	settings: settings,
	restart: restart
};
export { customParams };
