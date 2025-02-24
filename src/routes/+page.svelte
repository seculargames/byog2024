<script lang="ts">
	import Counter from './Counter.svelte';
	import welcome from '../game/lib/images/svelte-welcome.webp';
	import welcome_fallback from '../game/lib/images/svelte-welcome.png';
	import { gameState } from '../stores.ts';

	import type { Scene } from 'phaser';
	import type { MainMenu } from '../game/scenes/MainMenu';
	import PhaserGame, { type TPhaserRef } from '../game/PhaserGame.svelte';

	// The sprite can only be moved in the MainMenu Scene
	let canMoveSprite = false;

	//  References to the PhaserGame component (game and scene are exposed)
	let phaserRef: TPhaserRef = { game: null, scene: null };
	const spritePosition = { x: 0, y: 0 };
	const changeScene = () => {
		const scene = phaserRef.scene as MainMenu;
		if (scene) {
			// Call the changeScene method defined in the `MainMenu`, `Game` and `GameOver` Scenes
			scene.changeScene();
		}
	};
	const moveSprite = () => {
		const scene = phaserRef.scene as MainMenu;

		if (scene) {
			// Get the update logo position
			(scene as MainMenu).moveLogo(({ x, y }) => {
				spritePosition.x = x;
				spritePosition.y = y;
			});
		}
	};
	// Event emitted from the PhaserGame component
	const currentScene = (scene: Scene) => {
		canMoveSprite = scene.scene.key !== 'MainMenu';
	};
</script>

<div id="app">
	<PhaserGame bind:phaserRef currentActiveScene={currentScene} />
	<div>
		<div>
			<button class="button" on:click={changeScene}>Change City</button>
		</div>
		<div>
			<button class="button" disabled={canMoveSprite} on:click={moveSprite}>Toggle Movement</button>
		</div>
		<div class="spritePosition">
			Sprite Position:
			<pre>{JSON.stringify(spritePosition, null, 2)}</pre>
		</div>
		<div>
			<button class="button" on:click={addSprite}>Add New Sprite</button>
		</div>
	</div>
</div>
<svelte:head>
	<title>BYOG24-City Game</title>
	<meta name="description" content="Submission for the BYOG-2024 Game Jam" />
</svelte:head>

<section>
	<Canvas />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}
	#app {
		width: 100%;
		height: 100vh;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.spritePosition {
		margin: 10px 0 0 10px;
		font-size: 0.8em;
	}
	.button {
		width: 140px;
		margin: 10px;
		padding: 10px;
		background-color: #000000;
		color: rgba(255, 255, 255, 0.87);
		border: 1px solid rgba(255, 255, 255, 0.87);
		cursor: pointer;
		transition: all 0.3s;

		&:hover {
			border: 1px solid #0ec3c9;
			color: #0ec3c9;
		}

		&:active {
			background-color: #0ec3c9;
		}

		/* Disabled styles */
		&:disabled {
			cursor: not-allowed;
			border: 1px solid rgba(255, 255, 255, 0.3);
			color: rgba(255, 255, 255, 0.3);
		}
	}
</style>
