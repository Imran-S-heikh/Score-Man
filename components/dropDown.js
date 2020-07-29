import React, { useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { ListItem, Divider, Button } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { AppContext } from '../contexts/appContext/appContext'
import { StackActions, useNavigation, DrawerActions } from '@react-navigation/native'
import { OPTIONS_DROP_DOWN_OPEN } from '../contexts/appContext/types'

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: '#fff',
        top: 30,
        right: 10,
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },
    listItem: {
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    listText: {

    },
    divider: {
        width: '80%',
        marginLeft: '10%'
    }
})

export default function DropDown() {

    const { appState, dispatch } = useContext(AppContext);
    const navigation = useNavigation();

    const handleCreatePlayer = () => {
        navigation.navigate('create-player');
        dispatch({type: OPTIONS_DROP_DOWN_OPEN,value: !appState.optionsOpen})
    }

    const handlecreateMatch = () => {
        navigation.navigate('create-match');
        dispatch({type: OPTIONS_DROP_DOWN_OPEN,value: !appState.optionsOpen})
    }

    if (!appState.optionsOpen) return null;

    const handlePressEvent = (event) =>{
        event.persist()
        console.log(event)
        return true
    }

    return (
        <View style={{ ...styles.container }} onStartShouldSetResponder={handlePressEvent}>
            <TouchableOpacity onPress={handleCreatePlayer} style={styles.listItem}>
                <Text>Create Player</Text>
            </TouchableOpacity>
            <Divider style={styles.divider} />
            <TouchableOpacity onPress={handlecreateMatch} style={styles.listItem}>
                <Text>Create Match</Text>
            </TouchableOpacity>
        </View>
    )
}
