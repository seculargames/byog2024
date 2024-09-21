<script>
	import {onMount, onDestroy} from 'svelte'
	import {humanReadableTime} from './humanReadableTime.js';
	export let timer = -1;
	export	let deleteTimer = () => {};
	
	let paused = false;
	let timeElapsed = 0;
	let interval = null;
	
	onMount(() => {
		interval = setInterval(() => {
			if(paused) {
				return;
			}
			timeElapsed += 1;

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
	</div>
</div>
