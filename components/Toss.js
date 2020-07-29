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

    const [call, setCall] = useState(null);
    const { appState, dispatch } = useContext(AppContext);

    const handleCall = (value) => {
        setCall(value);
    }


    if (!call) return <TossChoose handler={handleCall} />
    return <TossCoin visible={call} />
}

function TossChoose({ handler }) {
    return (
        <Overlay isVisible={true} overlayStyle={{ backgroundColor: 'transparent', padding: 0 }}>
            <View style={{ display: 'flex', flexDirection: 'row', width: '80%' }}>
                <View style={{ flexGrow: 1 }}>
                    <Button onPress={() => handler(HEAD)} title="HEAD" buttonStyle={styles.head} titleStyle={styles.button} />
                </View>
                <View style={{ flexGrow: 1 }}>
                    <Button onPress={() => handler(TAIL)} title="TAIL" buttonStyle={styles.tail} titleStyle={styles.button} />
                </View>
            </View>
        </Overlay>
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
