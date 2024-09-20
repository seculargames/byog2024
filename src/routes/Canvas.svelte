<script >
    import { gameState, canvasSize, buildingOpts } from '../stores.ts';
    import { onMount, onDestroy } from 'svelte';
    import { SVG } from '@svgdotjs/svg.js';
    import houseSvg from '$lib/images/house.svg?raw';
    import buildingSvg from '$lib/images/building.svg?raw';
    import walkSvg from '$lib/images/walk.svg?raw';
    import { browser } from '$app/environment';
    import Timer from './Timers.svelte';

    function handleAddTime(e) {
		  const nextValue = e.target.innerText;
		  if (nextValue === '0' && value.length === 0 || value.length === 6) {
		  		return;
		  }
		  value += nextValue;
	  }
	  function handleDeleteLastValue() {
	  	value = value.substr(0, value.length - 1);
	  }
	  function reverseString(str) {
	  	return str.split('').reverse().join('');
	  }
	  $: valueReversed = reverseString(value);
	  $: seconds = reverseString(valueReversed.substr(0,2));
	  $: minutes = reverseString(valueReversed.substr(2,2));
	  $: hours = reverseString(valueReversed.substr(4,2));
	
	function handleStartTimer() {
		const timeInSeconds = Number(seconds) + (Number(minutes) * 60) + (Number(hours) * 60 * 60);
		timers = [...timers, {
			time: timeInSeconds,
			id: new Date().toISOString(),
		}];
		value = '';
	}
	function deleteTimer(id) {
		timers = timers.filter(t => t.id !== id);
	}

    let canvas;
    let house;
    let player;
    let rect;
    let labelh, labelp;
    let buildings;
    let duration='42';
    let timers = [{ time: 53, id: '123'}];

    onMount(() => {
        // Game timer and settings
        let elapsed = 0;
        let duration = 5000;
        let frame;
        let last_time = window.performance.now();
        (function update() {
          //frame = requestAnimationFrame(update);
          const time = window.performance.now();
          elapsed += Math.min(time - last_time, duration-elapsed)

          last_time= time;
        })();

        let updateGameState = function(currentLocation) {

        }
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

        canvas = SVG().addTo('#canvas').size($canvasSize.X,  $canvasSize.Y);
        timer = canvas.group();
        timer.innerHTML += '<div id="timer"> <label for="time", id="time"> Survived Time: <progress value={elapsed} /> </label> </div> '
        header = canvas.add(timer)
        rect = canvas.rect(100, 100).move(50, 50).fill('#fe0');
        house = canvas.group();
        house.svg(houseSvg);
        house.size(50);
        house.move(400, 300);
        canvas.add(house);
        labelh = canvas.text(function(add) {
            add.tspan('Home').fill('#fff');
        });

        player = canvas.group();
        player.svg(walkSvg);
        player.size(30);
        player.move(400, 300);

        labelp = canvas.text(function(add) {
            add.tspan('Player').fill('#fff');
        });
        labelp.move(400, 280);
        player.add(labelp);
        canvas.add(player);

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

        console.log('user health changed. new value:');
        console.log(value);
        let health=value.user.health;
        if (health=== 0) {
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

    onDestroy(() =>{
      // cancelAnimationFrame(frame);
    });
</script>

<svelte:window on:mousedown={handleMouseDown} />

