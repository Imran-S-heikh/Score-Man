/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './screens/drawer/home';
import HeaderWraper from './components/HeaderWraper';
import Players from './screens/drawer/players';
import CreatePlayer from './screens/tabs/createPlayer';
import PlayerContextProvider from './contexts/palyers/playerContext';
import AppContextProvider from './contexts/appContext/appContext';
import CreateMatch from './screens/tabs/createMatch';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Toss from './components/Toss';
import LiveMatch from './screens/drawer/liveMatch';
import MatchContextProvider from './contexts/match/matchContext';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function Body() {

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Players" component={Players} />
      <Drawer.Screen name="Live Match" component={LiveMatch} />
      <Drawer.Screen name="Do a Toss" component={Toss} />
    </Drawer.Navigator>
  )
}

const App: () => React$Node = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Score Man"
          component={Body}
          options={{
            header: props => <HeaderWraper />
          }}
        />
        <Stack.Screen name="create-player" component={CreatePlayer} />
        <Stack.Screen name="create-match" component={CreateMatch} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AppWraper = () => <AppContextProvider>
  <MatchContextProvider>
    <PlayerContextProvider>
      <App />
    </PlayerContextProvider>
  </MatchContextProvider>
</AppContextProvider>

export default AppWraper;
