import React, { useState, useEffect, useRef, useFocusEffect } from 'react';
import { Camera } from 'expo-camera';
import {
	StyleSheet,
	Dimensions,
	View,
	Text,
	TouchableOpacity,
	Image,
	BackHandler,
	ActivityIndicator
} from 'react-native';
import { Button } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import stylesCtm from '../styles';
const { width, height } = Dimensions.get('window');

export default function CameraScreen(props) {
	const { camera, setCamera, docs, uploadDocs } = props;
	const ref = useRef();
	const [loading, setLoading] = useState(false);
	const [hasPermission, setHasPermission] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.back);
	const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
	const [photo, setPhoto] = useState(null);

	const back = () => {
		setCamera({ ...camera, status: false });
		return true;
	};

	// useFocusEffect(
	//     React.useCallback(() => {
	//         BackHandler.addEventListener('hardwareBackPress', back);

	//         return () => {
	//             BackHandler.removeEventListener('hardwareBackPress', back);
	//         };
	//     }, [])
	// );

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', back);
		(async () => {
			const { status } = await Camera.requestPermissionsAsync();
			setHasPermission(status === 'granted');
		})();

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', back);
		};
	}, []);

	const handleCameraType = () => {
		setType(type =>
			type === Camera.Constants.Type.back
				? Camera.Constants.Type.front
				: Camera.Constants.Type.back
		);
	};

	const handleFlash = () => {
		setFlash(flash =>
			flash === Camera.Constants.FlashMode.off
				? Camera.Constants.FlashMode.on
				: Camera.Constants.FlashMode.off
		);
	};

	const takePicture = async () => {
		// setLoading(prevState => !prevState)
		console.log('in takepic');
		if (ref) {
			setLoading(true);
			let photo = await ref.current?.takePictureAsync({
				quality: 0.8,
				skipProcessing: false
			});
			setLoading(false);
			setPhoto(photo);
			console.log(photo);
		}
	};

	const rejectPhoto = () => {
		setPhoto(null);
	};

	const acceptPhoto = () => {
		console.log('from b4 acceptphoto - ', docs);
		uploadDocs({ ...docs, [camera.file]: photo.uri });
		setCamera({ ...camera, status: false });
	};

	if (hasPermission === null) {
		return <View />;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}
	return (
		<View style={styles.container}>
			{photo && (
				<React.Fragment>
					<Image
						source={photo}
						style={{ flex: 1, maxWidth: '100%' }}
					/>
					<View style={stylesCtm.cameraBottomPanel}>
						<Button
							dark
							block
							onPress={rejectPhoto}
							style={styles.localBtn}
						>
							<Text style={stylesCtm.buttonText}>Try again</Text>
						</Button>
						<Button
							dark
							block
							onPress={acceptPhoto}
							style={styles.localBtn}
						>
							<Text style={stylesCtm.buttonText}>Upload</Text>
						</Button>
					</View>
				</React.Fragment>
			)}

			{!photo && (
				<Camera
					style={styles.camera}
					type={type}
					ratio={'1:1'}
					ref={ref}
					flashMode={flash}
				>
					{loading && (
						<View style={styles.blackScreen}>
							<ActivityIndicator size="small" color="#fff" />
						</View>
					)}
					<View
						style={{
							flex: 1,
							flexDirection: 'row',
							justifyContent: 'space-between',
							margin: 20
						}}
					>
						<TouchableOpacity
							style={{
								alignSelf: 'flex-end',
								alignItems: 'center',
								backgroundColor: 'transparent'
							}}
							onPress={handleFlash}
						>
							<Ionicons
								name={flash === Camera.Constants.FlashMode.off ? "ios-flash-off" : "ios-flash"}
								style={{ color: '#fff', fontSize: 40 }}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								alignSelf: 'flex-end',
								alignItems: 'center',
								backgroundColor: 'transparent'
							}}
							onPress={takePicture}
						>
							<Ionicons
								name="ios-camera"
								style={{ color: '#fff', fontSize: 80 }}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								alignSelf: 'flex-end',
								alignItems: 'center',
								backgroundColor: 'transparent'
							}}
						>
							<Ionicons
								name="ios-reverse-camera"
								style={{ color: '#fff', fontSize: 40 }}
								onPress={handleCameraType}
							/>
						</TouchableOpacity>
					</View>
				</Camera>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: height,
		zIndex: 10
	},
	camera: {
		flex: 1
	},
	localBtn: {
		paddingHorizontal: 25
	},
	blackScreen: {
		position: 'absolute',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		height: '100%',
		width: '100%',
		backgroundColor: '#00000099'
	}
});
