import GameEngine from "$lib/engine/engine";
import { useMachine } from "@xstate/svelte";
// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;
export const engine = GameEngine;
export const engineActor = useMachine(engine);
