<script lang="ts">
    import { Button } from 'flowbite-svelte';
    export let location = {};
    export let onSelect = (loc, choice) => {};
</script>

<p class="text-base text-gray-400">
    What would you like to do here:
</p>

{#each Object.entries(location.menu.choices) as [key, value]}
 <div class="flex flex-col flex-wrap py-4 text-gray-300">
     <div>
         <Button on:click={onSelect(location, value)} class="w-full mx-3 text-white bg-primary-800">
            {value.title}
         </Button>
     </div>
     <div>{value.description}</div>
     <div>Duration: {value.duration}</div>
</div>
{/each}
