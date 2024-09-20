<script lang="ts">
    import { gameState } from '../stores.ts';
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
    let building, building1, building2, building3, building4;

    onMount(() => {
        canvas = SVG().addTo('#canvas').size(800, 600);
        rect = canvas.rect(100, 100).move(50, 50).fill('#fe0');
        house = canvas.group();
        house.svg(houseSvg);
        house.size(50);
        house.move(400, 300);
        canvas.add(house);
        label = canvas.text(function(add) {
            add.tspan('Home').fill('#fff');
            /* add.tspan('Health').fill('#fff').newLine().dx(10); */
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

        /* Dance pub */
        building1 = canvas.group();
        building1.svg(buildingSvg);
        building1.size(50);
        label = canvas.text(function(add) {
            add.tspan('DancePub').fill('#fff');
        });
        building1.move(500, 380);
        canvas.add(building1);

        /* Suicide Park */
        building2 = canvas.group();
        building2.svg(buildingSvg);
        building2.size(50);
        label = canvas.text(function(add) {
            add.tspan('SuicidePark').fill('#fff');
        });
        building2.move(0, 500);
        canvas.add(building2);


        building3 = canvas.group();
        building3.svg(buildingSvg);
        building3.size(50);
        label = canvas.text(function(add) {
            add.tspan('Quiet Public Library').fill('#fff');
        });
        building3.move(300, 380);
        canvas.add(building3);

        building4 = canvas.group();
        building4.svg(buildingSvg);
        building4.size(50);
        label = canvas.text(function(add) {
            add.tspan('Scenic University').fill('#fff');
        });
        building4.move(400, 480);
        canvas.add(building4); 
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
