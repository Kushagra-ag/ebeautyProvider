import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Alert,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import {
    Grid,
    Row,
    Col,
    Container,
    Header,
    Left,
    Body,
    Right,
    Title,
    List,
    ListItem,
    Thumbnail,
    Item,
    Input,
    Label,
    Button
} from 'native-base';
import * as Location from 'expo-location';
import { fetchProduct, acceptRequest } from '../../methods/orderMethods.js';
import BottomNav from '../../components/BottomNav.js';
import stylesCtm from '../../styles';

export default function Default({ navigation, route }) {
    const [services, addServices] = useState([]);
    const [err, setErr] = useState('');

    useEffect(() => {
        console.log('route.params', route);

        addServices([]);
        route.params.notification.data.products.map(item => {
            fetchProduct(item.product, handleServices, item.quantity);
        });

        return () => console.log('return from request default');
    }, []);

    const handleServices = res => addServices(services => [...services, res]);

    const getLocation = async () => {
        const { status } = await Location.requestPermissionsAsync();

        if (status !== 'granted') {
            console.log('not granted');
            Alert.alert(
                'Permission needed',
                'E-beauty needs your device location in order to send your location',
                [
                    {
                        text: 'Ok',
                        onPress: () => {
                            console.log('Ok Pressed');
                            // navigation.goBack();
                            setErr(
                                'Location permission not granted. Please go back and try again.'
                            );
                        }
                    }
                ]
            );
        } else if (status === 'granted') {
            console.log('granted');

            try {
                const loc = await Location.getCurrentPositionAsync();
                console.log('loc.coords', loc.coords);

                return loc.coords;
            } catch (e) {
                console.log(e);
                setErr(
                    'We could not fetch your location, make sure you have location services enabled on your device and try again.'
                );
            }
        } else {
            console.log('in else')
        }
    };

    const acceptOrder = async () => {
        console.log('in ao')
        const myLocation = await getLocation();
        console.log('gh');

        let data = {
            orderId: route.params.notification.data._id,
            sellerLocation: `[${myLocation.latitude}, ${myLocation.longitude}]`
        };

        const success = () => {
            console.log('acccepted');

            navigation.navigate('Location', {
                                            location:
                                                route.params.notification.data
                                                    .customerLocation
                                        })
        };

        const failure = () => {
            console.log('failed');
        };

        acceptRequest(data, success, failure);
    };

    return (
        <React.Fragment>
            <Header noLeft>
                <Left />
                <Body>
                    <Title>Request</Title>
                </Body>
                <Right />
            </Header>
            <ScrollView>
                <Text style={stylesCtm.heading}>There is a request nearby</Text>
                <List>
                    {services.length > 0 &&
                        services.map(item =>
                            item ? (
                                <ListItem thumbnail key={item._id}>
                                    <Left>
                                        <Thumbnail
                                            square
                                            source={{ uri: item.img }}
                                        />
                                    </Left>
                                    <Body>
                                        <Text style={stylesCtm.listItemBody}>
                                            {item.name}
                                        </Text>
                                    </Body>
                                    <Right>
                                        <Text style={{ fontWeight: 'bold' }}>
                                            <Text
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: 'normal'
                                                }}
                                            >{`${item.qty} x  `}</Text>
                                            {`\$${item.price}`}
                                        </Text>
                                    </Right>
                                </ListItem>
                            ) : null
                        )}
                    <ListItem thumbnail key="TotalAmt">
                        <Body>
                            <Text style={{ fontWeight: 'bold' }}>
                                Grand total
                            </Text>
                        </Body>
                        <Right>
                            <Text
                                style={{ fontWeight: 'bold' }}
                            >{`\$${route.params.notification.data.totalPrice}`}</Text>
                        </Right>
                    </ListItem>
                    <Grid style={{ marginVertical: 20 }}>
                        <Row>
                            <Col style={styles.leftBtn}>
                                <Button primary block style={stylesCtm.button} onPress={acceptOrder}>
                                    <Text style={stylesCtm.buttonText}>
                                        Accept Order
                                    </Text>
                                </Button>
                            </Col>
                            <Col style={styles.rightBtn}>
                                <Button
                                    dark
                                    block
                                    onPress={() => 
                                        navigation.navigate('Location', {
                                            location:
                                                route.params.notification.data
                                                    .customerLocation
                                        })
                                    }
                                    style={stylesCtm.button}
                                >
                                    <Text style={stylesCtm.buttonText}>
                                        View Location
                                    </Text>
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                </List>
                
            </ScrollView>
            <BottomNav />
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        // alignItems: 'center',
        justifyContent: 'center',
        margin: 20
    },
    leftBtn: {
        marginLeft: 10,
        marginRight: 5
    },
    rightBtn: {
        marginRight: 10,
        marginLeft: 5
    }
});
