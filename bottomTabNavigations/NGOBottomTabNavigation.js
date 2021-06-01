import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import NGOScreen1 from '../screens/NGOScreen1';
import NGOScreen2 from '../screens/NGOScreen2';
import NGOScreen3 from '../screens/NGOScreen3';
import { Icon } from "react-native-elements";

export const NGOBottomTabNavigator = createBottomTabNavigator({
    NGOScreen1: {
        screen: NGOScreen1,
        navigationOptions: {
            tabBarIcon: <Icon name="plus" type="font-awesome" color="#0084ff" />,
            tabBarLabel: "Open Requests",
        }
    },
    NGOScreen2: {
        screen: NGOScreen2,
        navigationOptions: {
            tabBarIcon: <Icon name="book" type="font-awesome" color="#0084ff" />,
            tabBarLabel: "Requests Accepted",
        }
    },
    NGOScreen3: {
        screen: NGOScreen3,
        navigationOptions: {
            tabBarIcon: <Icon name="history" type="font-awesome" color="#0084ff" />,
            tabBarLabel: "Requests Done",
        }
    }
});
