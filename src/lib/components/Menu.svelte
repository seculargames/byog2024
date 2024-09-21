<script lang="ts">
    export let choices = {};
</script>

<p class="text-base text-gray-900">
    What would you like to do here:
</p>

{#each Object.entries(choices) as [key, value]}
 <div class="flex flex-row flex-wrap py-4">
     <p>
         <a href={key}>
            {value.title}
         </a>
     </p>
     <span>{value.description}</span><span>{value.duration}</span>
</div>
{/each}
