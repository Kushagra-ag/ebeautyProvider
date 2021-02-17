import React, { useEffect } from "react";
import { View, Text, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
// import { useIsDrawerOpen } from "@react-navigation/drawer";
import { Button, Footer, FooterTab } from "native-base";
import stylesCtm from "../styles";

export default function BottomNav() {
    const navigation = useNavigation();
    const route = useRoute();

    // const isDrawerOpen = useIsDrawerOpen();

    useEffect(() => {
        // console.log(navigation)
    }, []);

    return (
        <Footer style={stylesCtm.footer}>
            
                <FooterTab>
                    <Button
                        onPress={() => null
                            // navigation.reset({
                            //     index: 0,
                            //     routes: [{ name: 'Home' }]
                            // })
                        }
                    >
                        <Ionicons
                            name={
                                Platform.OS === 'ios' ? 'ios-home' : 'md-home'
                            }
                            size={24}
                            color={route.name === "Home" ? "#f85f6a" : "#000"}
                        />
                    </Button>
                    <Button onPress={() => null
                    //     navigation.navigate('Services', {
                    //     screen: 'Index'
                    // })
                    }>
                        <MaterialIcons name="person-pin" size={24} color={route.name === "Services" ? "#f85f6a" : "#000"} />
                    </Button>
                    <Button onPress={() => null
                        // navigation.navigate('Cart')
                    }>
                        <Ionicons name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'} size={24} color={route.name === "Cart" ? "#f85f6a" : "#000"} />
                    </Button>
                    <Button onPress={() => {console.log('toggle')
                        Platform.OS === 'ios' ? navigation.navigate('Menu') : navigation.toggleDrawer()
                    }
                    }>
                        <Ionicons name={Platform.OS === 'ios' ? 'ios-more' : 'md-menu'} size={24} color="#000" />
                    </Button>
                </FooterTab>
            
        </Footer>
    );
}
