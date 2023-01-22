import React, { useContext } from 'react'
import { View, Text, SafeAreaView } from 'react-native'
import PlayerCard from '../../components/PlayerCard'
import { PlayerContext } from '../../contexts/palyers/playerContext'
import { ScrollView } from 'react-native';

export default function Players() {

    const { players }: any = useContext(PlayerContext);

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView>
                <View style={{marginBottom: 20}}>
                    {players.map(player =>
                        <PlayerCard key={player.id} player={player} />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
