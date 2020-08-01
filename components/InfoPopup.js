import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Overlay } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5';


const styles = StyleSheet.create({
    contaienr: {
        width: '80%'
    },
    title: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold'
    },
    description: {
        textAlign: 'center',
        fontSize: 20,
        // color: ''
    }
})

export default function InfoPopup({ visible, title, description, crown = true,children }) {
    return (
        <Overlay isVisible={visible} overlayStyle={styles.contaienr}>
            <View>
                <Text style={styles.title}>{title} </Text>
                <Text style={styles.description}>{description}</Text>
                {crown && <>
                    <Icon name="crown" size={30} style={{ color: 'orangered', position: 'absolute', transform: [{ rotate: '-45deg' }] }} />
                    <Icon name="crown" size={30} style={{ color: 'orangered', position: 'absolute', right: 0, transform: [{ rotate: '45deg' }] }} />
                </>
                }
            {children}
            </View>
        </Overlay>
    )
}
