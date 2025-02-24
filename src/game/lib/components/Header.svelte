<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { gameState, gameParams } from '../../states.ts';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, Input } from 'flowbite-svelte';
	import { Dropdown, DropdownItem, Marquee } from 'flowbite-svelte';
	import { ChevronDownOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
	import Meter from './Meter.svelte';

	let hamburgerOpen = false;
	let display = 'hidden sm:flex';
	let playerStats = false;
	let currentLocation;

	let allHeadlines = $gameParams.headlines;
	let headlines = [];
	$: toggleHamburger = () => {
		hamburgerOpen = !hamburgerOpen;
		display = hamburgerOpen ? 'sm:flex-col' : 'hidden sm:flex';
	};

	$: resetGame = () => {
		//gameState.set(initialState);
		gameState.reset();
	};
	onMount(() => {
		currentLocation = $gameState.currentLocation;
		for (let i = 0; i < 3; i++) {
			headlines.push(allHeadlines.splice(Math.floor(Math.random() * allHeadlines.length), 1)[0]);
		}
	});
</script>

<header class="sticky top-0 z-50 mx-auto bg-opacity-100">
	<Navbar color="black" fluid="true" class="items-center">
		<div class="m-2 flex items-center">
			<p class="m-1 p-2">
				<Button on:click={() => (playerStats = !playerStats)} class="bg-gray-800 text-white">
					Welcome: {$gameState.user.name}
					<ChevronDownOutline class="h-3 w-3 text-white" />
				</Button>
				<Dropdown bind:open={playerStats}>
					{#each Object.keys($gameParams.attributes).filter((k) => k != 'health' && k != 'energy') as ka, ia}
						{#each Object.keys($gameState.user[ka]) as kv, iv}
							<DropdownItem>{ka} - {kv}: {$gameState.user[ka][kv]}</DropdownItem>
						{/each}
					{/each}
				</Dropdown>
			</p>
			<Button on:click={resetGame} class="mx-1 bg-primary-800 px-3 text-white">New Game</Button>
			<p class="m-1 p-1">
				Date &amp; Time: {new Date($gameState.time).toLocaleString()}
			</p>
		</div>
		<div class="sm:hidden md:order-1 md:flex">
			<NavHamburger onClick={toggleHamburger} />
		</div>
		<div class={display}>
			<Meter value={$gameState.user.health} label="Health" id="health" />
			<Meter value={$gameState.user.energy.social} label="Energy" id="energy" />
			<Meter value={$gameState.user.alertLevel} label="Alert Level" id="alert" />
			<!-- <Meter value={$gameState.locationUserMap[currentLocation].length} label="Users Nearby" id="nearby_users" /> -->
		</div>
	</Navbar>
</header>

<Marquee speed={1} hoverSpeed={0.5} class="py-3">
	{#each headlines as headline}
		<p class="mt-1 px-3 text-white">{headline}</p>
	{/each}
</Marquee>

<style lang="scss">
	/* header { */
	/* 	display: flex; */
	/* 	justify-content: space-between; */

	/* label: { */
	/* color: white; */
	/* } */
	/* } */

	/* nav { */
	/* 	display: flex; */
	/* 	justify-content: center; */
	/* 	--background: rgba(255, 255, 255, 0.7); */
	/* } */

	path {
		fill: var(--background);
	}
</style>
