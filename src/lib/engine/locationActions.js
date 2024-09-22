import { gameState } from '../../stores.ts';

export function universityVisitCafeteria() {
    gameState.update(state => state.user.health += 1);
}
