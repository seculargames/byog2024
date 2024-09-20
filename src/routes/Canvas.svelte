<script lang="ts">
    import { gameState, canvasSize, buildingOpts } from '../stores.ts';
    import {updateGameState} from '../engine.ts'
    import { onMount } from 'svelte';
    import { SVG } from '@svgdotjs/svg.js';
    import houseSvg from '$lib/images/house.svg?raw';
    import buildingSvg from '$lib/images/building.svg?raw';
    import walkSvg from '$lib/images/walk.svg?raw';

    let canvas;
    let rect;
    let house;
    let player;
    let label;
    let buildings;
    let generateMap = function () {
      let bldg_cnts = Math.floor(Math.random()*10);
      let buildings;
      // let bldg_types = $gameParams.keys();
      for (let i=0; i< bldg_cnts; i++ ) {
        let bldg;
        bldg= {
          size: Math.floor(Math.random() * $buildingOpts.sizes.length),
          name: Math.floor(Math.random() * $buildingOpts.names.length),
          poss: Math.floor(Math.random() * $buildingOpts.poss.length),
        }
        console.log(buildings);
        buildings.push(bldg);
      }
    return buildings;
    }

    onMount(() => {
        canvas = SVG().addTo('#canvas').size($canvasSize.X,  $canvasSize.Y);
        rect = canvas.rect(100, 100).move(50, 50).fill('#fe0');
        house = canvas.group();
        house.svg(houseSvg);
        house.size(50);
        house.move(400, 300);
        canvas.add(house);
        label = canvas.text(function(add) {
            add.tspan('Home').fill('#fff');
        });

        player = canvas.group();
        player.svg(walkSvg);
        player.size(30);
        player.move(400, 300);

        label = canvas.text(function(add) {
            add.tspan('Player').fill('#fff');
        });
        label.move(400, 280);
        player.add(label);
        canvas.add(player);

        //bldgs = generateMap()
        let bldg_cnts = Math.floor(Math.random()*10);
        for(let i=0; i < bldg_cnts; i++ ) {
          let bldg, lbl;
          bldg = canvas.group();
          bldg.svg(buildingSvg);
          let poss;
          poss = $buildingOpts.poss[Math.floor(Math.random() * $buildingOpts.poss.length)];
          bldg.size($buildingOpts.sizes[Math.floor(Math.random() * $buildingOpts.sizes.length)]);
          bldg.move(poss);
          name = $buildingOpts.names[Math.floor(Math.random() * $buildingOpts.names.length)];
          lbl = canvas.text(function(add) {
            add.tspan(name).fill('#fff');
          });
          lbl.move(poss[0], poss[1]-20);
        }
    });

    gameState.subscribe((value) => {
        console.log('gameState changed. new value:');
        console.log(value);
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

<div id="canvas">

</div>
