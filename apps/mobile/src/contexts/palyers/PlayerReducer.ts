import { CREATE_PLAYER, SET_PLAYERS, UPDATE_PLAYER_RUN, UPDATE_PLAYER_OVER } from "./playerTypes";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function playerReducer(state, action) {
    switch (action.type) {
        case CREATE_PLAYER:
            AsyncStorage.setItem('@players', JSON.stringify([...state,{ ...action.value, batting: [], bowling: [] }]))
            return [...state, { ...action.value, batting: [], bowling: [] }]

        case SET_PLAYERS:
            return [...action.value]

        case UPDATE_PLAYER_RUN:
            return updateScore([...state], action.id, action.value);

        case UPDATE_PLAYER_OVER:
            return updateOver([...state], action.id, action.value);

        default:
            return state
    }
}

const updateScore = (state, id, value) => {
    //Find The index of the Player
    const index = state.findIndex(player => player.id === id);
    //Get the player
    console.log({id,value})
    const player = state[index];
    // if (!player) {
    //     return state;
    // }
    //Update The Player
    player.batting.push({
        score: value,
        total: value.reduce((accu, val) => accu + Number(!isNaN(val.run) ? val.run : 0 ), 0),
        ballsPlayed: value.length + 1
    });
    //Update The state
    state[index] = player;
    
    AsyncStorage.setItem('@players', JSON.stringify(state));
    return state;
}

const updateOver = (state, id, value) => {
    //Find The index of the Player
    const index = state.findIndex(player => player.id === id);
    //Get the player
    const player = state[index];
    //Update The Player
    player.bowling.push({
        over: value,
        wicket: value.reduce((accu, val) => accu + Number(val.run === 'w' ? 1 : 0), 0),
    });
   
    //Update The state
    state[index] = player;
    AsyncStorage.setItem('@players', JSON.stringify(state));
    return state;
}
