import { CREATE_PLAYER, SET_PLAYERS } from "./playerTypes";
import AsyncStorage from '@react-native-community/async-storage';


export default function playerReducer(state,action) {
    switch (action.type) {
        case CREATE_PLAYER:
            AsyncStorage.setItem('@players',JSON.stringify([...state,action.value]))
            return [...state,action.value]
        
        case SET_PLAYERS:
            return [...action.value]
    
        default:
            return state
    }
}