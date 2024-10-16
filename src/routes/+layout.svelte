<script>
	import Header from '$lib/components/Header.svelte';
    import Spinner from '$lib/components/Spinner.svelte';
    import { gameState, loading } from '../stores.ts';
    import NewGame from '$lib/components/NewGame.svelte';
	import '../app.css';
    import 'flowbite';

    const loader = (node, loading) => {
        let Spin, loadingValue;

        console.debug(`inside loadingCheck: ${node}`);
        console.log(node);
        console.log(loading);

        const unsubscribe = loading.subscribe( loadingState => {
            console.log(loadingState);
            if (loadingState) {
                Spin = new Spinner({target: node, intro: true})
            } else {
                if (Spin) {
                    Spin?.$destroy?.()
                    Spin = undefined;
                }
            }
        })
    }
</script>

{#await loading}
    <Spinner />
{:then}
    {#if $gameState.state == 'init'}
        <NewGame />
    {:else }
        <div class="app container mx-auto bg-gray-900 bg-opacity-100 text-white">
            <Header></Header>

            <main role="main" class="mx-auto relative w-full">
                <slot></slot>
            </main>
        </div>
        <footer class="mt-auto flex flex-col">
            <div class="flex-1">This game was built by Abhillash Parra, Nandhini Korra and Arun for <a href="https://byog.in/">BYOG 2024</a></div>
            <div class="flex-1">
                This game is available on <a href="https://www.seculargames.org/byog2024/">www.seculargames.org/byog2024/</a> and its source code is 
                hosted on github - <a href="https://github.com/seculargames/byog2024/">github.com/seculargames/byog2024</a>
            </div>
            <div class="flex-1">
                This game uses SVGs and icons downloaded from various Creative Commons sites: including the following:
                <ul>
                    <li><a href="https://vecteezy.com">Vecteezy.com</a></li>
                    <li><a href="https://openclipart.org">OpenClipArt.org</a></li>
                    <li><a href="https://wikimedia.org/">Wikimedia</a></li>
                    <li><a href="https://svgrepo.com/">Svgrepo.com</a></li>
                </ul>
            </div>
        </footer>  
    {/if}
{/await}

<style>
	/* .app { */
	/* 	display: flex; */
	/* 	flex-direction: column; */
	/* 	min-height: 100vh; */
	/* } */

	/* main { */
	/* 	flex: 1; */
	/* 	display: flex; */
	/* 	flex-direction: column; */
	/* 	padding: 1rem; */
	/* 	width: 100%; */
	/* 	max-width: 64rem; */
	/* 	margin: 0 auto; */
	/* 	box-sizing: border-box; */
	/* } */

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
