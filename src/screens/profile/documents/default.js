import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    BackHandler,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Camera } from 'expo-camera';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Ionicons } from '@expo/vector-icons';
import mime from 'mime';
import {
    Header,
    Form,
    Item,
    Left,
    Right,
    Label,
    Button,
    Icon,
    Body,
    Title,
    List,
    ListItem,
    Thumbnail
} from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import CameraScreen from '../../../components/CameraScreen.js';
import { profileCheck, uploadDocuments } from '../../../methods/authMethods.js';
import stylesCtm from '../../../styles/index.js';
const MAX_FILE_SIZE = 10000000;

export default function Documents({ navigation }) {
    const { showActionSheetWithOptions } = useActionSheet();
    const [docs, uploadDocs] = useState({
        profileImg: null,
        driverLicenseFront: null,
        driverLicenseBack: null,
        barberLicense: null,
        cosmetologyLicense: null
    });
    const [names, setNames] = useState({
        profileImg: null,
        driverLicenseFront: null,
        driverLicenseBack: null,
        barberLicense: null,
        cosmetologyLicense: null
    });
    const [verified, isVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');
    const [checked, setChecked] = useState(true);
    // const [hasPermission, setHasPermission] = useState(null);
    // const [type, setType] = useState(Camera.Constants.Type.back);
    // const [photo, setPhoto] = useState(null);
    // const [camera, setCamera] = useState({
    //     hasPermission: null,
    //     type: Camera.Constants.Type.back,
    //     capturedPhoto: null
    // });

    const [camera, setCamera] = useState({
        status: false,
        file: null
    });

    useEffect(() => {
        profileCheck()
            .then(profile => {
                if (profile?.isVerified === 'true') {
                    isVerified(true);
                }
            })
            .catch(() => null);

        //     (async () => {
        //   const { status } = await Camera.requestPermissionsAsync();
        //   setHasPermission(status === 'granted');
        // })();
    }, []);

    const onSubmit = e => {
        console.log('in onsubmit');

        let formData = new FormData();
        console.log('before-', docs);

        for (let file in docs) {

                if(docs[file]) {
                let fileuri = docs[file];
                // fileuri = `file:///${fileuri.split('file:///').join('')}`;

                let filename = fileuri.split('/').pop();

                // Infer the type of the image

                let type = mime.getType(fileuri);

                formData.append(file, { uri: fileuri, name: filename, type });
            }
        }

        const success = () => {
            setErr('')
            setLoading(false);
            // navigation.navigate('Home')
        }

        const failure = msg => {
            setLoading(false);
            setErr(msg)
        }

        setLoading(true)
        uploadDocuments(formData, success, failure);
    };

    const handleChecked = () => {
        setChecked(!checked);
    };

    const _pickDocument = async doc => {
        let result = await DocumentPicker.getDocumentAsync({
            type: 'image/*',
            copyToCacheDirectory: true
        });
        console.log(result);

        if (result.type !== 'cancelled') {
            if (result.size <= MAX_FILE_SIZE) {
                uploadDocs({ ...docs, [doc]: result.uri });
                setNames({ ...names, [doc]: result.name });
            } else {
                alert('Please upload a file of less than 10MB');
            }
        }
    };

    // const _pickProfileImage = async () => {
    //     let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    //     if (permissionResult.granted === false) {
    //         alert('Permission to access camera roll is required!');
    //         return;
    //     }

    //     let result = await ImagePicker.launchImageLibraryAsync({
    //         allowsEditing: true,
    //         aspect: [1, 1]
    //     });

    //     console.log(result);

    //     if (!result.cancelled) {
    //         uploadDocs({ ...docs, profileImg: result.uri });
    //     }
    // };

    const showActionSheet = file => {
        const options = ['Take a photo', 'Upload from gallery'];
        const destructiveButtonIndex = null;
        const cancelButtonIndex = null;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                destructiveButtonIndex,
                title: 'Choose a method',
                icons: [
                    <Ionicons name="ios-camera" size={24} color="#888" />,
                    <Ionicons name="md-images" size={24} color="#888" />
                ]
                // useModal: true
            },
            buttonIndex => {
                // Do something here depending on the button index selected
                if (buttonIndex === 0) {
                    setCamera({ status: true, file: file });
                } else if (buttonIndex === 1) {
                    _pickDocument(file);
                }
            }
        );
    };

    if (camera.status) {
        return (
            <CameraScreen
                camera={camera}
                setCamera={setCamera}
                docs={docs}
                uploadDocs={uploadDocs}
            />
        );
    }

    return (
        <React.Fragment>
            <Header>
                <Left>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" style={{ fontSize: 24 }} />
                    </Button>
                </Left>
                <Body>
                    <Title>Documents Upload</Title>
                </Body>
                <Right />
            </Header>
                <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20 }}>
                    <Text style={stylesCtm.heading}>Required Steps</Text>
                    <Text style={stylesCtm.headingDesc}>
                        Now you need to set up your account by uploading various
                        documents
                    </Text>
                    <View style={{ paddingVertical: 20 }}>
                        {
                            // <List>
                            //     <ListItem avatar onPress={() => null}>
                            //         <Left>
                            //             <Thumbnail
                            //                 source={require('../../../../../assets/favicon.png')}
                            //             />
                            //         </Left>
                            //         <Body>
                            //             <Text style={stylesCtm.listItemBody}>
                            //                 Background Check
                            //             </Text>
                            //         </Body>
                            //         <Right>
                            //             <Icon name="arrow-forward" />
                            //         </Right>
                            //     </ListItem>
                            //     <ListItem thumbnail onPress={() => null}>
                            //         <Left>
                            //             <Thumbnail
                            //                 source={require('../../../../../assets/favicon.png')}
                            //             />
                            //         </Left>
                            //         <Body>
                            //             <Text style={stylesCtm.listItemBody}>
                            //                 Profile photo
                            //             </Text>
                            //         </Body>
                            //         <Right>
                            //             <Icon name="arrow-forward" />
                            //         </Right>
                            //     </ListItem>
                            //     <ListItem thumbnail onPress={() => null}>
                            //         <Body>
                            //             <Text style={stylesCtm.listItemBody}>
                            //                 Driver's license
                            //             </Text>
                            //         </Body>
                            //         <Right>
                            //             <Icon name="arrow-forward" />
                            //         </Right>
                            //     </ListItem>
                            //     <ListItem thumbnail onPress={() => null}>
                            //         <Body>
                            //             <Text style={stylesCtm.listItemBody}>
                            //                 Cosmetology license
                            //             </Text>
                            //         </Body>
                            //         <Right>
                            //             <Icon name="arrow-forward" />
                            //         </Right>
                            //     </ListItem>
                            //     <ListItem thumbnail onPress={() => null}>
                            //         <Body>
                            //             <Text style={stylesCtm.listItemBody}>
                            //                 Barber license
                            //             </Text>
                            //         </Body>
                            //         <Right>
                            //             <Icon name="arrow-forward" />
                            //         </Right>
                            //     </ListItem>
                            // </List>
                        }
                        <Form>
                            <View style={styles.section}>
                                <Label style={stylesCtm.title}>
                                    Profile Picture
                                </Label>
                                {docs.profileImg && (
                                    <Image
                                        source={{ uri: docs.profileImg }}
                                        style={styles.img}
                                    />
                                )}
                                <Button
                                    light
                                    onPress={() =>
                                        showActionSheet('profileImg')
                                    }
                                    style={{
                                        ...stylesCtm.inlineBtn,
                                        ...styles.uploadBtn,
                                        backgroundColor: docs.profileImg
                                            ? '#36ad5a'
                                            : '#fff'
                                    }}
                                >
                                    <Text
                                        style={{
                                            ...stylesCtm.buttonText,
                                            color: docs.profileImg
                                                ? '#fff'
                                                : '#666'
                                        }}
                                    >
                                        {verified || docs.profileImg
                                            ? 'Update'
                                            : 'Upload'}
                                    </Text>
                                    <AntDesign
                                        style={{
                                            display: docs.profileImg
                                                ? 'flex'
                                                : 'none'
                                        }}
                                        name="checkcircle"
                                        size={24}
                                        color="#fff"
                                    />
                                </Button>
                                <Text style={styles.name} numberOfLines={1}>
                                    {names.profileImg}
                                </Text>
                            </View>
                            <View style={styles.section}>
                                <Label style={stylesCtm.title}>
                                    Barber License
                                </Label>
                                <Button
                                    light
                                    onPress={() =>
                                        showActionSheet('barberLicense')
                                    }
                                    style={{
                                        ...stylesCtm.inlineBtn,
                                        ...styles.uploadBtn,
                                        backgroundColor: docs.barberLicense
                                            ? '#36ad5a'
                                            : '#fff'
                                    }}
                                >
                                    <Text
                                        style={{
                                            ...stylesCtm.buttonText,
                                            color: docs.barberLicense
                                                ? '#fff'
                                                : '#666'
                                        }}
                                    >
                                        {verified || docs.barberLicense
                                            ? 'Update'
                                            : 'Upload'}
                                    </Text>
                                    <AntDesign
                                        style={{
                                            display: docs.barberLicense
                                                ? 'flex'
                                                : 'none'
                                        }}
                                        name="checkcircle"
                                        size={24}
                                        color="#fff"
                                    />
                                </Button>
                                <Text style={styles.name} numberOfLines={1}>
                                    {names.barberLicense}
                                </Text>
                            </View>
                            <View style={styles.section}>
                                <Label style={stylesCtm.title}>
                                    Cosmetology License
                                </Label>
                                <Button
                                    light
                                    onPress={() =>
                                        showActionSheet('cosmetologyLicense')
                                    }
                                    style={{
                                        ...stylesCtm.inlineBtn,
                                        ...styles.uploadBtn,
                                        backgroundColor: docs.cosmetologyLicense
                                            ? '#36ad5a'
                                            : '#fff'
                                    }}
                                >
                                    <Text
                                        style={{
                                            ...stylesCtm.buttonText,
                                            color: docs.cosmetologyLicense
                                                ? '#fff'
                                                : '#666'
                                        }}
                                    >
                                        {verified || docs.cosmetologyLicense
                                            ? 'Update'
                                            : 'Upload'}
                                    </Text>
                                    <AntDesign
                                        style={{
                                            display: docs.cosmetologyLicense
                                                ? 'flex'
                                                : 'none'
                                        }}
                                        name="checkcircle"
                                        size={24}
                                        color="#fff"
                                    />
                                </Button>
                                <Text style={styles.name} numberOfLines={1}>
                                    {names.cosmetologyLicense}
                                </Text>
                            </View>
                            <View style={styles.section}>
                                <Label
                                    style={{
                                        ...stylesCtm.title,
                                        ...styles.title
                                    }}
                                >
                                    Driver License
                                </Label>
                                <View
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row'
                                    }}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Label style={stylesCtm.title}>
                                            Front
                                        </Label>
                                        <Button
                                            light
                                            onPress={() =>
                                                showActionSheet(
                                                    'driverLicenseFront'
                                                )
                                            }
                                            style={{
                                                ...stylesCtm.inlineBtn,
                                                ...styles.uploadBtn,
                                                backgroundColor: docs.driverLicenseFront
                                                    ? '#36ad5a'
                                                    : '#fff'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    ...stylesCtm.buttonText,
                                                    color: docs.driverLicenseFront
                                                        ? '#fff'
                                                        : '#666'
                                                }}
                                            >
                                                {verified ||
                                                docs.driverLicenseFront
                                                    ? 'Update'
                                                    : 'Upload'}
                                            </Text>
                                            <AntDesign
                                                style={{
                                                    display: docs.driverLicenseFront
                                                        ? 'flex'
                                                        : 'none'
                                                }}
                                                name="checkcircle"
                                                size={24}
                                                color="#fff"
                                            />
                                        </Button>
                                        <Text
                                            style={styles.name}
                                            numberOfLines={1}
                                        >
                                            {names.driverLicenseFront}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Label style={stylesCtm.title}>
                                            Back
                                        </Label>

                                        <Button
                                            light
                                            onPress={() =>
                                                showActionSheet(
                                                    'driverLicenseBack'
                                                )
                                            }
                                            style={{
                                                ...stylesCtm.inlineBtn,
                                                ...styles.uploadBtn,
                                                backgroundColor: docs.driverLicenseBack
                                                    ? '#36ad5a'
                                                    : '#fff'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    ...stylesCtm.buttonText,
                                                    color: docs.driverLicenseBack
                                                        ? '#fff'
                                                        : '#666'
                                                }}
                                            >
                                                {verified ||
                                                docs.driverLicenseBack
                                                    ? 'Update'
                                                    : 'Upload'}
                                            </Text>
                                            <AntDesign
                                                style={{
                                                    display: docs.driverLicenseBack
                                                        ? 'flex'
                                                        : 'none'
                                                }}
                                                name="checkcircle"
                                                size={24}
                                                color="#fff"
                                            />
                                        </Button>
                                        <Text
                                            style={styles.name}
                                            numberOfLines={1}
                                        >
                                            {names.driverLicenseBack}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.checkbox}>
                                <Checkbox
                                    status={checked ? 'checked' : 'unchecked'}
                                    color="#f85f6a"
                                    onPress={handleChecked}
                                />
                                <Text
                                    style={{
                                        paddingHorizontal: 25,
                                        lineHeight: 20
                                    }}
                                >
                                    By proceeding, I agree and give my consent
                                    to eBeauty to do any kind of background
                                    check on my profile.
                                </Text>
                            </View>
                            <View style={stylesCtm.errMsg}>
                            <Text
                                style={{
                                    color: '#f85f6a',
                                    fontWeight: 'bold',

                                }}
                            >
                                {err}
                            </Text>
                        </View>
                            <Button
                                primary
                                block
                                onPress={e => onSubmit(e)}
                                style={{
                                    ...stylesCtm.primaryBtn,
                                    ...styles.localBtn
                                }}
                                disabled={loading ? true : false}

                                // onPress={onSubmit}
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#fff"
                                    />
                                ) : (
                                    <Text style={stylesCtm.buttonText}>
                                        Submit
                                    </Text>
                                )}
                            </Button>
                        </Form>
                    </View>
                </ScrollView>
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    title: {
        paddingBottom: 0
    },
    img: {
        margin: 10,
        height: 100,
        width: 100
    },
    name: {
        marginHorizontal: 10,
        marginBottom: 10
    },
    uploadBtn: {
        display: 'flex',
        marginHorizontal: 10,
        marginBottom: 20
    },
    localBtn: {
        marginTop: 20,
        marginBottom: 50,
        marginHorizontal: 20
    },
    afterUploadBtn: {
        backgroundColor: '#0dc143',
        color: '#fff'
    },
    section: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10
    },
    checkbox: {
        display: 'flex',
        paddingHorizontal: 10,
        // maxWidth: '100%',
        flexDirection: 'row',
        paddingVertical: 30,
        alignItems: 'center',
        justifyContent: 'flex-start'
    }
});
