import { Scene } from 'phaser';

export class Boot extends Scene {
	constructor() {
		super('Boot');
	}

	preload() {
		//  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
		//  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

		scene.load.plugin(
			'rexstatemanagerplugin',
			'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexstatemanagerplugin.min.js',
			true
		);
		// initialize the random map generator first
		let initialGameState = engine.igs();
		// draw the map.
		canvas = SVG()
			.addTo('#currentCityCanvas')
			.size(gameParams.board.width, gameParams.board.height);
		drawCity(canvas);
	}

	create() {
		this.scene.start('Preloader');
	}
}
