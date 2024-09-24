import { gameParams, gameState, loading } from '../../stores.ts';


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
      return newUserObj;
      //gameState.no_of_users += 1;
      //gameState.allUsers.push(newUserObj);
      //gameState.locationUserMap[location].push(newUserObj.id);
    };

const engine = { au: addUser };
export { engine };
