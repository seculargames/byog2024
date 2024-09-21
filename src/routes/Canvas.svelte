<script lang="ts">
    import { gameParams, gameState } from '../stores.ts';
    import { onMount, onDestroy } from 'svelte';
    import { SVG } from '@svgdotjs/svg.js';
    import houseSvg from '$lib/images/house.svg?raw';
    import buildingSvg from '$lib/images/building.svg?raw';
    import buildingDomeSvg from '$lib/images/building-dome.svg?raw';
    import walkSvg from '$lib/images/walk.svg?raw';
    import citySvg from '$lib/images/city-map.svg?raw';
    import parkSvg from '$lib/images/park.svg?raw';
    import discoSvg from '$lib/images/disco.svg?raw';

    import { browser } from '$app/environment';

	  import {humanReadableTime} from './humanReadableTime.js';
	 
    let paused = null;
	  function reverseString(str) {
	  	return str.split('').reverse().join('');
	  }

    function handleStartTimer() {
      window.document.timeElapsed = 1;
		  let timer = setInterval(() => {
		  	if(paused) {
		  		return;
		  	}
		  	window.document.timeElapsed += 1;

		  }, 1000);
	  }

    const buildingIconMap = {
        'building.svg': buildingSvg,
        'building-dome.svg': buildingDomeSvg,
        'house.svg': houseSvg,
        'walk.svg': walkSvg,
        'park.svg': parkSvg,
        'disco.svg': discoSvg
    }

    // Game timer and settings
    let elapsed = 0;
    let duration = 5000;
    let frame;

    let canvas;
    let rect;
    let house;
    let player;
    let labelh, labelp;
    let buildings;
    let city;


    onMount(() => {
        if (browser){
          window.onload = handleStartTimer();

        }
        canvas = SVG().addTo('#canvas').size($gameParams.board.width, $gameParams.board.height);
        rect = canvas.rect(100, 100).move(50, 50).fill('#fe0');
        city = canvas.group();
        city.svg(citySvg);
        city.move(0, 0);
        city.size(800, 600);
        canvas.add(city);

        for (const loc in $gameParams.locations) {
            const location = $gameParams.locations[loc];
            const svg = buildingIconMap[location.icon];

            const group = canvas.group();
            group.svg(svg);
            if ('dimensions' in location) {
                group.size(location.dimensions.width, location.dimensions.height);
            } else {
                group.size($gameParams.defaults.buildingDimensions.width, $gameParams.defaults.buildingDimensions.height); 
            }
            const label = canvas.text(function(add) {
                add.tspan(location.label);
            });
            const buildingPositions = $gameParams.defaults.buildingPositions;
            const position = buildingPositions.at(Math.floor(Math.random()*buildingPositions.length));
            group.move(position[0], position[1]);
            label.move(position[0], position[1]-20);
            group.add(label);
            canvas.add(group);
            if (location.label == 'Home') {
                house = group;
            }
        }
    });

    gameState.subscribe((value) => {
        console.log('user health changed. new value:');
        console.log(value);
        if (value === 0) {
          goto('/deadpage');
        }
    });

    const handleMouseDown = event => {
        console.log(event);
        console.log(canvas.node);
        console.log(house.node);
        if (event.target == canvas.node) {
            player.move(event.pageX-450, event.pageY-50);
            $gameState.user.energy.social -= 10;
        } else if (event.target == house.node) {
            player.move(house.x, house.y);
        }
    };

</script>

<svelte:window on:mousedown={handleMouseDown} />
<style>
 .buttons {
 	display: grid;
 	width: 280px;
 	margin: 0 auto;
 	grid-template-columns: 1fr 1fr 1fr;
 	grid-gap: 8px;
 }
 .buttons button {
 	margin: 0;
 }
 .time-set {
 	width: 280px;
 	margin: 0 auto;
 	display: flex;
 	justify-content: space-between;
 }
 .time-display {
 	width: 100%;
 	display: grid;
 	grid-template-columns: 1fr 1fr 1fr;
 	text-align: right;
 	font-size: 20px;
 }
 .time-display span {
 	font-size: 12px;
 	color: #696969;
 }
</style>

<div id="canvas">

  <div class="timer"><div> 
  <div id="survivedTime" style="width: document.timeElapsed%;"> 

  </div> 

  </div> 
  <div> </div> </div> 
  <div class="time-set">
  	<div class="time-display">
  		<div>
  		</div>
  		<div>
  		</div>
  		<div>
      </div>
  	</div>
  </div> 

</div>
