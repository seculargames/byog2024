import { loading } from '../../stores.ts';
import { gameParams, gameStateTemp, buildingIconMap } from '../states.ts';
import { Preloader } from '../../game/scenes/Preloader.ts';
const locationSpecificParams = gameParams.locations;

function updatePlayerStats(currentLocation) {
	let tick;
	tick = gameParams.TICK[gameState.worldmap.cities[currentLocation.city].difficulty];
	if (tick) {
		setInterval(() => {
			let result = engine.ugs(gameState, gameParams, currentLocation);
			// Finally update the game statistics for the user.
			gameState.user.health = clampValue(result.health);
			gameState.user.energy = {
				social: clampValue(result.energy.social),
				weird: clampValue(result.energy.weird),
				restless: clampValue(result.energy.restless)
			};
			gameState.user.alertLevel = clampValue(result.alertness);
		}, gameParams.TICK);
	}
}
function createPlayer(canvas) {
	player = canvas.group();
	player.svg(personSvg);
	player.size(
		gameParams.defaults.player.dimensions.width,
		gameParams.defaults.player.dimensions.height
	);

	playerLabel = canvas.text(function (add) {
		add.tspan('Player').fill('#fff').addClass('mycolor').css('cursor', 'pointer');
	});
	player.add(playerLabel);
	const [x, y] = [0, 0];
	//30 to the right of the Home
	//console.debug(`x: ${x}, y: ${y}`);
	const pos = player.point(x, y);
	console.debug(pos);
	player.move(x + 30, y);
	playerLabel.move(x + 30, y - 10);
	canvas.add(player);
}

function drawCity(canvas, cityObj) {
	city = canvas.group();
	city.svg(citySvg);
	city.move(0, 0);
	city.size(800, 600);
	canvas.add(city);
	gameState.locationUserMap[cityObj.id] = new Object();
	gameState.locationUserMap[cityObj.id] = bots.locationUserMap;
	for (const loc in cityObj.locations) {
		const location = cityObj.locations[loc].loc;
		const svg = buildingIconMap[location.icon];
		const group = canvas.group();
		group.svg(svg);
		if ('dimensions' in location) {
			group.size(location.dimensions.width, location.dimensions.height);
		} else {
			group.size(
				gameParams.defaults.buildingDimensions.width,
				gameParams.defaults.buildingDimensions.height
			);
		}
		let elemLabel = location.label + String(Math.floor(Math.random() * 100));
		//update city object location label for easier id, this should reflect globally
		cityObj.locations[loc].label = elemLabel;
		const label = canvas.text(function (add) {
			add.tspan(elemLabel).fill('#fff');
		});
		let x = 0;
		let y = 0;
		// set the locaiton and move it to a random position
		[[x, y]] = location.pos;

		group.move(x, y);
		label.move(x, y - 20);
		group.add(label);
		//Tailwind helper attributes to trigger the modal Menu boxes
		group.data('data-modal-target', `id-${loc.key}`);
		group.data('data-modal-toggle', `id-${loc.key}`);
		group.click(() => (modalShows[loc] = true));
		group.css('cursor', 'pointer');
		canvas.add(group);
		if (location.label == 'Home' && gameState.state == 'ready') {
			house = group;
			let player = createPlayer(canvas);
		}
	}
}

function parseDurationToMs(duration) {
	const hours = parseFloat(duration.split(' ')[0]);
	return hours * MS_PER_HOUR;
}
function clampValue(value) {
	if (value < 0) {
		value = 0;
	} else if (value > 100) {
		value = 100;
	}
	return value;
}
function updatePlayerStatsChoice(location, choice) {
	console.log('update player stats from location', location);
	console.debug(locationSpecificParams);
	// update every type of energy value in user energy.
	if (choice in locationSpecificParams[location.key].menu.choices) {
		Object.keys(gameState.user.energy).map(
			(a) =>
				(gameState.user.energy[a] +=
					locationSpecificParams[location.key].menu.choices[choice].effect.energy)
		);
		// update alertness and health values based on hte choice.
		gameState.user.alertness +=
			locationSpecificParams[location.key].menu.choices[choice].effect.alertness;
		gameState.user.health +=
			locationSpecificParams[location.key].menu.choices[choice].effect.health;
	} else {
		console.debug('no effect on user stats except the global time based effects');
	}
}

export { drawCity };
