import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import * as Notifications from 'expo-notifications';
import Geocoder from 'react-native-geocoding';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { logout, profileCheck } from '../methods/authMethods.js';
import { GOOGLE_KEY } from '../methods/config.js';
import StylesCtm from '../styles';
import Home from './home.js';
import Profile from './profile';
import Request from '../screens/request';

Geocoder.init(GOOGLE_KEY);
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function CustomDrawerContentAndroid(props) {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        profileCheck()
            .then(res => {
                if (res) {

                    // console.log('res - ', res.user);
                    setProfile(res.user);

                } else {
                    props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'Auth', params: {screen:'Login'} }]
                    });
                    return;
                }
            })
            .catch(e => {
                console.log(e);
                props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Auth', params: {screen:'Login'} }]
                });
                return;
            });
    }, []);

    return (
        Boolean(profile) && (
            <DrawerContentScrollView {...props}>
                <View style={StylesCtm.sidebarContainer}>
                    <View style={styles.headerView}>
                        <Image
                            style={styles.headerImg}
                            source={{ uri: profile.picture }}
                        />
                        <Text style={styles.headerName}>{profile.name}</Text>
                        <Text style={styles.headerDetails}>
                            {profile.email}
                        </Text>
                    </View>
                    <DrawerItem
                        label="Home"
                        icon={({ focused, size, color }) => (
                            <MaterialIcons
                                color={color}
                                size={size}
                                name="home"
                            />
                        )}
                        labelStyle={StylesCtm.sidebarLabel}
                    />
                    <DrawerItem
                        label="My Cart"
                        onPress={() => null
                            // props.navigation.navigate('Cart');
                        }
                        icon={({ focused, size, color }) => (
                            <MaterialIcons
                                color={color}
                                size={size}
                                name="shopping-cart"
                            />
                        )}
                        labelStyle={StylesCtm.sidebarLabel}
                    />

                    {
                        <DrawerItem
                            label="My Profile"
                            onPress={() => 
                                props.navigation.navigate('Profile', {
                                    screen: 'Services'
                                })
                            }
                            icon={({ focused, size, color }) => (
                                <MaterialIcons
                                    color={color}
                                    size={size}
                                    name="person"
                                />
                            )}
                            labelStyle={StylesCtm.sidebarLabel}
                        />
                    }
                    {
                        <DrawerItem
                            label="My Orders"
                            onPress={() => null
                                // props.navigation.navigate('Orders');
                            }
                            icon={({ focused, size, color }) => (
                                <MaterialIcons
                                    color={color}
                                    size={size}
                                    name="person"
                                />
                            )}
                            labelStyle={StylesCtm.sidebarLabel}
                        />
                    }
                    <DrawerItem
                        label="Logout"
                        onPress={() =>
                            logout()
                        }
                        icon={({ focused, size, color }) => (
                            <MaterialCommunityIcons
                                name="logout"
                                size={size}
                                color={color}
                            />
                        )}
                        labelStyle={StylesCtm.sidebarLabel}
                    />

                    <View style={StylesCtm.sidebarFooter}>
                        <Text>Ebeauty &#8226; Terms of services</Text>
                    </View>
                </View>
            </DrawerContentScrollView>
        )
    );
}



export default function myStack({ navigation }) {
	const [notification, setNotification] = useState(false);
	const notificationListener = useRef();
	const responseListener = useRef();

	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowAlert: true,
			shouldPlaySound: false,
			shouldSetBadge: false
		})
	});

	useEffect(() => {
		notificationListener.current = Notifications.addNotificationReceivedListener(
			notification => {
				setNotification(notification);
				console.log(
					'The recdd notif from provider app is - ',
					notification
				);
			}
		);

		responseListener.current = Notifications.addNotificationResponseReceivedListener(
			handleNotifResponse
		);

		return () => {
			Notifications.removeNotificationSubscription(notificationListener);
			Notifications.removeNotificationSubscription(responseListener);
		};
	}, []);

	const handleNotifResponse = response => {
		// console.log('notification clicked', response);
		console.log('-----------', response.notification.request.content.data);
		navigation.navigate('Request', {
			screen: 'Index',
			params: {
				notification: response.notification.request.content.data
			}
		});
	};


	return (
		<SafeAreaView style={StylesCtm.safeAreaView}>
			<Drawer.Navigator
                        initialRouteName="Home"
                        headerMode="none"
                        drawerPosition="right"
                        // unmountOnBlur="true"
                        screenOptions={{ swipeEnabled: false }}
                        drawerContent={props => (
                            <CustomDrawerContentAndroid {...props} />
                        )}
                    >
                        <Drawer.Screen name="Home" component={Home} />
                        <Drawer.Screen name="Profile" component={Profile} />
                        <Stack.Screen name="Request" component={Request} />
                    </Drawer.Navigator>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
    headerView: {
        padding: 20,
        marginBottom: 5,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1
    },
    headerImg: {
        height: 80,
        width: 80,
        borderRadius: 15,
        marginBottom: 20
    },
    headerName: {
        fontSize: 18,
        textTransform: 'capitalize'
    },
    headerDetails: {
        color: '#999'
    }
});
