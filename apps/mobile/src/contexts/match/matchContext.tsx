import React, { createContext, useReducer, useEffect } from 'react'
import { View, Text } from 'react-native';
import matchReducer from './matchReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CREATE_MATCH } from './matchTypes';

const team =  {
    name: '',
    batting: [],
    bowling: [],
    score: '',
    extra: 0,
    highlight: [],
    players: []
}


const initialState = {
    teamOne: team,
    teamTwo: team,
    battingTeam: {name: 'Team One',ref: 'teamOne'},
    bowlingTeam: {name: 'Team Two',ref: 'teamTwo'}
}

export const MatchContext = createContext(null);

export default function MatchContextProvider(props: any) {

    const [match,dispatch] = useReducer(matchReducer,initialState)

    useEffect(()=>{
        async function getCurrentMatch() {
            const liveMatch = await AsyncStorage.getItem('@liveMatch');
            if(liveMatch){
                (dispatch as any)({type: CREATE_MATCH,value: JSON.parse(liveMatch)})
            }
        }
        getCurrentMatch();
    },[])

    return (
        <MatchContext.Provider value={{match,dispatch}}>
            {props.children}
        </MatchContext.Provider>
    )
}
