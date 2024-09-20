<script>
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
    import { gameState } from '../stores.ts';
    import Canvas from './Canvas.svelte';

</script>

<svelte:head>
	<title>BYOG24-City Game</title>
	<meta name="description" content="Submission for the BYOG-2024 Game Jam" />
</svelte:head>

<section>
    <Canvas/>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

</style>
