import React, { useEffect, useState } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Alert,
	Image,
	PermissionsAndroid
} from 'react-native';
import {
	Container,
	Header,
	Left,
	Body,
	Title,
	Right,
	Icon,
	Button
} from 'native-base';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import stylesCtm from '../../styles';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';
let { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function location({ navigation, route }) {
	const [position, setPosition] = useState({
		customer: {
			latitude: route.params.location[0],
			longitude: route.params.location[1],
		},
		beautician: {
			latitude: 0,
			longitude: 0,
		}
	});

	const [err, setErr] = useState('Please wait...');
	const [flag, setFlag] = useState(0);
	const [address, setAddress] = useState('');

	async function locPerm() {
		console.log('in locperm');
		const { status } = await Location.requestPermissionsAsync();
		// console.log(status)

		if (status !== 'granted') {
			console.log('not granted');
			Alert.alert(
				'Permission needed',
				'E-beauty needs your device location in order to see the location',
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
				console.log('loc.coords', loc.coords)

				await setPosition({
					...position,
					beautician: {
						latitude: loc.coords.latitude,
						longitude: loc.coords.longitude,
					}
				})

				Geocoder.from(position.customer.latitude, position.customer.longitude)
					.then(json => {
						// console.log(json);
						const address = json.results[0].formatted_address;
						setAddress(address);
						
					})
					.catch(err => {
						console.log(err);
					});

				setFlag(1);
			} catch (e) {
				console.log(e);
				setErr(
					'We could not fetch your location, make sure you have location services enabled on your device and try again.'
				);
			}
		}
	}

	useFocusEffect(
		React.useCallback(() => {
			locPerm();
			console.log('route.paarams', route.params);
			return () => {
				console.log('return from tracking');
			};
		}, [])
	);

	return flag ? (
		<React.Fragment>
			<View style={styles.container}>
				<MapView
					style={stylesCtm.mapContainer}
					provider={PROVIDER_GOOGLE}
					showsUserLocation={false}
					zoomEnabled={true}
					showsMyLocationButton
					initialRegion={{...position.customer, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA}}
					loadingEnabled={true}
					toolbarEnabled={true}
				>
					<Marker
						coordinate={position.beautician}
						title='Your Location'
						// description="hg"
					>
						<Image source={require('../../../assets/app/pin.png')} resizeMode="center" style={stylesCtm.mapMarkerPin} />
					</Marker>

					<Marker
						coordinate={position.customer}
						title='Customer'
					>
						<Image source={require('../../../assets/app/pin.png')} resizeMode="center" style={stylesCtm.mapMarkerPin} />
					</Marker>

					<MapViewDirections
						origin={position.beautician}
						destination={position.customer}
						// origin="26.9124,75.7873"
						// destination="28.7041,77.1025"
						apikey={'AIzaSyBov-hgk72VmzPEXpUtzZHvvzFwf7rqhco'}
						strokeWidth={3}
						strokeColor="#000"
						resetOnChange= {true}
					/>
				</MapView>
				
			</View>
			<View style={stylesCtm.mapsTopPanel}>
				<Button transparent onPress={() => navigation.goBack()}>
					<Icon
						name="arrow-back"
						style={{ fontSize: 24, color: '#000' }}
					/>
				</Button>

				<Text style={stylesCtm.mapsTopPanelText}>
					Customer location
				</Text>
			</View>
			<View style={stylesCtm.mapsBottomPanel}>
			<Text style={{marginBottom: 10}}>Customer address</Text>
				<Text
					style={styles.address}
					numberOfLines={1}
					ellipsizeMode="tail"
				>
					{address}
				</Text>

				<Button
					dark
					block
					onPress={() => navigation.goBack()}
					style={styles.localBtn}
				>
					<Text style={stylesCtm.buttonText}>Back</Text>
				</Button>
			</View>
		</React.Fragment>
	) : (
		<View style={styles.err}>
			<MaterialIcons
				name="location-off"
				size={200}
				color="#607d8b44"
				style={{ paddingBottom: 30 }}
			/>
			<Text style={styles.errBox}>{err}</Text>
			<Button
				dark
				block
				style={{ marginHorizontal: 40, marginVertical: 40 }}
				onPress={() => navigation.goBack()}
			>
				<Text style={stylesCtm.buttonText}>Back</Text>
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: height,
		alignItems: 'center',
		justifyContent: 'center'
	},
	address: {
		fontSize: 15,
		backgroundColor: '#ddd',
		borderRadius: 5,
		padding: 5,
		paddingVertical: 20,
		borderWidth: 0
	},
	err: {
		flex: 1,
		alignItems: 'center',
		padding: 20
	},
	errBox: {
		backgroundColor: '#607d8b11',
		color: '#607d8b',
		paddingHorizontal: 10,
		paddingVertical: 20,
		textAlign: 'center'
	},
	permDenied: {
		flex: 1
	},

	localBtn: {
		marginTop: 10
	}
});
