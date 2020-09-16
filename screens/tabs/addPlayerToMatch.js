import React, { useContext, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { Divider, ListItem, Icon, Button } from 'react-native-elements';
import { BaseButton } from 'react-native-gesture-handler';
import Popup from '../../components/Popup';
import { MatchContext } from '../../contexts/match/matchContext';
import { PlayerContext } from '../../contexts/palyers/playerContext';
import { ADD_PLAYER_TO_MATCH } from '../../contexts/palyers/playerTypes';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        marginHorizontal: 5,
        marginTop: 5
    },
    header: {
        textAlign: "center",
        fontSize: 18,
        marginVertical: 10
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    listItem: {
        // flex: 1
        margin: 3
    }
})

export default function addPlayerToMatch() {

    const { match, dispatch } = useContext(MatchContext);
    const { players } = useContext(PlayerContext);

    const battingRef = match.battingTeam.ref;
    const bowlingRef = match.bowlingTeam.ref;

    const battingTeamPlayers = match[battingRef].players;
    const bowlingTeamPlayers = match[bowlingRef].players;
    const currentPlayersId = [...bowlingTeamPlayers,...battingTeamPlayers].map(item=>item.id);
    console.log({currentPlayersId})
    const remainPlayers = players.filter(item=>!currentPlayersId.includes(item.id));

    const battingTeam = match[battingRef]
    const bowlingTeam = match[bowlingRef];

    const [addPlayerPopup,setAddPlayerPopup] = useState({visible: false,title: ''});
    const [addTo,setAddTo] = useState(null);

    console.log({remainPlayers});

    const handleAddPlayer = (plr)=>{
        setAddPlayerPopup({visible: false})
        if(addTo === battingRef){
            battingTeam.players.push(plr)
            dispatch({type: ADD_PLAYER_TO_MATCH,value: {[battingRef]: battingTeam}})
        }
        if(addTo === bowlingRef){
            bowlingTeam.players.push(plr)
            dispatch({type: ADD_PLAYER_TO_MATCH,value: {[bowlingRef]: bowlingTeam}})
        }
    }

    const handleBowlingTeamAdd = ()=>{
        setAddTo(bowlingRef)
        setAddPlayerPopup({visible: true,title: 'Add To Batting Team'})
    }
    const handleBattingTeamAdd = ()=>{
        setAddTo(battingRef)
        setAddPlayerPopup({visible: true,title: 'Add To Bowling Team'})
    }

    return (
        <View>
            <View>
                <Text style={styles.header}>Add Players To the Match</Text>
                <Divider />
            </View>
            <View style={styles.container}>
                <View style={{ flexGrow: 1 }}>
                    <View>
                        <Text style={styles.title}>Batting Team</Text>

                    </View>
                    <View>
                        {battingTeam.players.map(item =>
                            <ListItem key={item.id} style={styles.listItem} title={item.name} rightIcon={
                                <BaseButton>
                                    <Icon name="close" type="antdesign" />
                                </BaseButton>
                            } />
                        )}
                    </View>
                    <View style={{paddingHorizontal: 3}}>
                        <Button onPress={handleBattingTeamAdd} title="Add Player" />
                    </View>
                </View>
                <View style={{ flexGrow: 1 }}>
                    <View>
                        <Text style={styles.title}>Bowling Team</Text>

                    </View>
                    <View>
                        {bowlingTeam.players.map(item =>
                            <ListItem key={item.id} style={styles.listItem} title={item.name} rightIcon={
                                <BaseButton>
                                    <Icon name="close" type="antdesign" />
                                </BaseButton>
                            } />
                        )}
                    </View>
                    <View style={{paddingHorizontal: 3}}>
                        <Button onPress={handleBowlingTeamAdd} title="Add Player" />
                    </View>
                </View>
            </View>
            <Popup visible={addPlayerPopup.visible} id={[]} title={addPlayerPopup.title} players={remainPlayers} handler={handleAddPlayer} />
        </View>
    )
}
