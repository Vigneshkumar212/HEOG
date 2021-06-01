import React from 'react';
import { createAppContainer, createSwitchNavigator, } from 'react-navigation';
import WelcomeScreen from './screens/welcome';
import { NGOBottomTabNavigator } from './bottomTabNavigations/NGOBottomTabNavigation'
import { userBottomTabNavigator } from './bottomTabNavigations/userBottomTabNavigation'

export default function App() {
  return (
    <AppContainer />
  );
}


const switchNavigator = createSwitchNavigator({
  WelcomeScreen: { screen: WelcomeScreen },
  NGOBottomTabNavigator: { screen: NGOBottomTabNavigator },
  usrBottomTabNavigator: { screen: userBottomTabNavigator }
})

const AppContainer = createAppContainer(switchNavigator);