import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Default from './default.js';

const docStack = createStackNavigator();

export default function myStack() {
    return (
        <docStack.Navigator headerMode="none" initialRouteName="Index">
        	<docStack.Screen name="Index" component={Default} />
        </docStack.Navigator>
    );
}