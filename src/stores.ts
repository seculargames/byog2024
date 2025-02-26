import { writable, readable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store';

export const loading = writable(true);
/*export var spaceHoldingDrainer = persisted('spaceHoldingDrainer', {
	value: 0
}); //0, //socialDrainMultiplier(userObj),*/

export let user = writable({
	id: '100',
	name: 'nands',
	health: 100,
	currentLocation: { city: 0, loc: { name: 'home', pos: [] } },
	energy: {
		social: 100,
		asocial: 100,
		weird: 100
	},
	neuro: {
		interest: 100,
		hyperfocused: 100,
		mirror: 100
	},
	gender: {
		conform: 100,
		weak: 100,
		emo: 100
	},
	sexuality: {
		hetero: 0,
		homo: 0,
		pan: 0,
		ace: 0
	},
	/*social: {
            listener: 0,
            talker: 0,
            observer: 0
          },*/

	leadership: {
		leader: 0,
		follower: 0,
		ownway: 0
	},
	alertLevel: 100
});

export let gameStatePersisted = persisted('gameState', {
	state: 'init',
	user_id: user.id,
	user_name: user.name,

	user_neuro: user.neuro,
	user_gender: user.gender,
	user_sexuality: user.sexuality,
	user_leadership: user.leadership
});
