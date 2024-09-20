<script>
	import {onMount, onDestroy} from 'svelte'
	import {humanReadableTime} from './humanReadableTime.js';
	export let timer = -1;
	export	let deleteTimer = () => {};
	
	let paused = false;
	let timeElapsed = 0;
	let interval = null;
	//$: remainingTime = timer - timeElapsed;
	
	onMount(() => {
		interval = setInterval(() => {
			if(paused) {
				return;
			}
			timeElapsed += 1;

			//:if (remainingTime === 0) {
			//:	clearInterval(interval);
			//:	deleteTimer();
			//:}
		}, 1000);
	});
	onDestroy(() => {
		clearInterval(interval);
	});
</script>
<style>
	.progress {
		height: 12px;
	}
	.progress div {
		height: 100%;
		background: #005a9e;
		transition: width .2s ease-out;
	}
	.timer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>

<div class="timer">
	<div>
		<div style="width: {humanReadableTime(timeElapsed)}%;"> </div>
	</div>
	<div>
		<button on:click={() => paused = !paused} aria-label={paused ? "Play" : "Pause"}>
			{#if paused} 
				&#9658;
			{:else}
				&#10073;&#10073;
			{/if}
		</button> 
		<button on:click={deleteTimer}>Delete</button>
	</div>
</div>
<!-- 
  <div class="progress">
	    <div style="width: {timeElapsed / timer * 100}%;"></div>
  </div>
-->
