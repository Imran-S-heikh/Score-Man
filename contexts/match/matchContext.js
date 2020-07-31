import React, { createContext, useReducer, useEffect } from 'react'
import { View, Text } from 'react-native';
import matchReducer from './matchReducer';
import AsyncStorage from '@react-native-community/async-storage';
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

export const MatchContext = createContext();

export default function MatchContextProvider(props) {

    const [match,dispatch] = useReducer(matchReducer,initialState)

    useEffect(()=>{
        async function getCurrentMatch() {
            const liveMatch = await AsyncStorage.getItem('@liveMatch');
            if(liveMatch){
                dispatch({type: CREATE_MATCH,value: JSON.parse(liveMatch)})
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
