//var _ = require('lodash');
import { izip, cycle } from 'itertools';
import { engine } from '../engine/engine.ts';
import { gameStatePersisted } from '../../../stores.ts';
import { gameParams, gameStateTemp } from '../../states.ts';
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
	let currentLocation = gameState.user.currentLocation;
	let newBot;
	newBot = engine.ab();
	gameState.locationUserMap[currentLocation].push(newBot);
	console.debug(gameState.locationUserMap[currentLocation].length);
}
function teleport2City() {}
function settings() {
	content.textContent = 'Settings...';
}
function restart() {
	content.textContent = 'Restart game...';
}
let menuItems = [
	{
		name: 'difficulty',
		onClick: difficulty,
		displayText: 'Difficulty Level',
		class: 'fa-solid fa-plus'
	},
	{
		name: 'Add more People',
		onClick: addPlayers,
		displayText: 'Add People',
		class: 'fa-solid fa-square'
	},
	{
		name: 'Teleport 2 different City',
		onClick: teleport2City,
		displayText: 'Teleport',
		class: 'fa-solid fa-magnifying-glass'
	},
	{
		name: 'setting',
		onClick: settings,
		displayText: 'Settings',
		class: 'fa-solid fa-print'
	},
	{
		name: 'restart',
		onClick: restart,
		displayText: 'Restart',
		class: 'fa-solid fa-trash-can'
	}
];
// export dict and vars
const customParams = {
	difficulty: changeDifficulty,
	addPlayers: addPlayers,
	teleport2City: teleport2City,
	settings: settings,
	restart: restart
};
export { customParams };
