import { writable,readable } from "svelte/store";

export const canvasSize = readable({
  X: 850,
  Y: 650
});

export const buildingOpts = readable({
  names:['University', 'Home', 'Mall','Library', 'SuicidePark', 'NaturalPark', 'DancePub' ],
  sizes: [50, 100], //, 150, 200, 250 ],
  poss: [ [100,50], [200,100], [300,150], [400,200],
          [500,250], [600, 300], [700,350], [750,400],
          [550, 450], [650, 500], [725,550], [775,590],
  ]
});
export const gameParams = readable({
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

})
export const gameState = writable({

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

export const generateMap = function () {
  let bldg_cnts = Math.floor(Math.random()*10);
  let buildings;
  // let bldg_types = $gameParams.keys();
  for (let i=0; i< bldg_cnts; i++ ) {
    let bldg;
    bldg= {
      size: Math.floor(Math.random() * buildingOpts.sizes.length),
      name: Math.floor(Math.random() * buildingOpts.names.length),
      poss: Math.floor(Math.random() * buildingOpts.poss.length),
    }
    usedPoss.push(bldg.poss);

    buildings[i] = bldg;
  }
return buildings;
}
