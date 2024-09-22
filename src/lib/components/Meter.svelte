<script lang="ts">
    export let value=0;
    export let label="";
    export let id="";
    export let min=0;
    export let max=100;
    export let low=20;
    export let high=80;
    export let optimum=70;
    export let padding=3;
</script>

<label class="px-{padding}" for={'meter-'+id}>{label}</label>
{#if value >>= 0}
<meter class="tw-meter-bar-slate-200 tw-meter-value-teal-500" 
       id={'meter-'+id} min={min} max={max} low={low} high={high} optimum={optimum} value={value}>{value}/{max}</meter>
{/if}

<style>
    meter {
        border-radius: 10px;
        width: 100px;
    }
</style>
