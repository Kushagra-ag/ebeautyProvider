import React, { useState, useRef } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import {
    Container,
    Header,
    Form,
    Item,
    Input,
    Left,
    Label,
    Button,
    Icon,
    Body,
    Title
} from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { register } from '../../methods/authMethods.js';
import stylesCtm from '../../styles/index.js';
import { GOOGLE_KEY } from '../../methods/config.js';

const GooglePlacesInput = props => {
    const ref = useRef();
    let { cred, setCred } = props;

    const clearField = () => {
        ref.current?.clear();
    };

    return (
        <GooglePlacesAutocomplete
            ref={ref}
            placeholder="Search City"
            minLength={2}
            filterReverseGeocodingByTypes={['administrative_area_level_3']}
            // currentLocation={true}
            fetchDetails={true}
            onPress={(data, details = null) => {
                // console.log('data-', data);
                console.log('deatils-', details.geometry.location)
                setCred({ ...cred, userLocation: JSON.stringify([details.geometry.location.lat, details.geometry.location.lng]) });
            }}
            returnKeyType="search"
            query={{
                key: GOOGLE_KEY,
                language: 'en'
            }}
            debounce={200}
            listViewDisplayed="auto"
            styles={{
                listView: {
                    // position: 'absolute',
                    top: 50,
                    borderBottomWidth: 1,
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderColor: '#ccc',
                    zIndex: 1
                },
                textInput: {
                    padding: 'auto',
                    paddingTop: 10
                    // height: 'auto'
                }
            }}
            textInputProps={{
                onBlur: () => {
                    if (!cred.customerLocation) {
                        setCred({ ...cred, customerLocation: '' });
                        clearField();
                    }
                    console.log(cred);
                },
                onFocus: () => {
                    setCred({ ...cred, customerLocation: '' });
                    clearField();
                }
            }}
        />
    );
};

function Register({ navigation }) {
    const [cred, setCred] = useState({
        name: 'Test',
        email: 'test@test.com',
        phone: '9999999999',
        password: 'test',
        userLocation: '',
        repeatPassword: 'test'
    });
    const [err, setErr] = useState('');
    const [checked, setChecked] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleChecked = () => {
        console.log('in check ');
        setChecked(!checked);
    };

    const handleChange = (text, name) => {
        // console.log(name);
        // console.log(text)

        setCred({ ...cred, [name]: name === 'name' ? text : text.trim() });
        // console.log(cred)
    };

    const onSubmit = async () => {
        if (
            !cred.email ||
            !cred.password ||
            !cred.phone ||
            // !cred.customerLocation ||             // for dev ppurposes-- change later
            !cred.name ||
            !cred.repeatPassword
        ) {
            setErr('All fields are required');
            return;
        }

        if (cred.password !== cred.repeatPassword) {
            setErr('Passwords do not match');
            return;
        }

        if (!checked) {
            setErr('Please select the checkbox');
            return;
        }

        function failure(err) {
            err ? setErr(err) : setErr('Invalid details');
            setCred({
                ...cred,
                password: '',
                repeatPassword: ''
            });
            setLoading(false);
        }

        function success() {
            setErr('');
            setLoading(false);
            navigation.navigate('App', {
                screen: 'Profile',
                params: {
                    screen: 'Services'
                }
            });
        }

        // setLoading(true);
        // register(cred, success, failure);

        navigation.navigate('App', {
            screen: 'Profile',
            params: {
                screen: 'Services'
            }
        });
        // navigation.navigate('Request')
    };

    return (
        <Container style={stylesCtm.container}>
            {
                // <Header>
                //         <Left>
                //           <Button transparent>
                //             <Icon name='arrow-back' />
                //           </Button>
                //         </Left>
                //         <Body>
                //           <Title>Header</Title>
                //         </Body>
                //       </Header>
            }
            <SafeAreaView>
                <ScrollView keyboardShouldPersistTaps="handled"  showsVerticalScrollIndicator={false}>
                    <Form style={styles.container}>
                        <Text style={styles.title}>
                            Let's start with creating your account
                        </Text>
                        <Item inlineLabel style={{ marginBottom: 10 }}>
                            <Label>Full Name</Label>
                            <Input
                                type="text"
                                name="name"
                                autoCompleteType="name"
                                blurOnSubmit={true}
                                clearButtonMode="while-editing"
                                keyboardType="default"
                                value={cred.name}
                                onChangeText={text =>
                                    handleChange(text, 'name')
                                }
                                autoFocus
                            />
                        </Item>
                        <Item inlineLabel style={{ marginBottom: 10 }}>
                            <Label>Email</Label>
                            <Input
                                type="text"
                                name="email"
                                autoCompleteType="email"
                                blurOnSubmit={true}
                                clearButtonMode="while-editing"
                                keyboardType="email-address"
                                value={cred.email}
                                onChangeText={text =>
                                    handleChange(text, 'email')
                                }
                            />
                        </Item>
                        <Item inlineLabel style={{ marginBottom: 10 }}>
                            <Label>Phone</Label>
                            <Input
                                type="text"
                                name="phone"
                                autoCompleteType="tel"
                                blurOnSubmit={true}
                                clearButtonMode="while-editing"
                                keyboardType="phone-pad"
                                value={cred.phone}
                                onChangeText={text =>
                                    handleChange(text, 'phone')
                                }
                            />
                        </Item>
                        <Item
                            inlineLabel
                            style={{
                                marginBottom: 10,
                                position: 'relative',
                                zIndex: 100
                            }}
                        >
                            <Label>City</Label>
                            <GooglePlacesInput cred={cred} setCred={setCred} />
                        </Item>
                        <Item inlineLabel style={{ marginBottom: 10 }}>
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
                        <Item inlineLabel>
                            <Label>Repeat Password</Label>
                            <Input
                                secureTextEntry={true}
                                name="repeatPassword"
                                autoCompleteType="password"
                                blurOnSubmit={true}
                                clearButtonMode="while-editing"
                                keyboardType="default"
                                value={cred.repeatPassword}
                                onChangeText={text =>
                                    handleChange(text, 'repeatPassword')
                                }
                            />
                        </Item>

                        <View style={styles.checkbox}>
                            <Checkbox
                                status={checked ? 'checked' : 'unchecked'}
                                color="#f85f6a"
                                onPress={handleChecked}
                            />
                            <Text style={{ paddingLeft: 15, lineHeight: 20 }}>
                                By proceeding, I agree to eBeauty’s Terms of Use
                                and acknowledge that I have read the Privacy
                                Notice.
                            </Text>
                        </View>

                        <Button
                            primary
                            block
                            disabled={loading ? true : false}
                            style={styles.button}
                            onPress={onSubmit}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={stylesCtm.buttonText}>
                                    Register
                                </Text>
                            )}
                        </Button>
                        <View style={stylesCtm.errMsg}>
                            <Text
                                style={{
                                    color: '#f85f6a',
                                    fontWeight: 'bold',
                                    marginBottom: 15
                                }}
                            >
                                {err}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text
                                    style={{
                                        color: '#999',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Have an account?
                                </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Login')}
                                >
                                    <Text
                                        style={{
                                            color: '#f85f6a',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        &nbsp;Sign In
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Form>
                </ScrollView>
            </SafeAreaView>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 25,
        paddingHorizontal: 15,
        marginVertical: 30,
        alignSelf: 'flex-start'
    },
    button: {
        backgroundColor: '#f85f6a',
        marginTop: 30,
        paddingHorizontal: 20,
        borderRadius: 5,
        zIndex: 0,
        position: 'relative'
    },
    checkbox: {
        display: 'flex',
        marginHorizontal: 20,
        flexDirection: 'row',
        paddingVertical: 30,
        alignItems: 'center'
    }
});

export default Register;
