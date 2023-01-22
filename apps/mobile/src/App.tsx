import 'react-native-gesture-handler';
import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Home from './screens/drawer/Home';
import HeaderWraper from './components/HeaderWraper';
import Players from './screens/drawer/Players';
import CreatePlayer from './screens/tabs/CreatePlayer';
import PlayerContextProvider from './contexts/palyers/playerContext';
import AppContextProvider from './contexts/appContext/appContext';
import CreateMatch from './screens/tabs/CreateMatch';
import Toss from './components/Toss';
import LiveMatch from './screens/drawer/LiveMatch';
import MatchContextProvider, {
  MatchContext,
} from './contexts/match/matchContext';
import AddPlayerToMatch from './screens/tabs/AddPlayerToMatch';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function Body() {
  const {match, dispatch}:any = useContext(MatchContext);

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Players" component={Players} />
      {match.id && <Drawer.Screen name="Live Match" component={LiveMatch} />}
      <Drawer.Screen name="Do a Toss" component={Toss} />
    </Drawer.Navigator>
  );
}

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Score Man"
          component={Body}
          options={{
            header: (props) => <HeaderWraper />,
          }}
        />
        <Stack.Screen name="create-player" component={CreatePlayer} />
        <Stack.Screen name="create-match" component={CreateMatch} />
        <Stack.Screen name="add-player-to-match" component={AddPlayerToMatch} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const AppWraper = () => (
  <AppContextProvider>
    <MatchContextProvider>
      <PlayerContextProvider>
        <App />
      </PlayerContextProvider>
    </MatchContextProvider>
  </AppContextProvider>
);

export default AppWraper;
