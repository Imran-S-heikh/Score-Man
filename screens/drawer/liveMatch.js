import React, { useContext, useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import MatchContextProvider, { MatchContext } from '../../contexts/match/matchContext'
import { Divider, Button, Badge, Overlay, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { uuid } from '../../utils';
import Popup from '../../components/Popup';
import ExtraScore from '../../components/extraScore';
import CustomScore from '../../components/customScore';
import { NEXT_INNINGS } from '../../contexts/match/matchTypes';
import InfoPopup from '../../components/InfoPopup';
import { PlayerContext } from '../../contexts/palyers/playerContext';
import { UPDATE_PLAYER_RUN } from '../../contexts/palyers/playerTypes';




const batsmanInitalState = { name: '', id: '', score: [] }
const currentOverInitialState = { name: '', id: '', score: [], ball: 0 }
const totalScoreInitialScore = { run: 0, wicket: 0 }
const popupsInitialState = { striker: true, nonStriker: true, bowler: true, winPopup: false, inningsEnd: false }
const oversInitialState = { over: 0, ball: 0 }
const firstInnings = { name: 'First Innings', key: 'FIRST_INNINGS' }
const secondInnings = { name: 'Second Innings', key: 'SECOND_INNINGS' }


function LiveMatch() {


    const { match, dispatch } = useContext(MatchContext);
    const playerState = useContext(PlayerContext);
    const [highlight, setHighlight] = useState([]);
    const [currentOver, setCurrentOver] = useState(currentOverInitialState)
    const [batsmanOne, setBatsmanOne] = useState(batsmanInitalState)
    const [batsmanTwo, setBatsmanTwo] = useState(batsmanInitalState)
    const [striker, setStriker] = useState(batsmanInitalState)
    const [totalScore, setTotalScore] = useState(totalScoreInitialScore);
    const [overs, setOvers] = useState(oversInitialState);
    const [popups, setPopups] = useState(popupsInitialState);
    const [outBatsman, setOutBatsman] = useState([]);
    const battingTeam = match[match.battingTeam.ref]
    const bowlingTeam = match[match.bowlingTeam.ref]
    const [customOpen, setCustomOpen] = useState(false);
    const [extraOpen, setExtraOpen] = useState(false);
    const [innings, setInnings] = useState(firstInnings);
    const [target, setTarget] = useState('');
    const [winTeamName, setWinTeamName] = useState('');



    const highlightRef = useRef();

    const updateBowler = (score) => {
        if (isLegal(score.run)) {
            return setCurrentOver({ ...currentOver, score: [...currentOver.score, score], ball: currentOver.ball + 1 })
        }
        setCurrentOver({ ...currentOver, score: [...currentOver.score, score] })
    }

    useEffect(() => {
        if (totalScore.run >= target && innings.key === secondInnings.key) {
            setWinTeamName(battingTeam.name)
            setPopups({ ...popups, winPopup: true })
        }
        if (currentOver.ball >= 6) {
            exchangeBatsman();
            setPopups({ ...popups, bowler: true })
            return setOvers({ over: overs.over + 1, ball: 0 })
        }
        setOvers({ ...overs, ball: currentOver.ball })
    }, [currentOver])

    useEffect(() => {
        if (innings.key === secondInnings.key && overs.over >= match.overToPlay && totalScore.run < target) {
            setWinTeamName(bowlingTeam.name)
            setPopups({ striker: false, nonStriker: false, inningsEnd: false, bowler: false, winPopup: true })
        }

        if (innings.key === firstInnings.key && overs.over >= match.overToPlay) {
            setPopups({ striker: false, nonStriker: false, winPopup: false, bowler: false, inningsEnd: true })
        }

    }, [overs])

    const isLegal = (delivary) => {
        const legalDelivary = ['1', '2', '3', '4', 'w', '0'];

        return legalDelivary.includes(delivary);
    }


    const updateHighlight = (score) => {
        setHighlight([...highlight, { ...score, endOver: isLegal(score.run) && overs.ball === 5 }]);
        if (score.run === 'w') {
            return setTotalScore({ ...totalScore, wicket: totalScore.wicket + 1 })
        }
        setTotalScore({ ...totalScore, run: totalScore.run + getScore(score) })
    }

    const updateBatsman = (score, extra) => {
        if (extra) return;

        if (striker.id === batsmanOne.id) {
            setBatsmanOne({ ...batsmanOne, score: [...batsmanOne.score, score] })
        } else if (striker.id === batsmanTwo.id) {
            setBatsmanTwo({ ...batsmanTwo, score: [...batsmanTwo.score, score] })
        }

        if (score.run === '1') {
            exchangeBatsman()
        }

    }

    const updateScore = (score, extra = false) => {
        const newScore = { run: score, id: uuid() }
        updateHighlight(newScore, extra);
        updateBatsman(newScore, extra);
        if (score === 'w') {
            playerState.dispatch({ type: UPDATE_PLAYER_RUN, id: striker.id, value: getStriker().score })
            if (battingTeam.players.length === outBatsman.length) {
                if (innings.key === firstInnings.key) {

                    return setPopups({ ...popups, inningsEnd: true })
                } else if (innings.key === secondInnings.key && totalScore.run < target) {
                    setWinTeamName(bowlingTeam.name)
                    nextInnings()
                    return setPopups({ striker: false, nonStriker: false, inningsEnd: false, bowler: false, winPopup: true })

                }
            }
            return setPopups({ ...popups, striker: true })
        }
        updateBowler(newScore, extra);
    }

    const exchangeBatsman = () => {
        if (striker.id === batsmanOne.id) {
            setStriker(batsmanTwo)
        } else if (striker.id === batsmanTwo.id) {
            setStriker(batsmanOne)
        }
    }

    const add = (accu, a) => {

        return accu + getScore(a);
    }

    const getScore = ({ run }) => {
        if (!isNaN(run)) return Number(run);
        if (run === 'wd') return 1;
        if (run === 'nb') return 1;
        return 0;
    }


    const batsmanOnePopup = (player) => {
        if (striker.name !== null && striker.id === batsmanOne.id) {
            const newScore = { run: 'w', id: uuid() }
            updateBowler(newScore);
            setBatsmanOne({ ...player, score: [] })

        } else if (striker.id === batsmanTwo.id) {
            const newScore = { run: 'w', id: uuid() }
            updateBowler(newScore);
            setBatsmanTwo({ ...player, score: [] })
        } else {
            setBatsmanOne({ ...player, score: [] })
        }
        setStriker(player);
        setOutBatsman([...outBatsman, player.id]);
        setPopups({ ...popups, striker: false })
    }
    const batsmanTwoPopup = (player) => {
        setOutBatsman([...outBatsman, player.id]);
        setBatsmanTwo({ ...player, score: [] })
        setPopups({ ...popups, nonStriker: false })
    }
    const bowlerPopup = (player) => {
        setCurrentOver({ ...player, score: [], ball: 0 })
        setPopups({ ...popups, bowler: false })
    }

    const resetAll = () => {
        setBatsmanOne(batsmanInitalState);
        setBatsmanTwo(batsmanInitalState);
        setStriker(batsmanInitalState);
        setOvers(oversInitialState);
        setTotalScore(totalScoreInitialScore);
        setCurrentOver(currentOverInitialState);
        setPopups(popupsInitialState);
        setHighlight([]);
        setOutBatsman([]);
    }

    const nextInnings = () => {
        dispatch({ type: NEXT_INNINGS })
        resetAll();

        if (innings.key === firstInnings.key) {
            setInnings(secondInnings);
            setTarget(totalScore.run + 1)
        }
    }

    useEffect(() => {
        // console.log(getStriker().score,'Current Batsman');
    })

    const playAgain = () => {
        resetAll();
        setTarget('');
        setInnings(firstInnings);
    }

    const getStriker = () => {
        if (striker.id === batsmanOne.id) {
            return batsmanOne
        } else if (striker.id === batsmanTwo.id) {
            return batsmanTwo
        }
    }

    return (

        <View style={{ height: '100%' }}>
            <ScrollView>

                {/* ********************** */}
                {/* Team and Score Section */}
                {/* ********************** */}

                <View style={{ ...styles.row, paddingTop: 0, alignItems: 'center' }}>
                    <View>
                        <Text style={styles.teamLabel}>Batting Team</Text>
                        <Text style={[styles.teamName, styles.textContainer]}>{battingTeam.name}</Text>
                        <Text style={[styles.score, styles.textContainer]}>{totalScore.run}/{totalScore.wicket}</Text>
                    </View>
                    {innings.key === firstInnings.key ?
                        <View>
                            <Text>1st Innings</Text>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Running..</Text>
                        </View> :
                        <View>
                            <Text style={{ fontSize: 18 }}>Target</Text>
                            <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 18 }}>{target}</Text>
                        </View>
                    }
                    <View>
                        <Text style={styles.teamLabel}>Bowling Team</Text>
                        <Text style={[styles.teamName, styles.textContainer]}>{bowlingTeam.name}</Text>
                        <Text style={[styles.score, styles.textContainer]}>{overs.over}.{overs.ball} Overs</Text>
                    </View>
                </View>

                {/* ***************** */}
                {/*  Batting Section  */}
                {/* ***************** */}

                <Divider style={styles.divider} />

                <View style={styles.headerContainer}>
                    <Text style={[styles.header, styles.textContainer]}>Batting</Text>
                </View>
                <View>
                    <View style={styles.row}>
                        <View style={{ ...styles.row, padding: 0 }}>
                            <Text style={styles.name}>{batsmanOne.name}</Text>
                            <Text style={styles.battingScore}>: {batsmanOne.score.reduce(add, 0)}</Text>
                            {striker.id === batsmanOne.id && <Badge status="error" v containerStyle={{ position: 'absolute', top: 0, right: 18 }} />}
                        </View>
                        <View style={styles.battingHighlightContainer}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {batsmanOne.score.map(value =>
                                    <React.Fragment key={value.id} >
                                        <Text style={[styles[value.run], styles.smallFont]}>{value.run}</Text><Text> + </Text>
                                    </React.Fragment>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                    <View style={{ ...styles.row, paddingTop: 0 }}>
                        <View style={{ ...styles.row, padding: 0, position: 'relative' }}>
                            <Text style={styles.name}>{batsmanTwo.name}</Text>
                            <Text style={styles.battingScore}>: {batsmanTwo.score.reduce(add, 0)}</Text>
                            {striker.id === batsmanTwo.id && <Badge status="error" v containerStyle={{ position: 'absolute', top: 0, right: 18 }} />}
                            {/* <Text>/15</Text> */}
                        </View>
                        <View style={styles.battingHighlightContainer}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {batsmanTwo.score.map(value =>
                                    <React.Fragment key={value.id} >
                                        <Text style={[styles[value.run], styles.smallFont]}>{value.run}</Text><Text> + </Text>
                                    </React.Fragment>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </View>

                {/* ***************** */}
                {/*   Bowler Section  */}
                {/* ***************** */}

                <Divider style={styles.divider} />
                <View style={styles.headerContainer}>
                    <Text style={[styles.header, styles.textContainer]}>Bowling</Text>
                </View>
                <View>
                    <View style={styles.row}>
                        <View style={{ ...styles.row, padding: 0 }}>
                            <Text style={styles.name}>{currentOver.name}</Text>
                            <Text style={styles.battingScore}>: {currentOver.score.reduce(add, 0)}</Text>
                            {/* <Text>/2</Text> */}
                        </View>
                        <View style={styles.battingHighlightContainer}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {currentOver.score.map(value =>
                                    <React.Fragment key={value.id}>
                                        <Text style={[styles[value.run], styles.smallFont]}>{value.run}</Text><Text> + </Text>
                                    </React.Fragment>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </View>

                {/* ***************** */}
                {/* Highlight Section */}
                {/* ***************** */}
                <Divider style={styles.divider} />
                <View style={styles.highlightWraper}>
                    <View style={[styles.highlight, styles.textContainer]}>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            ref={highlightRef}
                            onContentSizeChange={() => highlightRef.current.scrollToEnd({ animated: true })}
                        >
                            {highlight.map((value =>
                                <React.Fragment key={value.id}>
                                    <Text style={[styles[value.run], styles.largeFont]}>{value.run}</Text>
                                    {value.endOver ?
                                        <Text style={{ ...styles.largeFont, color: '#6a00ff' }}>  |  </Text> :
                                        <Text style={styles.largeFont}> + </Text>
                                    }
                                </React.Fragment>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>

            {/* ********************** */}
            {/*  Score Update Section  */}
            {/* ********************** */}

            <View style={styles.buttonsContainer}>
                <View style={{ ...styles.buttonRow, marginBottom: 6 }}>
                    <View style={{ flexGrow: 1 }}>
                        <Button onPress={() => setCustomOpen(!customOpen)} titleStyle={styles.buttonTitle} buttonStyle={{ ...styles.button, backgroundColor: '#fff' }} type="outline" title="Cust." />
                        <CustomScore handler={updateScore} isOpen={customOpen} />
                    </View>
                    <View style={{ flexGrow: 1 }}>
                        <Button onPress={() => updateScore('wd', true)} titleStyle={styles.buttonTitle} buttonStyle={{ ...styles.button, backgroundColor: '#A4A574' }} title="WD" />
                    </View>
                    <View style={{ flexGrow: 1 }}>
                        <Button onPress={() => updateScore('2')} titleStyle={styles.buttonTitle} buttonStyle={{ ...styles.button, backgroundColor: '#909090' }} title="2" />
                    </View>
                    <View style={{ flexGrow: 1 }}>
                        <Button onPress={() => updateScore('w')} titleStyle={styles.buttonTitle} buttonStyle={{ ...styles.button, backgroundColor: '#FF9595' }} title="W" />
                    </View>
                    <View style={{ flexGrow: 1, position: 'relative' }}>
                        <Button onPress={() => setExtraOpen(!extraOpen)} titleStyle={styles.buttonTitle} buttonStyle={{ ...styles.button, marginRight: 0, backgroundColor: '#fff' }} type="outline" title="Extra" />
                        <ExtraScore isOpen={extraOpen} handler={updateScore} />
                    </View>
                </View>
                <View style={styles.buttonRow}>
                    <View style={{ flexGrow: 1 }}>
                        <Button onPress={() => updateScore('4')} titleStyle={styles.buttonTitle} buttonStyle={{ ...styles.button, backgroundColor: '#5CBC9F' }} title="4" />
                    </View>
                    <View style={{ flexGrow: 1 }}>
                        <Button onPress={() => updateScore('1')} titleStyle={styles.buttonTitle} buttonStyle={{ ...styles.button, backgroundColor: '#B0B0B0' }} title="1" />
                    </View>
                    <View style={{ flexGrow: 1 }}>
                        <Button onPress={() => updateScore('0')} titleStyle={styles.buttonTitle} buttonStyle={{ ...styles.button, marginRight: 0, backgroundColor: '#BCA75C' }} title="0" />
                    </View>
                </View>
            </View>

            {/* ***************** */}
            {/*   Popup Section   */}
            {/* ***************** */}

            <Popup id={[currentOver.id]} title="Select bowler" visible={popups.bowler} handler={bowlerPopup} players={bowlingTeam.players} />
            <Popup id={[striker.id]} title="Select non striker" visible={popups.nonStriker} handler={batsmanTwoPopup} players={battingTeam.players} />
            <Popup id={outBatsman} title="Select a Striker" visible={popups.striker} handler={batsmanOnePopup} players={battingTeam.players} />
            <InfoPopup visible={popups.winPopup} title={winTeamName} description="Won the Game">
                <View style={{ marginTop: 30, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity style={{
                        backgroundColor: 'lightgray',
                        padding: 10,
                        borderRadius: 5,
                        marginRight: 3
                    }} onPress={() => { }}>
                        <Icon name="close" type="antdesign" />
                        <Text> Close </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        backgroundColor: 'lightgray',
                        padding: 10,
                        borderRadius: 5,
                    }} onPress={() => playAgain()}>
                        <Icon name="reload1" type="antdesign" />
                        <Text> Play Again </Text>
                    </TouchableOpacity>
                </View>
            </InfoPopup>
            <InfoPopup visible={popups.inningsEnd} title="First Innings End" crown={false} description={`Target: ${totalScore.run + 1}`}>
                <View style={{ marginTop: 20 }}>
                    <Button onPress={() => nextInnings()} title="Next Innings" />
                </View>
            </InfoPopup>
        </View>
    )
}

const styles = StyleSheet.create({
    teamName: {
        fontWeight: 'bold',
        backgroundColor: '#C4C4C4',
        fontSize: 20
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
    score: {
        textAlign: 'center',
        backgroundColor: '#BD7979',
        fontSize: 18,
        color: '#fff',
        marginTop: 3
    },
    textContainer: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4
    },
    divider: {
        backgroundColor: '#000',
        marginVertical: 8
    },
    teamLabel: {
        fontSize: 18,
        paddingVertical: 8,
        textAlign: 'center',
        color: 'gray'
    },
    header: {
        textAlign: 'center',
        fontSize: 20,
        backgroundColor: '#C4C4C4',
        width: '70%',
        // textAlign
    },
    headerContainer: {
        display: "flex",
        alignItems: 'center'
    },
    name: {
        fontSize: 20
    },
    battingScore: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    battingHighlightContainer: {
        display: 'flex',
        width: '48%',
        flexDirection: 'row',
        backgroundColor: '#C4C4C4',
        alignItems: 'center',
        paddingHorizontal: 4
    },
    highlight: {
        width: '90%',
        fontSize: 20,
        backgroundColor: '#E3E3E3'
    },
    smallFont: {
        fontSize: 16
    },
    largeFont: {
        fontSize: 22
    },
    highlightWraper: {
        flexGrow: 1,
        alignItems: 'center',
        marginBottom: 110
    },
    buttonsContainer: {
        marginTop: 10,
        position: 'absolute',
        bottom: 2,
        // backgroundColor: 'red',
        // height: 90
    },
    buttonRow: {
        display: 'flex',
        flexDirection: 'row'
    },
    button: {
        paddingHorizontal: 20,
        flexGrow: 1,
        marginRight: 3
    },
    buttonTitle: {
        fontSize: 18,
        color: '#000'
    },
    '4': {
        color: 'green',
    },
    '1': {
        color: '#000'
    },
    '2': {
        color: '#000'
    },
    'wd': {
        color: '#9e7915'
    },
    'w': {
        color: 'orangered'
    },
    'nb': {
        color: '#52159e'
    }

});


export default LiveMatch;