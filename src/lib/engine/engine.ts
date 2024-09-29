import { gameParams, gameState, loading } from '../../stores.ts';
import {mean} from 'mathjs';

//TODO: move most of the game mechanics logic that's not UI here instead of context menu, canvas
//svelte components
let genMap = function() {
      //let city_cnts = Math.floor(Math.random() * 10);
      let city_cnts = 1;
      for(let i = 0; i++; i < city_cnts){
        canvas.city = new Array();
        let location_cnts = Math.floor(Math.random()*10);
        for(let i = 0; i++; i < location_cnts){
          let chosen_loc = gameParams.locations[Math.random() * gameParams.locations.length];
          let bot = addBot();
          canvas.city.locations.push({chosen_loc: [bot] })
        }
      }
};

let addBot= function (){
      // Generate some random initial players for each location
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let counter = 0;
      let rand_id, rand_name;
      length = Math.floor(Math.random() * 10);
      while (counter < length) {
        rand_id += characters.charAt(Math.floor(Math.random() * characters.Length));
        rand_name += characters.charAt(Math.floor(Math.random() * characters.Length));
        counter += 1;
      }
      let newUserObj = {
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
      return newUserObj;
      //gameState.no_of_users += 1;
      //gameState.allUsers.push(newUserObj);
      //gameState.locationUserMap[location].push(newUserObj.id);
    };

let updateGameState = function(userStats, gameParams, currentLocation, ) {
        console.log("update game state at");
        console.log(currentLocation);
        console.log(userStats.user.health);
        console.log(userStats.user.energy);
        console.log(userStats.user.alertLevel);

        let user_health = userStats.user.health;
        let user_energy = userStats.user.energy;
        let user_alertness = userStats.user.alertLevel;
        // Calculate user parameters based on the locations
        user_health += gameParams.locations[currentLocation].drain_rate.health * user_health;
        user_alertness += gameParams.locations[currentLocation].drain_rate.alertness * user_alertness;
        user_energy = {
            social: user_energy.social + gameParams.locations[currentLocation].drain_rate.energy * user_energy.social,
            weird: user_energy.weird + gameParams.locations[currentLocation].drain_rate.energy * user_energy.weird,
            restless: user_energy.restless + gameParams.locations[currentLocation].drain_rate.energy * user_energy.restless,
            }
        if (userStats.locationUserMap[currentLocation].length > 0) {
            // Calculate user parameters based on the nearby people
            user_health += mean(userStats.locationUserMap[currentLocation].map( a=> a.health));
            //TODO: explore the other attribute values and how they affect/impact each other's values in
            //a group setting
            user_energy = {
                social: user_energy.social +
                            // average social energy, probbaly wrong logic
                            mean(userStats.locationUserMap[currentLocation].map( a=> a.energy.social)) +
                            // Idea being holding space for too many people can drain one's social battery
                            userStats.locationUserMap[currentLocation].length * gameParams.spaceHoldingDrainer,
                weird: user_energy.weird+
                            // average weird energy, probbaly wrong logic
                            mean(userStats.locationUserMap[currentLocation].map( a=> a.energy.weird)) + // Idea being holding space for too many people can drain one's social battery
                            userStats.locationUserMap[currentLocation].length * gameParams.SPACEHOLDINGDRAINER,
                restless: user_energy.restless +
                            // average restless energy, probbaly wrong logic
                            mean(userStats.locationUserMap[currentLocation].map( a=> a.energy.restless)) +
                            // Idea being holding space for too many people can drain one's social battery
                            userStats.locationUserMap[currentLocation].length * gameParams.SPACEHOLDINGDRAINER,

                }

            user_alertness += userStats.locationUserMap[currentLocation].length * gameParams.SPACEHOLDINGDRAINER;
        }

        return {
                health: user_health,
                energy: user_energy,
                alertness: user_alertness,
                locationUserMap: userStats.locationUserMap,
            };
        };


let genBots = function(locations) {
    let crowd;
    let allUsers = new Array();
    let locationUserMap = new Array();
    for (const loc in locations) {
        switch(loc) {
            case 'home':
                crowd = 2;
            case 'university':
                crowd = 20;
            case 'library':
                crowd = 5;
            case 'suicide_park':
                crowd = 5;
            case 'dance':
                crowd = 10;
            default:
                crowd = 1;
        }

    for (let i = 0; i < crowd; i++) {
        let newBot;
        newBot = engine.ab();
        locationUserMap.push({loc: newBot});
        allUsers.push(newBot.id);
        }
    }
    return { allUsers: allUsers,
             locationUserMap: locationUserMap,
    }
}
const engine = {
                 ab: addBot,
                 ugs: updateGameState,
                 gb: genBots
                };
export { engine };
