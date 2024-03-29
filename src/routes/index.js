import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Container, Content, Text, StyleProvider, Root } from 'native-base';
import * as Font from 'expo-font';
import { EvilIcons, AntDesign } from '@expo/vector-icons';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/commonColor.js';
import Auth from '../screens/auth';

import AppScreens from '../screens';
import { navigationRef, profileCheck } from '../methods/authMethods.js';


const Stack = createStackNavigator();

function myStack() {
    const [font, setFont] = useState(false);
    const [route, setRoute] = useState('Auth');

    async function loadFont(isCancelled) {
        
        if(!isCancelled) {
            await Font.loadAsync({
                Roboto: require('native-base/Fonts/Roboto.ttf'),
                Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
            },
        )

            setFont(true);
        }
    }

    useEffect(() => {
        let isCancelled = false;

        profileCheck()
            .then(res => {
                if (res) {
                    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
                    setRoute('App');
                    console.log("in routes-index profileCheck")
                }

                loadFont(isCancelled);
            })
            .catch(e => {
                console.log(e);
            });

        return () => {
            isCancelled = true;
            console.log('return from index-routes');
        };
    }, []);

    return font ? (
        <Root>
            <StyleProvider style={getTheme(material)}>
                <NavigationContainer ref={navigationRef}>
                    <Stack.Navigator initialRouteName={route} headerMode="none">
                        <Stack.Screen name="Auth" component={Auth} />
                        <Stack.Screen name="App" component={AppScreens} />
                        
                    </Stack.Navigator>
                </NavigationContainer>
            </StyleProvider>
        </Root>
    ) : null;
}

export default myStack;
