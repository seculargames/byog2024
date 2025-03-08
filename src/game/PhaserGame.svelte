<script context="module" lang="ts">
	import type { Game, Scene } from 'phaser';

	export type TPhaserRef = {
		game: Game | null;
		scene: Scene | null;
	};
</script>

<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import Menu from '$lib/components/Menu.svelte';
	import { onMount } from 'svelte';
	import StartGame from './main';
	import { EventBus } from './EventBus';

	import { engine } from './engine/engine.ts';
	import { loading } from '../stores.ts';
	import { gameParams, gameStateTemp } from './states.ts';
	import { gameStatePersisted } from '../stores.ts';

	export let phaserRef: TPhaserRef = {
		game: null,
		scene: null
	};

	export let currentActiveScene: (scene: Scene) => void | undefined;

	//Modal boxes for locations
	let modalShows: Record<String, Boolean>[] = {};
	let content;
	for (const loc in gameParams.locations) {
		modalShows[loc] = false;
	}

	// Game timer and settings
	let elapsed = 0;
	let duration = 5000;
	let frame;

	let canvas;
	let rect;
	let house;
	//let player, playerLabel;
	let buildings;
	let city;
	let currentLocation = $gameStateTemp.user.currentLocation;

	onMount(() => {
		// On adding players button click create count number of bot players
		//let bots = engine.gb(gameParams.locations, count);
        const flowbite = await import('flowbite');
        initFlowbite();
		phaserRef.game = StartGame('game-container');

		EventBus.on('current-scene-ready', (scene_instance: Scene) => {
			phaserRef.scene = scene_instance;

			if (currentActiveScene) {
				currentActiveScene(scene_instance);
			}
		});
	});
	const onPlayerAction = function (location, choice = false) {
		console.debug(`Player chose location: ${location.key} and choice: ${choice}`);
		console.debug(`${location} location`);
		// First update the UI;
		/*for (const loc in currentLocation[city].locations) {
				if (loc.key == location.key) {
					const [x, y] = loc.pos;
				}
			}*/
		let x = $gameStateTemp.user.currentLocation.loc.pos.x;
		let y = $gameStateTemp.user.currentLocation.loc.pos.y;
		player.move(x + 30, y);
		playerLabel.move(x + 30, y + 10);
		$gameStateTemp.user.currentLocation.loc = { name: location.Label, pos: [x + 30, y] };
		// Now for stats update
		updatePlayerStatsChoice(location, choice);
	};
	const handleMouseDown = (event) => {
		/* console.debug(event); */
		/* console.debug(canvas.node); */
		/* console.debug(house.node); */
		if (event.target == canvas.node) {
			//player.move(event.pageX-450, event.pageY-50);
			$gameStateTemp.user.energy.social -= 10;
		} //else if (event.target == house.node) {
		//player.move(house.x, house.y);
		//}
	};

	//onDestroy(() => {
	//	/* cancelAnimationFrame(frame); */
	//});

	/* gameState.subscribe((value) => {
		console.debug('user health changed. new value:');
		console.debug(gameState.user.energy);
		console.debug(gameState.user.currentLocation);
		console.debug(gameState.locationUserMap);
		if (
			value.user.health <= 0 ||
			value.user.energy.social <= 0 ||
			value.user.energy.weird > 50 ||
			value.user.gender.conform < 75 ||
			value.user.social.asocial > 50
		) {
			console.debug('dead, go home');
			//goto('/newgame');
		}
		if (value.user.health <= 50) {
			console.debug("You've less than 50% health, Go home and rest");
		}
	}); */
</script>

<svelte:window on:mousedown={handleMouseDown} />
{#each Object.entries(gameParams.locations) as [key, location]}
	{#if 'menu' in location}
		<Modal
			size="xs"
			defaultClass="bg-gray-800"
			classHeader="bg-gray-800 text-gray-100"
			classFooter="bg-gray-800"
			title={location.menu.title}
			bind:open={modalShows[key]}
			autoclose
			outsideclose
		>
			<p class="text-base leading-relaxed text-gray-300 dark:text-gray-400">
				{location.menu.description}
			</p>
			<Menu {location} onSelect={onPlayerAction(location)} />
			<svelte:fragment slot="footer">
				<Button on:click={() => (modalShows[key] = false)} color="primary"
					>Travel To The Location</Button
				>
				<Button on:click={() => (modalShows[key] = false)} color="alternative">Cancel</Button>
			</svelte:fragment>
		</Modal>
	{/if}
{/each}
