import React, { useState, useContext, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PlayerContextProvider, { PlayerContext } from '../../contexts/palyers/playerContext'
import { Input, CheckBox, ListItem, Button, Icon, Overlay, Divider } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import MatchContextProvider, { MatchContext } from '../../contexts/match/matchContext';
import { uuid } from '../../utils';
import { CREATE_MATCH } from '../../contexts/match/matchTypes';

const styles = StyleSheet.create({
    inline: {
        display: 'flex',
        flexDirection: 'row'
    },
    inlineItem: {
        flexGrow: 1
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 5
    },
    teamName: {
        backgroundColor: 'gray',
        textAlign: 'center',
        borderRadius: 3,
        fontSize: 18,
        paddingVertical: 10,
        fontWeight: 'bold',
        color: '#fff'
    }

});



function CreateMatch() {

    const [overlayOpen, setOverlayOpen] = useState(false);
    const [battingTeamOverlay, setBattingTeamOverlay] = useState(false);
    const [targetTeam, setTargetTeam] = useState('');
    const [teamOneName, setTeamOneName] = useState('Team One')
    const [teamTwoName, setTeamTwoName] = useState('Team Two')
    const [teamOnePlayers, setTeamOnePlayers] = useState([]);
    const [teamTwoPlayers, setTeamTwoPlayers] = useState([]);
    const [currentPlayers, setCurrentPlayers] = useState([]);
    const [battingTeam, setBattingTeam] = useState(null);
    const [bowlingTeam, setBowlingTeam] = useState(null);
    const [inputDisabled, setInputDisabled] = useState(false);
    const { players } = useContext(PlayerContext);
    const {match,dispatch} = useContext(MatchContext);



    const createMatch = () => {

        const newMatch = {
            id: uuid(),
            teamOne: {
                name: teamOneName,
                players: teamOnePlayers,
                score: '',
                extra: 0,
                highlight: [],
                batting: [],
                bowling: []
            },
            teamTwo: {
                name: teamTwoName,
                players: teamTwoPlayers,
                score: '',
                extra: 0,
                highlight: [],
                batting: [],
                bowling: []
            },
            battingTeam,
            bowlingTeam
        }
        dispatch({type: CREATE_MATCH,value: newMatch})
    }


    useEffect(() => {
        setCurrentPlayers([...players])
    }, [players])

    const addPlayer = (player) => {
        if (targetTeam === teamOneName) {
            setTeamOnePlayers([...teamOnePlayers, player])
            setCurrentPlayers(filterPlayer(player))
        } else if (targetTeam === teamTwoName) {
            setTeamTwoPlayers([...teamTwoPlayers, player])
            setCurrentPlayers(filterPlayer(player))
        }
        setInputDisabled(true)
        setOverlayOpen(false);
    }

    const filterPlayer = (player) => {
        return currentPlayers.filter((pl => pl.id !== player.id))
    }

    const removePlayer = (player) => {
        setCurrentPlayers(filterPlayer(player))
    }

    const handleTeamOneAdd = () => {
        setOverlayOpen(true);
        setTargetTeam(teamOneName);
    }

    const handleTeamTwoAdd = () => {
        setOverlayOpen(true);
        setTargetTeam(teamTwoName);
    }

    const handleBattingTeam = (teamName) => {
        setBattingTeamOverlay(false)
        setInputDisabled(true)
        if (teamName === teamOneName) {
            setBattingTeam({name: teamOneName,ref: 'teamOne'});
            setBowlingTeam({name: teamTwoName,ref: 'teamTwo'});
        } else if (teamName === teamTwoName) {
            setBattingTeam({name: teamTwoName,ref: 'teamTwo'});
            setBowlingTeam({name: teamOneName,ref: 'teamOne'});
        }
    }


    return (
        <View>
            <View style={{ height: '90%' }}>
                <ScrollView >
                    <View>
                        <Text style={styles.title}>Give Team Name</Text>
                    </View>
                    <View style={styles.inline}>
                        <View style={styles.inlineItem}>
                            <Input disabled={inputDisabled} disabledInputStyle={{ opacity: 1 }} onChangeText={e => setTeamOneName(e)} placeholder="team name" value={teamOneName} />
                        </View>
                        <View style={styles.inlineItem}>
                            <Input disabled={inputDisabled} disabledInputStyle={{ opacity: 1 }} onChangeText={e => setTeamTwoName(e)} placeholder="team name" value={teamTwoName} />
                        </View>
                    </View>
                    <View>
                        <Text style={styles.title}>Select Player For Team</Text>
                    </View>
                    <View style={styles.inline}>
                        <View style={styles.inlineItem}>
                            {teamOnePlayers.map(player =>
                                <View key={player.id} >
                                    <ListItem title={player.name} />
                                    <Divider />
                                </View>
                            )}
                            <Button
                                icon={<Icon name="add" />}
                                onPress={handleTeamOneAdd}
                            />
                        </View>
                        <View style={{ width: 6 }} />
                        <View style={styles.inlineItem}>
                            {teamTwoPlayers.map(player =>
                                <View key={player.id} >
                                    <ListItem title={player.name} />
                                    <Divider />
                                </View>
                            )}
                            <Button
                                icon={<Icon name="add" />}
                                onPress={handleTeamTwoAdd}
                            />
                        </View>
                    </View>
                    <Overlay isVisible={overlayOpen} overlayStyle={{ height: '80%' }}>
                        <ScrollView>
                            <View style={{ width: 200 }}>
                                {currentPlayers.map((player, i) =>
                                    <View key={player.id} style={{ display: 'flex', flexDirection: 'row' }}>
                                        <View style={{ flexGrow: 1 }}>
                                            <Button onPress={() => addPlayer(player)} titleStyle={{ color: '#000' }} title={player.name} type="clear" />
                                        </View>
                                        <Button icon={
                                            <Icon name="close" type="antdesign" color="lightgray" />
                                        } type="clear" onPress={() => removePlayer(player)} />
                                        {currentPlayers.length - 1 !== i && <Divider />}
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    </Overlay>
                    <View style={{ marginVertical: 20 }}>


                        {
                            !battingTeam ?
                                <View >
                                    <Text style={styles.title}>Select Batting Team</Text>
                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <View style={{ flexGrow: 3 }}>
                                            <Button onPress={() => setBattingTeamOverlay(true)}
                                                // buttonStyle={{ backgroundColor: '#fff' }}
                                                type="outline"
                                                icon={<Icon name="add" />}
                                            />
                                        </View>
                                        {/* <Text style={{ textAlign: 'center' }}>or</Text> */}
                                        <View style={{ flexGrow: 1 }}>
                                            <Button title="Do a Toss" type="outline" />
                                        </View>
                                    </View>
                                </View> :
                                <View style={styles.inline}>
                                    <View style={styles.inlineItem}>
                                        <Text style={styles.title}>Batting Team</Text>
                                        <Text style={styles.teamName}>{battingTeam.name}</Text>
                                    </View>
                                    <View style={{ width: 6 }} />
                                    <View style={styles.inlineItem}>
                                        <Text style={styles.title}>Bowling Team</Text>
                                        <Text style={styles.teamName}>{bowlingTeam.name}</Text>
                                    </View>
                                </View>
                        }
                    </View>
                    <Overlay isVisible={battingTeamOverlay}>
                        <View style={{ width: 200 }}>
                            <View>
                                <Button onPress={() => handleBattingTeam(teamOneName)} titleStyle={{ color: '#000' }} title={teamOneName} type="clear" />
                                <Divider />
                            </View>
                            <View>
                                <Button onPress={() => handleBattingTeam(teamTwoName)} titleStyle={{ color: '#000' }} title={teamTwoName} type="clear" />
                            </View>
                        </View>
                    </Overlay>
                </ScrollView>
            </View>
            <View style={{ height: '10%' }}>
                <Button onPress={createMatch} title="Create Match" buttonStyle={{ height: "100%", backgroundColor: 'green', borderRadius: -1 }} />
            </View>
        </View>
    )
}

export default () => <PlayerContextProvider>
    <MatchContextProvider>
        <CreateMatch />
    </MatchContextProvider>
</PlayerContextProvider>