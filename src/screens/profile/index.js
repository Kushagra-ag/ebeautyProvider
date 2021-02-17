import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Container } from 'native-base';
import Default from './default.js';
import Services from './services.js';
import Documents from './documents';
import BottomNav from '../../components/BottomNav.js';

const profileStack = createStackNavigator();

export default function myStack({ navigation }) {
    return (
    	<Container>
	        <profileStack.Navigator headerMode="none" initialRouteName="Index">
	        	<profileStack.Screen name="Index" component={Default} />
	        	<profileStack.Screen name="Services" component={Services} />
	        	<profileStack.Screen name="Documents" component={Documents} />          
	        </profileStack.Navigator>
	        <BottomNav />
        </Container>
    );
}