import React, { createContext, useReducer } from 'react'
import { View, Text } from 'react-native';
import matchReducer from './matchReducer';

const team =  {
    name: '',
    batting: [],
    bowling: [],
    score: 0,
    extra: 0,
    highlight: [],
    players: []
}


const initialState = {
    teamOne: team,
    teamTwo: team
}

export const MatchContext = createContext();

export default function matchContextProvider(props) {

    const [match,dispatch] = useReducer(matchReducer,initialState)

    return (
        <MatchContext.Provider value={match}>
            {props.children}
        </MatchContext.Provider>
    )
}
