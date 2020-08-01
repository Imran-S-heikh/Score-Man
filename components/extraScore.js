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

export default function ExtraScore({handler,isOpen}) {

    if(!isOpen)return null;

    return (
        <View style={styles.container}> 
            <Button onPress={()=>handler('1',true)} title="1" buttonStyle={{backgroundColor: 'gray'}} />
            <Button onPress={()=>handler('nb',true)} title="NB" buttonStyle={{backgroundColor: '#52159e'}}/>
        </View>
    )
}
