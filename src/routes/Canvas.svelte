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
    let building;

    onMount(() => {
        canvas = SVG().addTo('#canvas').size(800, 600);
        rect = canvas.rect(100, 100).move(50, 50).fill('#fe0');
        house = canvas.group();
        house.svg(houseSvg);
        house.size(50);
        house.move(400, 300);
        canvas.add(house);

        player = canvas.group();
        player.svg(walkSvg);
        player.size(30);
        player.move(400, 300);

        label = canvas.text(function(add) {
            add.tspan('Player').fill('#fff');
            /* add.tspan('Health').fill('#fff').newLine().dx(10); */
        });
        label.move(400, 280);
        player.add(label);
        canvas.add(player);

        building = canvas.group();
        building.svg(buildingSvg);
        building.size(50);
        building.move(200, 180);
        canvas.add(building);
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
            $gameState.energy.social -= 10;
        } else if (event.target == house.node) {
            player.move(house.x, house.y);
        }
    };
</script>

<svelte:window on:mousedown={handleMouseDown} />

<div id="canvas">

</div>
