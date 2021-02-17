import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Container } from 'native-base';
import Default from './default.js';
import Location from './location.js';

const reqStack = createStackNavigator();

export default function myStack({ navigation }) {
    return (
    	<Container>
        <reqStack.Navigator headerMode="none" initialRouteName="Index">
        	<reqStack.Screen name="Index" component={Default} />
        	<reqStack.Screen name="Location" component={Location} />
        </reqStack.Navigator>
        </Container>
    );
}