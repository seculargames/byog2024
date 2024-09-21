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
    import personSvg from '$lib/images/person.svg?raw';
    import Menu from '$lib/components/Menu.svelte';
    import { browser } from '$app/environment';
    import { initFlowbite } from 'flowbite';
    import { goto } from '$app/navigation';
    import { Button, Modal } from 'flowbite-svelte';

    const buildingPositions = $gameParams.defaults.buildingPositions;
    const buildingIconMap = {
        'building.svg': buildingSvg,
        'building-dome.svg': buildingDomeSvg,
        'house.svg': houseSvg,
        'walk.svg': walkSvg,
        'park.svg': parkSvg,
        'disco.svg': discoSvg,
        'person.svg': personSvg
    }

    //Modal boxes for locations
    let modalShows: Record<String, Boolean>[] = {};

    for (const loc in $gameParams.locations) {
        modalShows[loc] = false;
    }

    // Game timer and settings
    let elapsed = 0;
    let duration = 5000;
    let frame;
    if (browser) {
      let last_time = window.performance.now();
      (function update() {
        frame = requestAnimationFrame(update);
        const time = window.performance.now();
        elapsed += Math.min(time - last_time, duration-elapsed)

        last_time= time;
      })();
    }

    let canvas;
    let rect;
    let house;
    let player;
    let labelh, labelp;
    let buildings;
    let city;

    let updateGameState = function(currentLocation) {

    }

    onMount(() => {
        //const flowbite = await import('flowbite');
        initFlowbite();
        canvas = SVG().addTo('#canvas').size($gameParams.board.width, $gameParams.board.height);
        const style = canvas.style('.mycolor', { color: 'pink' });
        canvas.add(style);
        city = canvas.group();
        city.svg(citySvg);
        city.move(0, 0);
        city.size(800, 600);
        canvas.add(city);
        
        rect = canvas.rect(100, 100).move(50, 50).fill('#fe0');
        rect.animate(500, 'bounce').move(300, 300);
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
                add.tspan(location.label).fill('#fff');
            });
            const [[x, y]] = buildingPositions.splice(Math.floor(Math.random()*buildingPositions.length), 1);
            group.move(x, y)
            label.move(x, y-20);
            group.add(label);
            //Tailwind helper attributes to trigger the modal Menu boxes
            group.data('data-modal-target', `id-${loc}`);
            group.data('data-modal-toggle', `id-${loc}`);
            group.click(() => modalShows[loc] = true);
            group.css('cursor', 'pointer');
            canvas.add(group);
            if (location.label == 'Home') {
                house = group;

                player = canvas.group();
                player.svg(personSvg);
                player.size($gameParams.defaults.player.dimensions.width, $gameParams.defaults.player.dimensions.height);

                const playerLabel = canvas.text(function(add) {
                    add.tspan("Player").fill('#fff').addClass('mycolor').css('cursor', 'pointer');
                });
                player.add(playerLabel);
                //30 to the right of the Home
                console.log(`x: ${x}, y: ${y}`);
                const pos = player.point(x,y);
                console.log(pos);
                player.move(x+30, y);
                playerLabel.move(x+30, y-10)       
                canvas.add(player);
            }
        }
    });

    gameState.subscribe((value) => {
        console.log('user health changed. new value:');
        console.log(value);
        if (value.user.health === 0) {
          goto('/deadpage');
        }
    });

    const handleMouseDown = event => {
        console.log(event);
        console.log(canvas.node);
        console.log(house.node);
        if (event.target == canvas.node) {
            //player.move(event.pageX-450, event.pageY-50);
            $gameState.user.energy.social -= 10;
        } else if (event.target == house.node) {
            //player.move(house.x, house.y);
        }
    };

    onDestroy(() =>{
      /* cancelAnimationFrame(frame); */
    });
</script>

<svelte:window on:mousedown={handleMouseDown} />

{#each Object.entries($gameParams.locations) as [key, location]}
    {#if 'menu' in location}
        <Modal size="s" title={location.menu.title} bind:open={modalShows[key]} autoclose outsideclose>
            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">{location.menu.description}</p>
            <Menu choices={location.menu.choices} />
            <svelte:fragment slot="footer">
                <Button on:click={() => modalShows[key] = false} color="primary">I accept</Button>
                <Button on:click={() => modalShows[key] = false} color="alternative">Decline</Button>
            </svelte:fragment>
        </Modal>
    {/if}
{/each}

<div id="canvas">
     <label for="time" id="time"> Survived Time: 
       <progress value={elapsed} />
     </label>
</div>

<style lang="scss">
    svg > g > text >  tspan {
        color: white;
        font-weight: bold;
    }

    .mycolor {
        color: pink;
    }
</style>
