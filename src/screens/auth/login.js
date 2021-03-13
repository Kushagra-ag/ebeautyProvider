import React, { useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import {
    Grid,
    Row,
    Col,
    Container,
    Content,
    Form,
    Item,
    Input,
    Label,
    Button,
} from 'native-base';
import stylesCtm from '../../styles';
import { profileCheck, login } from '../../methods/authMethods.js';
import axios from 'axios';

export default function Login({ navigation }) {
    const [cred, setCred] = useState({
        email: 'test@test.com',
        password: 'test'
    });
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (text, name) => {
        setCred({ ...cred, [name]: text.trim() });
        // console.log(cred)
    };

    const onSubmit = async () => {

        if(!cred.email || !cred.password) {
            setErr("All fields are required")
            return
        }

        setLoading(true);

        function failure(err) {
            if(err) 
                setErr(err.message)
            else
                setErr("Invalid email or password");
            
            setCred({
                ...cred,
                password: ''
            });
            setLoading(false);
        }

        function success() {
            setErr("");
            setLoading(false);
            navigation.replace('App', {
                screen: 'Home'
            });
        }

        login(cred, success, failure);
    };

    return (
        <Container style={stylesCtm.container}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Form style={styles.container}>
                    <Text style={stylesCtm.heading}>Login</Text>
                    <Item inlineLabel style={{ marginBottom: 10 }}>
                        <Label>Email</Label>
                        <Input
                            type="text"
                            name="email"
                            autoCompleteType="email"
                            blurOnSubmit={true}
                            clearButtonMode="while-editing"
                            keyboardType="email-address"
                            selectTextOnFocus={true}
                            value={cred.email}
                            onChangeText={text => handleChange(text, 'email')}
                            autoFocus
                        />
                    </Item>
                    <Item inlineLabel>
                        <Label>Password</Label>
                        <Input
                            secureTextEntry={true}
                            name="password"
                            autoCompleteType="password"
                            blurOnSubmit={true}
                            clearButtonMode="while-editing"
                            keyboardType="default"
                            value={cred.password}
                            onChangeText={text =>
                                handleChange(text, 'password')
                            }
                        />
                    </Item>

                    <Button
                        primary
                        block
                        disabled={loading ? true : false}
                        style={stylesCtm.primaryBtn}
                        onPress={onSubmit}
                    >
                        {
                            loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={stylesCtm.buttonText}>Sign In</Text>
                        }
                    </Button>
                    <View
                        style={stylesCtm.errMsg}
                    >
                        <Text style={{ color: '#f85f6a', fontWeight: 'bold' }}>
                            {err}
                        </Text>
                        <TouchableOpacity onPress={() => null}>
                            <Text style={{ color: '#999', fontWeight: 'bold' }}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            paddingTop: 10
                        }}
                    >
                        <Text>Or use one of your social profiles</Text>
                    </View>
                </Form>

                <View style={styles.grid}>
                    <View style={styles.btnFlex}>
                        <View style={{...styles.socialMedia, ...styles.twitter}}>
                        
                            <AntDesign
                                name="twitter"
                                size={24}
                                color="white"
                                style={{ paddingRight: 10 }}
                            />
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    color: '#fff'
                                }}
                            >
                                Twitter
                            </Text>
                        </View>
                        <View style={{...styles.socialMedia, ...styles.facebook}}>
                        
                            <EvilIcons
                                name="sc-facebook"
                                size={30}
                                color="white"
                                style={{ paddingRight: 3 }}
                            />
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    color: '#fff'
                                }}
                            >
                                Facebook
                            </Text>
                        
                        </View>
                    </View>
                    <View>
                        
                            <Text style={{ color: '#999', fontWeight: 'bold' }}>
                                Don't have an account?
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Auth', {
                                    screen: 'Register'
                                })}
                            >
                                <Text
                                    style={{
                                        color: '#f85f6a',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Create one here
                                </Text>
                            </TouchableOpacity>
                        
                    </View>
                </View>
            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
       backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    grid: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnFlex: {
        flexDirection: 'row'
    },
    socialMedia: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginVertical: 30,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 5
    },
    twitter: {
        backgroundColor: '#1da1f2',
        marginRight: 10,
    },
    facebook: {
        backgroundColor: '#3b5998',
        marginLeft: 10,
    }
});
