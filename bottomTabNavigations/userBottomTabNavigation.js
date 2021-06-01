import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import userScreen1 from '../screens/userScreen1';
import userScreen2 from '../screens/userScreen2';
import { Icon } from "react-native-elements";

export const userBottomTabNavigator = createBottomTabNavigator({
    userScreen1: {
        screen: userScreen1,
        navigationOptions: {
            tabBarIcon: <Icon name="history" type="font-awesome" color="#0084ff" />,
            tabBarLabel: "History",
        }
    },
    userScreen2: {
        screen: userScreen2,
        navigationOptions: {
            tabBarIcon: <Icon name="book" type="font-awesome" color="#0084ff" />,
            tabBarLabel: "New Case",
        }
    },

});
