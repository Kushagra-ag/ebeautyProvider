import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './login.js';
import Default from './default.js';
import Register from './register.js';

const authStack = createStackNavigator();

export default function myStack() {
    return (
        <authStack.Navigator headerMode="none" initialRouteName="Index">
            <authStack.Screen name="Login" component={Login} />
            <authStack.Screen name="Register" component={Register} />
            <authStack.Screen name="Index" component={Default} />
        </authStack.Navigator>
    );
}