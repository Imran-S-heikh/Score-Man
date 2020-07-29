import React, { createContext, useReducer, useEffect } from 'react';
import playerReducer from './PlayerReducer';
import AsyncStorage from '@react-native-community/async-storage';
import { SET_PLAYERS } from './playerTypes';

export const PlayerContext = createContext();
export default function PlayerContextProvider(props) {

    const [players,dispatch] = useReducer(playerReducer,[]);

    useEffect(()=>{
        const getPlayers = async ()=>{
            const data = await AsyncStorage.getItem('@players')
            if(data){
                dispatch({type: SET_PLAYERS,value: JSON.parse(data)})
            }
        }
        getPlayers();
    },[])

    return (
        <PlayerContext.Provider value={{players,dispatch}}>
            {props.children}
        </PlayerContext.Provider>
    )
}
