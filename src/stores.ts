import { writable,readable } from "svelte/store";

export const gameParams = readable({
    defaults: {
        buildingDimensions: {
            width: 50,
            height: 50
        },
        buildingPositions: [
            [50, 50],
            [200, 50],
            [350, 50],
            [400, 50],
            [600, 50],
            [100, 200],
            [200, 200],
            [300, 200],
            [400, 200],
            [500, 200],
            [600, 200]
        ],
        player: {
            dimensions: {
                width: 50,
                height: 50
            }
        }
    },
    board: {
        width: 850,
        height: 650,
    },
    locations: {
        university: {
            icon: "building-dome.svg",
            label: "University",
            drain_rate: {
                alertness: 0.01,
                health: 0.05,
                energy: 0.05
            },
            menu: {
                title: "The University is one the city's oldest building and institution",
                description: "There are long winding walkways covered with trees where students and faculty walk around talking in hushed tones",
                choices: {
                    guest_lecture: {
                        title: "Guest Lecture",
                        description: "A guest lecture by a visiting professoor of sociology",
                        duration: "2h",
                    },
                    cafetira: {
                        title: "Hangout at the cafeteria",
                        description: "Spend time with students and faculty at their favourite coffee and snack space",
                        duration: "2h"
                    }
                }
            }
        },
        home: {
            icon: "house.svg",
            label: "Home",
            drain_rate: {
                alertness: -1 * 0.01,
                health: -1 * 0.02,
                energy: -1 * 0.02
            },
            menu: {
                title: "Home at last!",
                description: "You ar at home at last, its not much but you have managed to make it just the space for you",
                choices: {
                    sleep: {
                        title: "Sleep for 4 hours",
                        description: "Get a good power nap going",
                        duration: "4h"
                    }
                }
            }
        },
        library: {
            icon: "building.svg",
            label: "Library",
            drain_rate: {
                alertness: -1 * 0.1,
                health: 0.01,
                energy: 0.01,
            },
            menu: {
                title: "At the local public library",
                description: "The local public library has many books written by a variety of people from all walks of life",
                choices: {
                    read: {
                        title: "Spend time reading a book",
                        description: "Read a book and maybe get a coffee along with it",
                        duration: "2h"
                    }
                }
            }
        },
        suicide_park: {
            icon: "park.svg",
            label: "Suicide Park",
            drain_rate: {
                alertness: -1 * 0.01,
                health: -1 * 0.01,
                energy: -1 * 0.01,
            },
            menu: {
                title: "Sucide Park",
                description: "The park famous for the number of people who regularly choose to end their lives here",
                choices: {
                    rescue: {
                        title: "Rescue someone",
                        description: "Save someone on the brink of ending their life",
                        duration: "2h",
                    }
                }
            }
        },
        dance: {
            icon: "disco.svg",
            label: "Dance Pub",
            drain_rate: {
                alertness: 0.01,
                health: -1 * 0.05,
                energy: -1 * 0.1
            },
            menu: {
                title: "A Dance Pub",
                description: "A popular local place where people go to hangout, get drunk and dance",
                choices: {
                    dance: {
                        title: "Get down!",
                        description: "Spend a few hours letting your hair loose",
                        duration: "2h"
                    }
                }
            }
        }
    }
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
            mirror_neuron_centered: 80,

          },
          gender: {
            agab_conform: 0,
            stereotyped_weak: 50,
            stereotyped_emo: 90,


          },
          sexuality: {
            het_conform: 10,

          },
          alertLevel: 40
  },

});

export const generateMap = function () {
  let bldg_cnts = Math.floor(Math.random()*10);
  let buildings;
  // let bldg_types = $gameParams.keys();
  for (let i=0; i < bldg_cnts; i++ ) {
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
