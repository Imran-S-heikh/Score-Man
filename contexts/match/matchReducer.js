import { CREATE_MATCH, NEXT_INNINGS } from "./matchTypes";
import AsyncStorage from "@react-native-community/async-storage";
import { ADD_PLAYER_TO_MATCH } from "../palyers/playerTypes";

export default function matchReducer(state, action) {
    switch (action.type) {
        case CREATE_MATCH:
            AsyncStorage.setItem('@liveMatch', JSON.stringify(action.value))
            return action.value;
        case NEXT_INNINGS:
            return { ...state, battingTeam: state.bowlingTeam, bowlingTeam: state.battingTeam }
        case ADD_PLAYER_TO_MATCH:
            return { ...state, ...action.value }


        default:
            return state
    }
}