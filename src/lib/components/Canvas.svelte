<script lang="ts">
    import { gameParams, gameState, loading } from '../../stores.ts';
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
    import { MS_PER_HOUR } from '$lib/constants.ts';

    import {engine} from '../engine/engine.ts';
    import ContextMenu from './ContextMenu.svelte';

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
    let content;
    for (const loc in $gameParams.locations) {
        modalShows[loc] = false;
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

    if (browser) {
      let last_time = window.performance.now();
      (function update() {
        frame = requestAnimationFrame(update);
        const time = window.performance.now();
        elapsed += Math.min(time - last_time, duration-elapsed)

        last_time= time;
      })();
    }

    let updateGameState = function(currentLocation) {
        console.log("update game state at");
        console.log(currentLocation);
        let user_health = $gameState.user.health;
        let user_energy = $gameState.user.energy;
        let user_alertness = $gameState.user.alertLevel;
        // Calculate user parameters based on the locations
        user_health += $gameParams.locations[currentLocation].drain_rate.health * user_health;
        user_alertness += $gameParams.locations[currentLocation].drain_rate.alertness * user_alertness;
        user_energy = {
            social: clampValue(user_energy.social + $gameParams.locations[currentLocation].drain_rate.energy * user_energy.social),
            weird: clampValue(user_energy.weird + $gameParams.locations[currentLocation].drain_rate.energy * user_energy.weird),
            }
        // Calculate user parameters based on the nearby people
        //TODO: add average of all nearby users user_health += $gameState.locationUserMap[currentLocation].length;

        // Finally update the game statistics for the user.
        $gameState.user.health = clampValue(user_health);
        $gameState.user.energy = user_energy;
        $gameState.user.alertLevel = clampValue(user_alertness);
        console.log(user_health);
        //console.log(user_energy);
        //console.log(user_alertness);
        };

    function updatePlayerStats(currentLocation) {
        console.log("update player stats called at ");
        console.log(currentLocation);
        setInterval(() => {
                updateGameState(currentLocation);
                }, $gameParams.TICK);
            }

    function initializeGameState(canvas) {
        const style = canvas.style('.mycolor', { color: 'pink' });
        canvas.add(style);
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
                add.tspan(location.label).fill('#fff');
            });
        let x = 0;
        let y = 0;
        if ($gameState.state == 'mapcreated') {
            console.log('Map has been created and saved:');
            [x, y] = $gameState.map[loc];
            console.log(`${loc}: ${x}, ${y}`);
        } else {
            [[x, y]] = buildingPositions.splice(Math.floor(Math.random()*buildingPositions.length), 1);
        }
        group.move(x, y)
        label.move(x, y-20);
        group.add(label);
        //Tailwind helper attributes to trigger the modal Menu boxes
        group.data('data-modal-target', `id-${loc}`);
        group.data('data-modal-toggle', `id-${loc}`);
        group.click(() => modalShows[loc] = true);
        group.css('cursor', 'pointer');
        canvas.add(group);
        $gameState.map[loc] = [x,y];
        if (location.label == 'Home' && $gameState.state == 'ready') {
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
            $gameState.map['player'] = [x+30, y];
        }
        if ($gameState.state == 'ready') {
            $gameState.state = 'mapcreated';
        } else {
            const player = canvas.group();
            player.svg(personSvg);
            player.size($gameParams.defaults.player.dimensions.width, $gameParams.defaults.player.dimensions.height);
            const playerLabel = canvas.text(function(add) {
                add.tspan("Player").fill("#fff").css('cursor', 'pointer');
            });
            player.add(playerLabel);
            const [x, y] = $gameState.map['player'];
            player.move(x, y);
            playerLabel.move(x, y-10);
            canvas.add(player);
        }
    }

    loading.set(false);
    }
    onMount(() => {
        window.onload = updatePlayerStats('home');
        //const flowbite = await import('flowbite');
        initFlowbite();
        canvas = SVG().addTo('#canvas').size($gameParams.board.width, $gameParams.board.height);
        initializeGameState(canvas);
    });

    gameState.subscribe((value) => {
        console.log('user health changed. new value:');
        console.log(value);
        if (value.user.health <= 0 || value.user.energy <= 0) {
          goto('/deadpage');
        }
    });
    function parseDurationToMs(duration) {
        const hours = parseFloat(duration.split(" ")[0]);
        return hours * MS_PER_HOUR;
    }
    function clampValue(value) {
        if (value < 0) {
            value = 0;
        } else if (value > 100) {
            value = 100;
        }
        return value;
    }
    const onPlayerAction = (location, choice) => {
        console.log(`Player chose location: ${location.label} and choice: ${choice}`);
        console.log(choice);
        $gameState.time += parseDurationToMs(choice.duration);
        $gameState.user.health = clampValue($gameState.user.health + choice.effect.health);
        $gameState.user.alertness = clampValue($gameState.user.alertness + choice.effect.alertness);
        console.log(typeof choice.effect.energy);
        if (typeof choice.effect.energy == 'object') {
            $gameState.user.energy.social = clampValue($gameState.user.energy.social + choice.effect.energy.social);
            $gameState.user.energy.weird = clampValue($gameState.user.energy.weird + choice.effect.energy.weird);
            $gameState.user.energy.restless = clampValue($gameState.user.energy.restless + choice.effect.energy.restless);
        } else {
            $gameState.user.energy.social = clampValue($gameState.user.energy.social + choice.effect.energy);
            $gameState.user.energy.weird = clampValue($gameState.user.energy.weird + choice.effect.energy);
            $gameState.user.energy.restless = clampValue($gameState.user.energy.restless + choice.effect.energy);
        }
        const [x, y] = $gameState.map[location.key];
        player.move(x+30, y);
        playerLabel.move(x+30, y+10);
        $gameState.map['player'] = [x+30, y];
    }

    const handleMouseDown = event => {
        /* console.log(event); */
        /* console.log(canvas.node); */
        /* console.log(house.node); */
        if (event.target == canvas.node) {
            //player.move(event.pageX-450, event.pageY-50);
            $gameState.user.energy.social -= 10;
        } //else if (event.target == house.node) {
            //player.move(house.x, house.y);
          //}
    };

    onDestroy(() =>{
      /* cancelAnimationFrame(frame); */
    });
</script>

<svelte:window on:mousedown={handleMouseDown} />

{#each Object.entries($gameParams.locations) as [key, location]}
    {#if 'menu' in location}
        <Modal size="xs" defaultClass="bg-gray-800" classHeader="bg-gray-800 text-gray-100" classFooter="bg-gray-800" title={location.menu.title} bind:open={modalShows[key]} autoclose outsideclose>
            <p class="text-base leading-relaxed text-gray-300 dark:text-gray-400">{location.menu.description}</p>
            <Menu location={location} onSelect={onPlayerAction}/>
            <svelte:fragment slot="footer">
                <Button on:click={() => modalShows[key] = false} color="primary">Travel To The Location</Button>
                <Button on:click={() => modalShows[key] = false} color="alternative">Cancel</Button>
            </svelte:fragment>
        </Modal>
    {/if}
{/each}

<div id="canvas">
<div class="content" bind:this={content}>Right click for settings!</div>
<ContextMenu/>
</div>

<style lang="scss">

</style>
