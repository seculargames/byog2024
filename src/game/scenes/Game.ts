import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { drawCity } from '../engine/Canvas';
import { user, gameStatePersisted } from '../stores.ts';

export class Game extends Scene {
	camera: Phaser.Cameras.Scene2D.Camera;
	background: Phaser.GameObjects.Image;
	gameText: Phaser.GameObjects.Text;

	constructor() {
		super('Game');
	}

	create() {
		let gameStateTemp = {
			persistedState: gameStatePersisted.state,
			state: 'waiting',
			time: 0,
			worldmap: { cities: [{ id: 0, name: 'anonymous', tier: 5, difficulty: 'rustic' }] },
			user: {
				name: gameStatePersisted.user_name,
				id: gameStatePersisted.user_id,
				health: 100,
				currentLocation: { city: 0, loc: { name: 'home', pos: [] } },
				energy: {
					social: 100,
					asocial: 100,
					weird: 100
				},
				neuro: gameStatePersisted.user_neuro,
				social: gameStatePersisted.user_social,
				asocial: gameStatePersisted.user_asocial,
				weird: gameStatePersisted.user_weird
			},

			allUsers: new Array(),
			locationUserMap: {
				0: {
					university: new Array(),
					home: new Array(),
					library: new Array(),
					suicide_park: new Array(),
					dance: new Array()
				}
			}
		};
		this.statemgr = new StateManager(config);

		this.camera = this.cameras.main;
		this.camera.setBackgroundColor(0x00ff00);

		this.background = this.add.image(512, 384, 'background');
		this.background.setAlpha(0.5);

		this.gameText = this.add
			.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
				fontFamily: 'Arial Black',
				fontSize: 38,
				color: '#ffffff',
				stroke: '#000000',
				strokeThickness: 8,
				align: 'center'
			})
			.setOrigin(0.5)
			.setDepth(100);

		// draw the map.
		canvas = SVG()
			.addTo('#currentCityCanvas')
			.size(gameParams.board.width, gameParams.board.height);
		initializeGameState(canvas, this);
		//drawCity(canvas, cityObj, this);
		EventBus.emit('current-scene-ready', this);
	}

	changeCity() {
		this.scene.start('GameOver');
	}
}
