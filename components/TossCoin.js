import React, { useRef, useState } from 'react'
import { View, Text, StyleSheet, Animated, PanResponder, Easing, TouchableOpacity } from 'react-native'
import { Overlay, Icon, Divider } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const HEAD = 'HEAD';
const TAIL = 'TAIL';
const TIME = 5000;


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



export default function TossCoin({ call, handler,chooseHandler }) {

    const value = useRef(new Animated.Value(0)).current
    const [tossWin, setTossWin] = useState(null);
    const [tossMassage, setTossMessage] = useState('');
    const [resultOpen, setResultOpen] = useState(false);
    const navigation = useNavigation();

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, s) => {
                const speed = 3;
                const r = s.dy / 1000 * speed * -1
                value.setValue(r)
            },
            onPanResponderRelease: (_, s) => {

                const speed = 2
                const randUnit1 = Math.random() * 5
                const randUnit2 = Math.random() * 5
                const rand = Math.ceil(randUnit1 + randUnit2);
                const newValue = Math.round(s.vy * speed * rand);

                if (newValue === 0) {
                    handleRotate(Math.round(Math.random() * 100))
                } else if (newValue <= 0 && newValue > -10) {
                    handleRotate(newValue * Math.ceil(Math.random() * 10))
                    console.log(newValue, '-')
                } else if (newValue >= 0 && newValue < 10) {
                    handleRotate(newValue * Math.ceil(Math.random() * 10))
                    console.log(newValue, '+')
                } else {
                    handleRotate(newValue)
                }

            }

        })
    ).current

    const handleRotate = (newValue) => {
        isWin(newValue);
        Animated.timing(value, {
            toValue: newValue * -1,
            duration: TIME,
            // easing: Easing.out(Easing.quad),
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start()
    }

    const isWin = (flip) => {
        setTimeout(() => {
            if (flip % 2 == 0) {
                setTossMessage('You Lose The Toss');
            } else {
                setTossMessage('You Won The Toss');
            }
            setTimeout(() => {
                setResultOpen(true)
            }, 1000)
        }, TIME);
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
        <View>
            <View {...panResponder.panHandlers}>
                <Overlay isVisible={!!call} overlayStyle={{ backgroundColor: 'transparent', padding: 0 }}>
                    <View style={{ width: 200, height: 200 }} >
                        <Animated.View style={{
                            ...styles.card,
                            ...styles.tail,
                            transform: [
                                { rotateX: rotateZ },
                                { perspective: 1000 }
                            ]
                        }}>
                            <View>
                                <Text style={styles.text}>
                                    {call}
                                </Text>
                            </View>
                        </Animated.View>
                        <Animated.View style={{
                            ...styles.card,
                            ...styles.head,
                            backfaceVisibility: 'hidden',
                            transform: [
                                { rotateX: rotate },
                                { perspective: 1000 }
                            ],
                        }}>
                            <View>
                                <Text style={styles.text}>
                                    {call === HEAD ? TAIL : HEAD}
                                </Text>
                            </View>
                        </Animated.View>

                    </View>
                </Overlay>
            </View>
            <View>
                <Overlay isVisible={resultOpen} overlayStyle={{ marginTop: '95%' }}>
                    <View style={{ position: 'relative' }}>
                        <View style={{ position: 'absolute', top: -300, right: -20, width: 150 }}>
                            <Text style={{ fontSize: 30, color: 'lightgrey', fontWeight: 'bold' }}>{tossMassage}</Text>
                        </View>
                        <View style={{display: 'flex',flexDirection: 'row'}}>
                            <TouchableOpacity style={{
                                backgroundColor: 'lightgray',
                                padding: 10,
                                borderRadius: 5,
                                marginRight: 3
                            }} onPress={() => handler(null)}>
                                <Icon name="reload1" type="antdesign" />
                                <Text> Reload </Text>
                            </TouchableOpacity>
                            {/* <Divider/> */}
                            <TouchableOpacity style={{
                                backgroundColor: 'lightgray',
                                padding: 10,
                                borderRadius: 5,
                            }} onPress={() => {chooseHandler(false);navigation.navigate('Home')}}>
                                <Icon name="close" type="antdesign" />
                                <Text> Close </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Overlay>
            </View>
        </View>
    )
}
