import React, { useContext, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, Easing } from 'react-native';
import { AppContext } from '../contexts/appContext/appContext';
import { Overlay, Button } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TossCoin from './TossCoin';
// import { Easing } from 'react-native-reanimated';

const HEAD = 'HEAD';
const TAIL = 'TAIL';

export default function Toss() {

    const [call, setCall] = useState(false);
    const [tossChooseOpen, setTossChooseOpen] = useState(true);
    const { appState, dispatch } = useContext(AppContext);

    const handleCall = (value) => {
        setCall(value);
    }

    const handleChoose = (value)=>{
        setTossChooseOpen(value)
        setCall(false)
    }


    if (!call) return <TossChoose handler={handleCall} />
    return <TossCoin call={call} handler={handleCall} chooseHandler={handleChoose}/>
}

function TossChoose({ handler }) {
    return (
        <View style={{ backgroundColor: 'rgba(0,0,0,.5)', padding: 0,flexGrow: 1,justifyContent: 'center',alignItems: 'center' }}>
            <View style={{ display: 'flex', flexDirection: 'row', width: '80%' }}>
                <View style={{ flexGrow: 1 }}>
                    <Button onPress={() => handler(HEAD)} title="HEAD" buttonStyle={styles.head} titleStyle={styles.button} />
                </View>
                <View style={{ flexGrow: 1 }}>
                    <Button onPress={() => handler(TAIL)} title="TAIL" buttonStyle={styles.tail} titleStyle={styles.button} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        fontSize: 30,
        paddingHorizontal: 10,
        paddingVertical: 6,
        flexGrow: 1
    },
    head: {
        backgroundColor: '#ff7f83'
    },
    tail: {
        backgroundColor: '#ffc849'
    },
    card: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#fff'
    }
})
