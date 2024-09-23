import {gameState, } from '../../stores.ts';

let updateGameState = function(currentLocation) {
    let user_health = $gameState.user.health;
    let user_energy = $gameState.user.energy;
    let user_alertness = $gameState.user.alertLevel;
    // Calculate user parameters based on the locations
    user_health += $gameParams.locations[location].drain_rate.health * user_health;
    user_alertness += $gameParams.locations[location].drain_rate.alertness * user_alertness;
    user_energy = {
        social: user_energy.social + $gameParams.locations[location].drain_rate.energy * user_energy.social,
        weird: user_energy.weird + $gameParams.locations[location].drain_rate.energy * user_energy.weird,
        }
    // Calculate user parameters based on the nearby people
    user_health += $gameState.locationUserMap[location].length;

    // Finally update the game statistics for the user.
    $gameState.user.health = user_health;
    $gameState.user.energy = user_energy;
    $gameState.user.alertLevel = user_alertness;
    };

let addUser = function (location){
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let counter = 0;
      let rand_id, rand_name;
      length = Math.floor(Math.random() * 10);
      while (counter < length) {
        rand_id += characters.charAt(Math.floor(Math.random() * charactersLength));
        rand_name += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      newUserObj = {
          id: rand_id,
          name: rand_name,
          health: Math.floor(Math.random() * 100),
          energy: {
              social: Math.floor(Math.random() * 100),
              weird: Math.floor(Math.random() * 100),
              restless: Math.floor(Math.random() * 100),
          },
          neuro: {
            interest: Math.floor(Math.random() * 100),
            hyperfocused: Math.floor(Math.random() * 100),
            asocial: Math.floor(Math.random() * 100),
            mirror: Math.floor(Math.random() * 100),
          },
          gender: {
            conform: Math.floor(Math.random() * 100),
            weak: Math.floor(Math.random() * 100),
            emo: Math.floor(Math.random() * 100),
          },
          sexuality: {
            hetero: Math.floor(Math.random() * 100),
            homo: Math.floor(Math.random() * 100),
            ace: Math.floor(Math.random() * 100),
            pan: Math.floor(Math.random() * 100),
          },
          leadership: {
            leader: Math.floor(Math.random() * 100),
            follower: Math.floor(Math.random() * 100),
            ownway: Math.floor(Math.random() * 100),
          },
          social: {
            listener: Math.floor(Math.random() * 100),
            talker: Math.floor(Math.random() * 100),
            observer: Math.floor(Math.random() * 100),
          },
         alertLevel: Math.floor(Math.random() * 100),
      };
      $gameState.no_of_users += 1;
      $gameState.allUsers.push(newUserObj);
      $gameState.locationUserMap[location].push(newUserObj.id);
    };
export { updateGameState, addUser };
