import { CREATE_MATCH, NEXT_INNINGS } from "./matchTypes";
import AsyncStorage from "@react-native-community/async-storage";

export default function matchReducer(state,action) {
    switch (action.type) {
        case CREATE_MATCH:
            AsyncStorage.setItem('@liveMatch',JSON.stringify(action.value))
            return action.value;
        case NEXT_INNINGS: 
            return {...state,battingTeam: state.bowlingTeam,bowlingTeam: state.battingTeam}
            
    
        default:
            return state
    }
}