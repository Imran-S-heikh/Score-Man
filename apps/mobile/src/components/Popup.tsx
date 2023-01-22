import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Overlay, Divider, Button } from 'react-native-elements'

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
    container: {
        width: '80%'
    },
    buttonStyle: {
        backgroundColor: 'lightgray',
        marginBottom: 3
    },
    buttonTitle: {
        color: '#000',
        fontSize: 20
    },
    disabled: {
        backgroundColor: '#eee',
    },
    disabledTitle: {
        color: '#999'
    }
})

export default function Popup({ title, players, handler, visible, id }) {
    return (
        <Overlay isVisible={visible} overlayStyle={styles.container}>
            <View>
                <View>
                    <Text style={styles.title}>{title}</Text>
                    <Divider style={{ margin: 20, opacity: 1, backgroundColor: '#000' }} />
                </View>
                <View>
                    {players.map(player =>
                        <Button disabledTitleStyle={styles.disabledTitle} disabledStyle={styles.disabled} disabled={id.includes(player.id)} key={player.id} onPress={() => handler(player)} title={player.name} buttonStyle={styles.buttonStyle} titleStyle={styles.buttonTitle} />
                    )}
                </View>
            </View>
        </Overlay>
    )
}
