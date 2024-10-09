<script lang="ts">
    import { gameParams, gameState, loading, spaceHoldingDrainer } from '../../stores.ts';
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

    // some component level global variables
    const buildingPositions = $gameParams.defaults.buildingPositions;
    const locationSpecificParams = $gameParams.locations;

    const buildingIconMap = {
        'building.svg': buildingSvg,
        'building-dome.svg': buildingDomeSvg,
        'house.svg': houseSvg,
        'walk.svg': walkSvg,
        'park.svg': parkSvg,
        'disco.svg': discoSvg,
        'person.svg': personSvg
    }

    const socialDrainMultiplier = function(userObj) {
        let result = 0.3
        if(userObj.neuro.asocial > userObj.neuro.mirror) {
            return result + 0.5; // highly socially draining
        }
        if(userObj.leadership.ownway > userObj.leadership.leader || userObj.leadership.ownway > userObj.leadership.follower) {
            return result + 0.3 // above average socially draining to hold space
        }
        if(userObj.gender.conform > userObj.gender.strong ||
           userObj.gender.conform > userObj.gender.emo) {
            return result + 0.1 // easily conforms so not much social battery drain.
        }
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
    let player, playerLabel;
    let buildings;
    let city;
    let currentLocation;

    if (browser) {
      let last_time = window.performance.now();
      (function update() {
        frame = requestAnimationFrame(update);
        const time = window.performance.now();
        elapsed += Math.min(time - last_time, duration-elapsed)

        last_time= time;
      })();
    }

    function updatePlayerStats() {
        tick = $gameParams.TICK[$gameState.worldmap.cities.level];
        if(tick){
          setInterval(() => {
                  let result = engine.ugs($gameState, $gameParams,
                                          currentLocation);
                  // Finally update the game statistics for the user.
                  $gameState.user.health = clampValue(result.health);
                  $gameState.user.energy = {social:  clampValue(result.energy.social),
                                            weird:   clampValue(result.energy.weird),
                                            restless: clampValue(result.energy.restless)
                                            };
                  $gameState.user.alertLevel = clampValue(result.alertness);
                  }, $gameParams.TICK);
              }
          }
    function initializeGameState(canvas) {
        const style = canvas.style('.mycolor', { color: 'pink' });
        $spaceHoldingDrainer = socialDrainMultiplier($gameState.user);
        canvas.add(style);
        let worldMap;
        debugger;
        worldMap = engine.gm();
        for(let i = 0; i < worldMap.cities.length; i++) {
          let cityObj = worldMap.cities[i];
          initializeCity(canvas, cityObj);
          // add bot players
          debugger;
          let bots = engine.gb($gameParams.locations);
          $gameState.allUsers = bots.allUsers;
          console.debug(bots);
        }

        loading.set(false);
    }
    function createPlayer(canvas){
      player = canvas.group();
      player.svg(personSvg);
      player.size($gameParams.defaults.player.dimensions.width, $gameParams.defaults.player.dimensions.height);

      playerLabel = canvas.text(function(add) {
          add.tspan("Player").fill('#fff').addClass('mycolor').css('cursor', 'pointer');
      });
      player.add(playerLabel);
      const [x, y] = [0,0]; 
      //30 to the right of the Home
      //console.debug(`x: ${x}, y: ${y}`);
      const pos = player.point(x,y);
      console.debug(pos);
      player.move(x+30, y);
      playerLabel.move(x+30, y-10)
      canvas.add(player);
      $gameState.worldmap['player'] = [x+30, y];
    }

    function initializeCity(canvas, cityObj) {
        city = canvas.group();
        city.svg(citySvg);
        city.move(0, 0);
        city.size(800, 600);
        canvas.add(city);
        $gameState.locationUserMap = bots.locationUserMap;
        for (const loc in $gameParams.locations) {
            $gameState.locationUserMap[loc] = bots.locationUserMap[loc];
        };
 
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

          // Move the bulidings to a  random place
          [[x, y]] = buildingPositions.splice(Math.floor(Math.random()*buildingPositions.length), 1);

          group.move(x, y)
          label.move(x, y-20);
          group.add(label);
          //Tailwind helper attributes to trigger the modal Menu boxes
          group.data('data-modal-target', `id-${loc}`);
          group.data('data-modal-toggle', `id-${loc}`);
          group.click(() => modalShows[loc] = true);
          group.css('cursor', 'pointer');
          canvas.add(group);
          //$gameState.worldmap[loc] = [x,y];
          if (location.label == 'Home' && $gameState.state == 'ready') {
              house = group;
              let player = createPlayer(canvas);
          }
        }
        if ($gameState.state == 'mapcreated') {
            console.debug('Map has been created and saved:');
            //[x, y] = $gameState.worldmap[loc];
            //console.debug(`${loc}: ${x}, ${y}`);
        } else {
        }

        if ($gameState.state == 'ready') {
            $gameState.state = 'mapcreated';
        } else {
            let player = createPlayer(canvas);
        }
        //player.move(x, y);
        //playerLabel.move(x, y-10);
        //canvas.add(player);
    }
    onMount(() => {
        //const flowbite = await import('flowbite');
        initFlowbite();
        canvas = SVG().addTo('#canvas').size($gameParams.board.width, $gameParams.board.height);
        initializeGameState(canvas);
        window.onload = updatePlayerStats('home');
    });

    gameState.subscribe((value) => {
        console.debug('user health changed. new value:');
        console.debug($gameState.user.energy);
        //console.debug($gameState.user.Location);
        console.debug($gameState.locationUserMap);
        if (value.user.health <= 0 || value.user.energy.social <= 0 || value.user.energy.weird > 50 || value.user.gender.conform < 75 || value.user.social.asocial > 50
                    ) {
          console.debug("dead, go home");
          //goto('/newgame');
        }
        if(value.user.health <= 50) {
            console.debug("You've less than 50% health, Go home and rest");
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
    function updatePlayerStatsChoice(location, choice) {
      console.log("update player stats from location", location);
      console.debug(locationSpecificParams);
      // update every type of energy value in user energy.
      if (choice in locationSpecificParams[location.key].menu.choices ) {
        Object.keys($gameState.user.energy).map( a=> $gameState.user.energy[a]  += locationSpecificParams[location.key].menu.choices[choice].effect.energy);
        // update alertness and health values based on hte choice.
        $gameState.user.alertness += locationSpecificParams[location.key].menu.choices[choice].effect.alertness;
        $gameState.user.health += locationSpecificParams[location.key].menu.choices[choice].effect.health;
      } else {
        console.debug("no effect on user stats except the global time based effects")
      }
    }

    const onPlayerAction = function(location, choice=false) {
        console.debug(`Player chose location: ${location.label} and choice: ${choice}`);
        console.debug(choice);
        // First update the UI;
        const [x, y] = $gameState.worldmap[location.key];
        player.move(x+30, y);
        playerLabel.move(x+30, y+10);
        $gameState.worldmap['player'] = [x+30, y];
        // Now for stats update
        updatePlayerStatsChoice(location, choice);
    }

    const handleMouseDown = event => {
        /* console.debug(event); */
        /* console.debug(canvas.node); */
        /* console.debug(house.node); */
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
            <Menu location={location} onSelect={onPlayerAction(location)}/>
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
