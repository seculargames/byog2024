import { writable } from "svelte/store";

export const gameState = writable({
    
  start_location: {
    name: 'init',
    drain_rates: {
        'alertness': 0.01, 
        'health': 0.05,
        'energy': 0.05
        },
    },
  home_location: {
    name: 'home',
    drain_rates: {
        'alertness': -1 * 0.01, 
        'health': -1 * 0.05,
        'energy': -1 * 0.05
        },
    },

  univ_location: {
    name: 'University',
    drain_rates: {
        'alertness': -1 * 0.1, 
        'health': 0.1,
        'energy': 0.05
        },
    },

  library_location: {
    name: 'Library',
    drain_rates: {
        'alertness': -1 * 0.1, 
        'health': 0.1,
        'energy': 0.05
        },
    },

  sui_park_location: {
    name: 'SuicidePark',
    drain_rates: {
        'alertness': -1 * 0.1, 
        'health': -1 * 0.1,
        'energy': -1 * 0.1
        },
    },
  dance_pub_location: {
    name: 'DancePub',
    drain_rates: {
        'alertness': 0.1, 
        'health': 0.1,
        'energy': -1 * 0.1
        },
    },

  user: { id: "100",
          name: 'nands',
          health: 50,
          energy: {
              social: 100,
              weird: 100,
          },
          neuro: {
            interest_centered: 100,
            hyper_focus: 100,
            no_social_cues: 100,

          },
          gender: {
            conform: 100,
            stereotyped_weak: 100,
            stereotyped_emo: 100,


          },
          sexuality: {

          },
          alertLevel: 40
  },

});

