import React, { useContext, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, Easing } from 'react-native';
import { AppContext } from '../contexts/appContext/appContext';
import { Overlay, Button } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import { Easing } from 'react-native-reanimated';

const HEAD = 'HEAD';
const TAIL = 'TAIL';


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

export default function Toss() {

    const [call, setCall] = useState(null);
    const value = useRef(new Animated.Value(0)).current
    const { appState, dispatch } = useContext(AppContext);


    const panResponder = useRef(
        PanResponder.create({
            // onStartShouldSetPanResponder: ()=> true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, s) => {

                const speed = 3;

                const r = s.dy / 1000 * speed * -1

                // console.log(s)

                value.setValue(r)
            },
            onPanResponderRelease: (_, s) => {

                const speed = 2
                const randUnit1 = Math.random() * 5
                const randUnit2 = Math.random() * 5
                const rand = Math.ceil(randUnit1 + randUnit2);
                const newValue = Math.round(s.vy * speed * rand);

                if(newValue === 0){
                    handleRotate(Math.round(Math.random()*100))
                }else if(newValue <= 0 && newValue > -10){
                    handleRotate(newValue*Math.ceil(Math.random()*10))
                    console.log(newValue,'-')
                }else if(newValue >= 0 && newValue < 10){
                    handleRotate(newValue*Math.ceil(Math.random()*10))
                    console.log(newValue,'+')
                }else{
                    handleRotate(newValue)
                }

            }

        })
    ).current

    // value.addListener((state)=>{
    //     console.log(state)
    // })


    const handleRotate = (newValue) => {
        console.log(newValue)
        Animated.timing(value, {
            toValue: newValue * -1,
            duration: 5000,
            // easing: Easing.out(Easing.quad),
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start()
    }

    const rotate = value.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-180deg', '0deg', '180deg']
    })

    const rotateZ = value.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['0deg', '180deg', '360deg']
    })




    return (
        <View {...panResponder.panHandlers}>
            <Overlay isVisible={true} overlayStyle={{ backgroundColor: 'transparent', padding: 0 }}>
                <View>
                    <View>
                        {call ?
                            <View style={{ width: 200, height: 200 }} >
                                <Animated.View style={{
                                    ...styles.card,
                                    ...styles.head,
                                    transform: [
                                        { rotateX: rotateZ },
                                        { perspective: 1000 }
                                    ]
                                }}>
                                    <View>
                                        <Text style={styles.text}>
                                            HEAD
                                        </Text>
                                    </View>
                                </Animated.View>
                                <Animated.View style={{
                                    ...styles.card,
                                    ...styles.tail,
                                    backfaceVisibility: 'hidden',
                                    transform: [
                                        // {rotateX: '180deg'},r
                                        { rotateX: rotate },
                                        { perspective: 1000 }
                                    ],
                                    // opacity: 0
                                }}>
                                    <View>
                                        <Text style={styles.text}>
                                            TAIL
                                        </Text>
                                    </View>
                                </Animated.View>
                            </View> :
                            <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                                <View style={{ flexGrow: 1 }}>
                                    <Button onPress={() => setCall(HEAD)} title="HEAD" buttonStyle={styles.head} titleStyle={styles.button} />
                                </View>
                                <View style={{ flexGrow: 1 }}>
                                    <Button onPress={() => setCall(TAIL)} title="TAIL" buttonStyle={styles.tail} titleStyle={styles.button} />
                                </View>
                            </View>
                        }
                    </View>
                </View>
            </Overlay>
        </View>
    )
}
