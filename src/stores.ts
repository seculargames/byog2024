import { writable } from "svelte/store";

export const gameState = writable({
    location: 'init',
    health: 50,
    energy: {
        social: 100,
        wierd: 100,
    },
    neuro: {

    },
    gender: {

    },
    sexuality: {

    },
    alertLevel: 40 
});

