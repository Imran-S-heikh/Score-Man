import React, { useContext, useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import MatchContextProvider, { MatchContext } from '../../contexts/match/matchContext'
import { Divider, Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { uuid } from '../../utils';

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
        color: 'red'
    },
    'w': {
        color: 'red'
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
    }

});


function LiveMatch() {


    const { match, dispatch } = useContext(MatchContext);
    const [highlight, setHighlight] = useState([]);
    const [currentOver, setCurrentOver] = useState({ name: 'Pandiya', id: uuid(), score: [] })
    const [batsmanOne, setBatsmanOne] = useState({ name: 'Imran', id: uuid(), score: [] })
    const [batsmanTwo, setBatsmanTwo] = useState({ name: 'Tamim', id: uuid(), score: [] })
    const [striker, setStriker] = useState({ name: '', id: '', score: [] })
    const [totalScore, setTotalScore] = useState({ run: 0, wicket: 0 })


    const highlightRef = useRef();

    const updateBowler = (score) => {
        setCurrentOver({ ...currentOver, score: [...currentOver.score, score] })
    }


    const updateHighlight = (score) => {
        if(!isNaN(score.run)){
            setTotalScore({...totalScore,run: totalScore.run+Number(score.run)})
        }
        setHighlight([...highlight, score]);
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
        updateBowler(newScore, extra);
        updateBatsman(newScore, extra);
    }

    const exchangeBatsman = () => {
        if (striker.id === batsmanOne.id) {
            setStriker(batsmanTwo)
        } else if (striker.id === batsmanTwo.id) {
            setStriker(batsmanOne)
        }
    }

    const add = (accu, a) => {

        if (isNaN(a.run)) return 0;
        console.log(a)

        return accu + Number(a.run);
    }

    useEffect(() => {
        setStriker(batsmanOne)
    }, [])


    return (

        <View style={{ height: '100%' }}>
            <ScrollView>
                <View style={{ ...styles.row, paddingTop: 0 }}>
                    <View>
                        <Text style={styles.teamLabel}>Batting Team</Text>
                        <Text style={[styles.teamName, styles.textContainer]}>Bangladesh</Text>
                        <Text style={[styles.score, styles.textContainer]}>{totalScore.run}/{totalScore.wicket}</Text>
                    </View>
                    <View>
                        <Text style={styles.teamLabel}>Bowling Team</Text>
                        <Text style={[styles.teamName, styles.textContainer]}>England</Text>
                        <Text style={[styles.score, styles.textContainer]}>6 Overs</Text>
                    </View>
                </View>
                <Divider style={styles.divider} />




                <View style={styles.headerContainer}>
                    <Text style={[styles.header, styles.textContainer]}>Batting</Text>
                </View>
                <View>
                    <View style={styles.row}>
                        <View style={{ ...styles.row, padding: 0 }}>
                            <Text style={styles.name}>{batsmanOne.name}</Text>
                            <Text style={styles.battingScore}>: {batsmanOne.score.reduce(add, 0)}</Text>
                            {/* <Text>/15</Text> */}
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
                        <View style={{ ...styles.row, padding: 0 }}>
                            <Text style={styles.name}>{batsmanTwo.name}</Text>
                            <Text style={styles.battingScore}>: {batsmanTwo.score.reduce(add, 0)}</Text>
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
                                        {console.log(value.id)}
                                        <Text style={[styles[value.run], styles.smallFont]}>{value.run}</Text><Text> + </Text>
                                    </React.Fragment>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </View>

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
                                <>
                                    <Text key={value.id} style={[styles[value.run], styles.largeFont]}>{value.run}</Text><Text style={styles.largeFont}> + </Text>
                                </>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.buttonsContainer}>
                <View style={{ ...styles.buttonRow, marginBottom: 6 }}>
                    <View style={{ flexGrow: 1 }}>
                        <Button titleStyle={styles.buttonTitle} buttonStyle={{ ...styles.button, backgroundColor: '#fff' }} type="outline" title="Cust." />
                    </View>
                    <View style={{ flexGrow: 1 }}>
                        <Button onPress={() => updateScore('wd')} titleStyle={styles.buttonTitle} buttonStyle={{ ...styles.button, backgroundColor: '#A4A574' }} title="WD" />
                    </View>
                    <View style={{ flexGrow: 1 }}>
                        <Button onPress={() => updateScore('2')} titleStyle={styles.buttonTitle} buttonStyle={{ ...styles.button, backgroundColor: '#909090' }} title="2" />
                    </View>
                    <View style={{ flexGrow: 1 }}>
                        <Button onPress={() => updateScore('4')} titleStyle={styles.buttonTitle} buttonStyle={{ ...styles.button, backgroundColor: '#5CBC9F' }} title="4" />
                    </View>
                    <View style={{ flexGrow: 1 }}>
                        <Button titleStyle={styles.buttonTitle} buttonStyle={{ ...styles.button, marginRight: 0, backgroundColor: '#fff' }} type="outline" title="Extra" />
                    </View>
                </View>
                <View style={styles.buttonRow}>
                    <View style={{ flexGrow: 1 }}>
                        <Button onPress={() => updateScore('w')} titleStyle={styles.buttonTitle} buttonStyle={{ ...styles.button, backgroundColor: '#FF9595' }} title="W" />
                    </View>
                    <View style={{ flexGrow: 1 }}>
                        <Button onPress={() => updateScore('1')} titleStyle={styles.buttonTitle} buttonStyle={{ ...styles.button, backgroundColor: '#B0B0B0' }} title="1" />
                    </View>
                    <View style={{ flexGrow: 1 }}>
                        <Button onPress={() => updateScore('0')} titleStyle={styles.buttonTitle} buttonStyle={{ ...styles.button, marginRight: 0, backgroundColor: '#BCA75C' }} title="0" />
                    </View>
                </View>
            </View>
        </View>
    )
}


export default () => <MatchContextProvider>
    <LiveMatch />
</MatchContextProvider>