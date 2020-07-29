import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { Header,Icon } from 'react-native-elements'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import DropDown from './dropDown'
import { AppContext } from '../contexts/appContext/appContext'
import { OPTIONS_DROP_DOWN_OPEN } from '../contexts/appContext/types'


function RightComponent() {

  const {appState,dispatch} = useContext(AppContext);

  const handleOptions = ()=>{
      dispatch({type: OPTIONS_DROP_DOWN_OPEN,value: !appState.optionsOpen})
  }

  return (
    <View style={{display: 'flex',flexDirection: 'row'}}>
      <Icon onPress={handleOptions} name="dots-three-vertical" type="entypo" color="#fff" />
      <DropDown/>
    </View>
  )
}

export default function HeaderWraper() {
  

  const navigation = useNavigation();

  const handlePress = ()=>{
    navigation.dispatch(DrawerActions.toggleDrawer())
  }

  return (
    <>
      <Header
        placement="left"
        leftComponent={{ icon: 'menu', color: '#fff', size:30, onPress: handlePress}}
        centerComponent={{ text: 'Score Man', style: { color: '#fff',fontSize: 16,fontWeight: 'bold' } }}
        rightComponent={<RightComponent/>}
      />
    </>
  )
}
