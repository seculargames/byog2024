import { writable,readable } from "svelte/store";
import { persisted } from 'svelte-persisted-store';

export const loading = writable(true);

export const gameParams = readable({
    TICK: 5000,
    // energy it drains(at every tick) to have one extra player/bot in your location
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
            [600, 200],
            [100, 400],
            [200, 400],
            [300, 400],
            [400, 400],
            [500, 400],
            [600, 400],
            [700, 400],
            [100, 500],
            [200, 500],
            [300, 500],
            [400, 500],
            [500, 500],
            [600, 500],
            [700, 500],
        ],
        player: {
            dimensions: {
                width: 50,
                height: 50
            }
        }
    },
    headlines: [
        "The city's mayor declares an emergency, 2 men spotted holding hands in Sucidie Park!",
        "Climate change is a hoax! Claims new AI chat bot",
        "Spaceship explodes while trying to re-enter earth orbit. Space is too crowded now for safe travel!",
        "AI has caught at least 20 protestors in Rio De Janeiro, before they could even think about protesting",
        "Two lifelong best female friends and roommates(even through marriage and divorce) go to Suicide Park together, and were found dead sweetly embracing each other.",
        "A esoteric cult group known to live in a remote farm found all dead by their own hands without coming to Suicide Park",
    ],
    board: {
        width: 850,
        height: 650,
    },
    attributes: {
        health: "Health",
        loneliness: "How isolated the player is",
        alertness: "How alert they are",
        energy: {
            social: "Social Energy",
            focus: "Type and intensity of Focus",
            restless: "Restless Energy"
        },
        neuro: {
            anxious: "Highly anxious",
            hyperfocused: "Hyper-focused",
            asocial: "No awareness of social cues",
            mirror: "Super empathic, and mirroring others' emotions"
        },
        gender: {
            conform: "Conforming to Assigned Gender",
            rational: "Stereotyped rational",
            emo: "Stereotyped Emo"
        },
        sexuality: {
            genderSpecific: "Attracted to specific gender",
            genderIndifferent: "Attraction not dependent on gender ",
            asexual: "No sexual attraction"
        },
        leadership: {
            leader: 'Being a Leader',
            follower: 'Being a follower',
            ownway: 'Go your own way'
        }
    },
    locations: {
        university: {
            key: "university",
            icon: "building-dome.svg",
            label: "University",
            drain_rate: {
                alertness: 0.01,
                health: -0.01,
                energy: 0.05
            },
            menu: {
                title: "The University is one the city's oldest building and institution",
                description: "There are long winding walkways covered with trees where students and faculty walk around talking in hushed tones",
                choices: {
                    guest_lecture: {
                        title: "Guest Lecture",
                        description: "A guest lecture by a visiting professoor of sociology",
                        duration: "2 h",
                        effect: {
                            alertness: 10,
                            health: 0,
                            energy: -5
                        }
                    },
                    cafetira: {
                        title: "Hangout at the cafeteria",
                        description: "Spend time with students and faculty at their favourite coffee and snack space",
                        duration: "2 h",
                        effect: {
                            alertness: -2,
                            health: 0,
                            energy: 5
                        }
                    }
                }
            }
        },
        home: {
            key: "home",
            icon: "house.svg",
            label: "Home",
            drain_rate: {
                alertness: 1 * 0.01,
                health: 1 * 0.002,
                energy: -1 * 0.02
            },
            menu: {
                title: "Home at last!",
                description: "You ar at home at last, its not much but you have managed to make it just the space for you",
                choices: {
                    sleep: {
                        title: "Sleep for 4 hours",
                        description: "Get a good power nap going",
                        duration: "4 h",
                        effect: {
                            alertness: 10,
                            health: 10,
                            energy: {
                                social: -5,
                                weird: 5,
                                restless: 5
                            }
                        }
                    },
                    sleep8: {
                        title: "Sleep for 8 hours",
                        description: "Get a full night's sleep",
                        duration: "8 h",
                        effect: {
                            alertness: 25,
                            health: 25,
                            energy: 25
                        }
                    }
                }
            }
        },
        library: {
            key: "library",
            icon: "building.svg",
            label: "Library",
            drain_rate: {
                alertness: -1 * 0.1,
                health: -1 * 0.01,
                energy: 0.01,
            },
            menu: {
                title: "At the local public library",
                description: "The local public library has many books written by a variety of people from all walks of life",
                choices: {
                    read: {
                        title: "Spend time reading a book",
                        description: "Read a book and maybe get a coffee along with it",
                        duration: "2 h",
                        effect: {
                            alertness: 5,
                            health: 0,
                            energy: -5
                        }
                    }
                }
            }
        },
        suicide_park: {
            key: "suicide_park",
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
                        duration: "1 h",
                        effect: {
                            alertness: -5,
                            health: -5,
                            energy: -5
                        }
                    },
                    conversation: {
                        title: "Talk to someone",
                        description: "The park despite it's name and reputation is quite popular as a place of solace for many",
                        duration: "2 h",
                        effect: {
                            alertness: -5,
                            health: 1,
                            energy: 2
                        }
                    }
                }
            }
        },
        dance: {
            key: "dance",
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
                        title: "Go dancing!",
                        description: "Spend a couple of hours letting your hair loose",
                        duration: "2 h",
                        effect: {
                            alertness: -10,
                            health: 5,
                            energy: 5
                        }
                    },
                    drink: {
                        title: "Consume some alcohol",
                        description: "Get a few drinks",
                        duration: "2 h",
                        effect: {
                            alertness: -10,
                            health: -10,
                            energy: 10
                        }
                    }
                }
            }
        }
    }
})

export var spaceHoldingDrainer = persisted('spaceHoldingDrainer', 0); //0, //socialDrainMultiplier(userObj),
export const gameState = persisted('gameState', {
    state: 'init',
    time: 0,
    map: {},
    user: {

          id: "100",
          name: 'nands',
          health: 50,
          currentLocation: 'home',
          energy: {
              social: 100,
              asocial: 100,
              weird: 100,
          },
          neuro: {
            interest: 100,
            hyperfocused: 100,
            mirror: 100
          },
          gender: {
            conform: 100,
            weak: 100,
            emo: 100,
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
          alertLevel: 40
  },
  allUsers: new Array(),
  locationUserMap: {
      university: [],
      home: [],
      library: [],
      suicide_park: [],
      dance: [],
  },
});

