import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
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

export default function Default({ navigation }) {

	return(
		<Container style={stylesCtm.container}>
			
				<Grid>
					<Row>
						<Col style={styles.imgContainer}>
							<Image source={require('../../../assets/icon.png')} style={styles.img} />
						</Col>
					</Row>
					<Row>
						<Col size={1} style={styles.margin}>
							<Button
		                        primary
		                        block
		                        style={stylesCtm.button}
		                        onPress={() => navigation.navigate('Login')}
		                    >
		                    	<Text style={stylesCtm.buttonText}>Login</Text>
		                    </Button>
						</Col>
						<Col size={1} style={styles.margin}>
							<Button
		                        primary
		                        block
		                        style={stylesCtm.button}
		                        onPress={() => navigation.navigate('Register')}
		                    >
		                    	<Text style={stylesCtm.buttonText}>Register</Text>
		                    </Button>
						</Col>
					</Row>
				</Grid>
			
		</Container>
	)
}

const styles = StyleSheet.create({

	imgContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	img: {
		height: 300,
		width: 300
	},
	margin: {
		marginHorizontal: 10
	}
})