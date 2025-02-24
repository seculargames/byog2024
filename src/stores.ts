import { writable, readable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store';

export const loading = writable(true);
/*export var spaceHoldingDrainer = persisted('spaceHoldingDrainer', {
	value: 0
}); //0, //socialDrainMultiplier(userObj),*/
