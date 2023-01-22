import React, { createContext, useReducer } from 'react'
import appReducer  from './reducer'


const initialState = {
    optionsOpen: false
}

export const AppContext = createContext();

export default function AppContextProvider(props) {

    const [appState,dispatch] = useReducer(appReducer,initialState)

    return (
        <AppContext.Provider value={{appState,dispatch}}>
            {props.children}
        </AppContext.Provider>
    )
}
