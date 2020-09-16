import React, { useState, useContext, useEffect } from 'react'
import { View } from 'react-native'
import PlayerContextProvider, { PlayerContext } from '../../contexts/palyers/playerContext';
import { Input, Button, Text } from 'react-native-elements'
import { CREATE_PLAYER } from '../../contexts/palyers/playerTypes';
import { uuid } from '../../utils';



function CreatePlayer() {

    const [name, setName] = useState('');
    const { players, dispatch } = useContext(PlayerContext);

    const handlePress = () => {
        if (name !== '') {
            const newPlayer = { name, id: uuid() };
            dispatch({ type: CREATE_PLAYER, value: newPlayer })
            setName('')
        }
    }

    return (
        <View>
            <Text h2 style={{ textAlign: 'center', marginBottom: 20 }}>Create a Player</Text>
            <Input placeholder="Name"
                label="Player Name" value={name}
                onChangeText={e => setName(e)}
                rightIcon={{ name: 'user', type: "font-awesome" }}
            />
            <Button title="Create Player" onPress={handlePress} />
        </View>
    )
}

export default CreatePlayer