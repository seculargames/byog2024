<script lang="ts">
    import { gameState, gameParams } from '../../stores.ts';
    import { Label, Input, Button } from 'flowbite-svelte';
    import personSvg from '$lib/images/person-outline.svg?raw';
    import Wheel from '$lib/components/Wheel.svelte';
    import { MS_PER_MINUTE, MS_PER_HOUR, MS_PER_DAY, MS_PER_MONTH, MS_PER_YEAR } from '$lib/constants.ts';
    import { goto } from '$app/navigation';

    let neuroValues = [0, 0, 0];
    let genderValues = [0, 0, 0];
    let sexualityValues = [0, 0, 0];
    let energyValues = [0, 0, 0];
    let leadershipValues = [0, 0, 0];
    let aboutGameShown = false;

    const attrKeyVariableMap = {
        'neuro': {
            label: 'Neurodivergence',
            description: 'All the ways that your brain thinks that uniquely makes you who you are',
            var: neuroValues
        },    
        'gender': {
            label: 'Gender Identity',
            description: 'How gender feels in your body and how your express gender',
            var: genderValues
        },
        'sexuality': {
            label: 'Sexual Preference',
            description: 'Who are you attracted to',
            var: sexualityValues
        },
        'energy': {
            label: 'Energy Style',
            description: 'What kind of person are you energy-wise',
            var: energyValues
        },
        'leadership': {
            label: 'Leadership Style',
            description: 'How do you handle associating with others',
            var: leadershipValues
        }
    }
    let name = "";

    function save() {
        if (name == '') {
            alert('Please enter your character\'s name');
            return;
        }
        const now = new Date();
        const ms = now.getTime();
        const gameTime = ms + MS_PER_YEAR * 10 + Math.random() * 2 * MS_PER_YEAR;
        $gameState.time = gameTime;
        $gameState.user.name = name;
        $gameState.user.health = 100;
        $gameState.user.alertness = 100;
        $gameState.user.energy.social = 100;
        $gameState.user.energy.weird = 100;
        $gameState.user.energy.restless = 100;
        for (const [k, v] of Object.entries(attrKeyVariableMap)) {
            let i = 0;
            for (const [ka, va] of Object.entries($gameParams.attributes[k])) {
                $gameState.user[k][ka] = v.var[i++];
            }
        }
        $gameState.state = 'ready';
        goto('/');
    }

    function getLabels(attribute) {
      console.log(attribute);
      return Object.keys($gameParams.attributes[attribute]).map(k => $gameParams.attributes[attribute][k]); 
    }
</script>

<div class="container mx-auto w-full text-white">
    {#if aboutGameShown }
    <div class="mb-3">
        <Label for="name" class="block mb-2 text-lg text-white">Please enter your character's name:</Label>
            <Input id="name" placeholder="Name" bind:value={name} />
    </div>
    <div id="personMap" class="content-start pl-40 w-full">
        <div class="flex flex-row">
            <div class="hidden md:block">
                {@html personSvg}
            </div>
            <div>
                Please answer the following questions about your character:
                <ul>
                    {#each Object.keys(attrKeyVariableMap) as k, i}
                        <li>{attrKeyVariableMap[k].label} - {attrKeyVariableMap[k].description} : <Wheel triad={getLabels(k)} bind:values={attrKeyVariableMap[k]['var']} /></li>
                            <li>{attrKeyVariableMap[k].label} set values: 
                                {#each Object.keys($gameParams.attributes[k]) as ka, ia }
                                    <p>{$gameParams.attributes[k][ka]}: {attrKeyVariableMap[k]['var'][ia]}</p>
                                {/each}
                            </li>
                    {/each}
                </ul>
                <button on:click={save} class="px-3 bg-primary-800 text-white">
                    Save
                </button>
            </div>
        </div>
    </div>
    {:else}
        <div class="mx-auto text-white bg-gray-800 text-lg mt-5">
            Welcome to the yet to be titled game. You are a traveler in time, you are in an unknown city some 10 years or more in the future. You have your home 
            where you are located. And you have a map full of locations to explore in the city map that is shown. Please click on each building for options on what you 
            can do. In this dark future, the social police are constantly looking out for anyone who doesn't fit into social norms. Anyone who is a loner, or prefers
            to be by themselves is targeted by a new AI system build collectively by the biggest corporations. These AI systems are trained to see how you respond 
            to social media, how many posts you like and to see if you are social or not. The AI overlords have determined that people who stray from being social,
            are often the trouble makers. And therefore after being trained on centuries of histories of dissidence, the AI is now able to detect loners and 
            transgressors even before they know themselves. Your challenge is to not get caught by this AI system. That is being fed not only on everyone's social media
            posts but live feeds from CCTVs installed all over the world. All world governments have given over to this AI based alogrithmic policing system, to 
            decide who is ok and who is not ok.
        </div>
        <div class="mx-auto text-white bg-gray-800 text-lg mt-3">
            You will be taken to another screen where you can enter details about your character, like their name, and their attributes. Please think carefully 
            about your characters attributes, what makes them tick. It will impact your gameplay profoundly.
        </div>
        <div class="mr-auto justify-end text-white bg-gray-800 text-lg mt-3 w-full">
            <Button size="md" on:click={() => aboutGameShown = true} class="text-white bg-primary-800">Move to Next Screen</Button>
        </div>
    {/if}
</div>

