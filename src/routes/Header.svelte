<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';

  import { onMount, onDestroy } from 'svelte';
  import { gameState } from '../stores.ts';
  import { browser } from '$app/environment';
  import {humanReadableTime} from './humanReadableTime.js';
  let paused = null;
  let timeElapsed = 1;

  function handleStartTimer() {
    let timer = setInterval(() => {
      if(paused) {
        return;
      }
      timeElapsed += 1;
      window.document.getElementById('survivedTime').innerHTML= humanReadableTime(timeElapsed);
    }, 1000);
  }
  onMount(() => {
    if (browser){
      window.onload = handleStartTimer();
    }
  });

</script>

<header>
    <nav class="flex fixed w-screen">
        <div class="flex-1 flex justify-center mr-auto">
          <div id="survivedTime" style="width: {humanReadableTime(timeElapsed)}%;"> 

          </div>

        </div>
        <div class="mx-12">
            <label for="health">Health:</label>
            <meter class="tw-meter-bar-slate-200 tw-meter-value-teal-500" 
                id="health" min="0" max="100" low="20" high="80" optimum="80" value="{$gameState.user.health}">{$gameState.user.health}/100</meter>
            <label for="energy">Energy:</label>
            <meter class="tw-meter-bar-cyan-400 tw-meter-value-red-500" id="energy"
                   min="0" max="100" low="20" high="80" optimum="80" value="{$gameState.user.energy.social}">{$gameState.user.energy.social}</meter>
 

        </div>
        <div class="flex-1 flex justify-center ml-auto">
            <label for="warning">Alert Level:</label>
            <meter class="tw-meter-bar-blue-300 tw-meter-value-red-300" id="warning"
                   min="0" max="100" low="10" high="60" optimum="15" value="{$gameState.user.alertLevel}">{$gameState.user.alertLevel}</meter>
        </div>
    </nav>
</header>

<style lang="scss">
	header {
		display: flex;
		justify-content: space-between;

        label: {
            color: white;
        }
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

    meter {
        border-radius: 10px;
        width: 100px;
    }

	path {
		fill: var(--background);
	}
</style>
