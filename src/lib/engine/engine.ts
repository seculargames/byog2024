import { createMachine } from "xstate";

const GameEngine = createMachine({
    id: 'game',
    initial: 'waiting',
    states: {
        waiting: {
            on: {
                'moves': 'travelling',
            }
        },
        travelling: {
            on: {
                'stops': 'waiting',
            }
        }
    }
});

export default GameEngine;
