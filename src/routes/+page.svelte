<script lang="ts">
	import Counter from './Counter.svelte';
	import type { Scene } from 'phaser';
	import type { MainMenu } from '../game/scenes/MainMenu';
	import PhaserGame, { type TPhaserRef } from '../game/PhaserGame.svelte';

	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';

	import { customParams } from '$lib/gameParamsChanger';

	// The sprite can only be moved in the MainMenu Scene
	let canMoveSprite = false;

	//  References to the PhaserGame component (game and scene are exposed)
	let phaserRef: TPhaserRef = { game: null, scene: null };
	const spritePosition = { x: 0, y: 0 };

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

	const addSprite = () => {
		const scene = phaserRef.scene as Scene;

		if (scene) {
			// Add more stars
			const x = Phaser.Math.Between(64, scene.scale.width - 64);
			const y = Phaser.Math.Between(64, scene.scale.height - 64);

			//  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
			const star = scene.add.sprite(x, y, 'star');

			//  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
			//  You could, of course, do this from within the Phaser Scene code, but this is just an example
			//  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
			scene.add.tween({
				targets: star,
				duration: 500 + Math.random() * 1000,
				alpha: 0,
				yoyo: true,
				repeat: -1
			});
		}
	};

	// Event emitted from the PhaserGame component
	const currentScene = (scene: Scene) => {
		canMoveSprite = scene.scene.key !== 'MainMenu';
	};
	const changeCity = () => {
		customParams.teleport2City();
	};
	const changeDifficulty = () => {
		customParams.changeDifficulty();
	};
	const addPlayers = () => {
		customParams.addPlayers();
	};
</script>

<svelte:head>
	<title>BYOG24-City Game</title>
	<meta name="description" content="Submission for the BYOG-2024 Game Jam" />
	<div id="app" class="container">
		<div class="container">
			<div id="worldCanvas" class="reltopleft">
				<div id="currentCityCanvas" class="reltopright"></div>
				<PhaserGame bind:phaserRef currentActiveScene={currentScene} />
				<div id="mainMenuButtons" class="stytopright">
					<div>
						<button class="button" on:click={changeCity()}>Change City</button>
						<button class="button" on:click={changeDifficulty()}>Change Difficulty</button>
						<button class="button" on:click={addPlayers()}>Add Players</button>
					</div>
					<div>
						<button class="button" disabled={canMoveSprite} on:click={moveSprite}
							>Toggle Movement</button
						>
					</div>
					<div class="spritePosition">
						Sprite Position:
						<pre>{JSON.stringify(spritePosition, null, 2)}</pre>
					</div>
				</div>
			</div>
		</div>
	</div></svelte:head
>

<style>
	.container {
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.reltopleft {
		position: relative;
		top: 8px;
		left: 16px;
		font-size: 18px;
	}
	.stytopright {
		position: sticky;
		top: 0;
		right: 16px;
		font-size: 18px;
	}
	.relbottomleft {
		position: relative;
		bottom: 8px;
		left: 16px;
		font-size: 18px;
	}
	.relbottomright {
		position: relative;
		bottom: 8px;
		right: 16px;
		font-size: 18px;
	}
	.relcenter {
		position: relative;
		top: 50%;
		width: 100%;
		text-align: center;
		font-size: 18px;
	}

	.abstopleft {
		position: absolute;
		top: 8px;
		left: 16px;
		font-size: 18px;
	}
	.abstopright {
		position: absolute;
		top: 8px;
		right: 16px;
		font-size: 18px;
	}
	.absbottomleft {
		position: absolute;
		bottom: 8px;
		left: 16px;
		font-size: 18px;
	}
	.absbottomright {
		position: absolute;
		bottom: 8px;
		right: 16px;
		font-size: 18px;
	}
	.abscenter {
		position: absolute;
		top: 50%;
		width: 100%;
		text-align: center;
		font-size: 18px;
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
