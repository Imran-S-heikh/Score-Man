import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import MatchContextProvider, { MatchContext } from '../../contexts/match/matchContext'

function LiveMatch() {

    const {match,dispatch} = useContext(MatchContext);

    
    return (
        <View>
        {console.log(match,'match')}
            <Text>This is a live match</Text>
        </View>
    )
}


export default ()=><MatchContextProvider>
    <LiveMatch/>
</MatchContextProvider>