import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: '100%',
        width: '100%',
    }
})

export default function CustomScore({handler,isOpen}) {

    if(!isOpen)return null;

    return (
        <View style={styles.container}> 
            <Button onPress={()=>handler('3')} title="3" buttonStyle={{backgroundColor: 'gray'}} />
            <Button onPress={()=>handler('5')} title="NB" buttonStyle={{backgroundColor: '#52159e'}}/>
        </View>
    )
}