import { CREATE_MATCH } from "./matchTypes";
import AsyncStorage from "@react-native-community/async-storage";

export default function matchReducer(state,action) {
    switch (action.type) {
        case CREATE_MATCH:
            AsyncStorage.setItem('@liveMatch',JSON.stringify(action.value))
            return action.value;
            
    
        default:
            return state
    }
}