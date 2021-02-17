import React, { useState } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ScrollView
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import {
	Header,
	Form,
	Item,
	Input,
	Left,
	Right,
	Label,
	Button,
	Icon,
	Body,
	Title
} from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import stylesCtm from '../../styles/index.js';
import { serviceMap } from '../../methods/authMethods.js';
import serviceMapping from './serviceMapping.json';

export default function Services({ navigation }) {
	const [err, setErr] = useState('');
	const [checked, setChecked] = useState({
		haircare: true,
		waxing: true,
		nails: true,
		threading: true,
		facial: true,
		makeup: true,
		mehendi: true
	});
	const [loading, setLoading] = useState(false);

	const handleChecked = name => {
		setChecked({
			...checked,
			[name]: !checked[name]
		});
	};

	const handleChange = (text, name) => {
		setCred({ ...cred, [name]: name === 'name' ? text : text.trim() });
	};

	const onSubmit = async () => {
		let count = 0;
		Object.keys(checked).forEach(e => {
			if (checked[e]) {
				count = 1;
			}
		});

		if (!count) {
			setErr('No services selected');
			return;
		}

		let data=[];

		for(let ser in checked) {
			
			if(checked[ser]) {

				data = [...data, ...serviceMapping[ser]]
			}
		}
		console.log(data);

		// function failure() {
		// 	setErr('Invalid details');
		// 	setCred({
		// 		...cred,
		// 		password: '',
		// 		repeatPassword: ''
		// 	});
		// }

		function success() {
			setErr('');
			navigation.navigate('Documents');
		}

		// serviceMap(data, success, failure);
	};

	return (
		<React.Fragment>
			<Header>
                <Left>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" style={{ fontSize: 24 }} />
                    </Button>
                </Left>
                <Body>
                    <Title>Profile</Title>
                </Body>
                <Right />
            </Header>
				<ScrollView showsVerticalScrollIndicator={false}>
					<Form>
						<Text style={stylesCtm.heading}>
							Choose the services you provide
						</Text>

						<View style={styles.checkbox}>
							<Checkbox
								status={
									checked.haircare ? 'checked' : 'unchecked'
								}
								color="#f85f6a"
								onPress={() => handleChecked('haircare')}
							/>
							<Text style={styles.checkboxTxt}>
								Provide hair care and hair cut service
							</Text>
						</View>
						<View style={styles.checkbox}>
							<Checkbox
								status={
									checked.waxing ? 'checked' : 'unchecked'
								}
								color="#f85f6a"
								onPress={() => handleChecked('waxing')}
							/>
							<Text style={styles.checkboxTxt}>
								Provide all kinds of waxing service
							</Text>
						</View>
						<View style={styles.checkbox}>
							<Checkbox
								status={checked.nails ? 'checked' : 'unchecked'}
								color="#f85f6a"
								onPress={() => handleChecked('nails')}
							/>
							<Text style={styles.checkboxTxt}>
								Provide manicure and pedicure service
							</Text>
						</View>
						<View style={styles.checkbox}>
							<Checkbox
								status={
									checked.threading ? 'checked' : 'unchecked'
								}
								color="#f85f6a"
								onPress={() => handleChecked('threading')}
							/>
							<Text style={styles.checkboxTxt}>
								Provide all kinds of threading service
							</Text>
						</View>
						<View style={styles.checkbox}>
							<Checkbox
								status={
									checked.facial ? 'checked' : 'unchecked'
								}
								color="#f85f6a"
								onPress={() => handleChecked('facial')}
							/>
							<Text style={styles.checkboxTxt}>
								Provide facial service
							</Text>
						</View>
						<View style={styles.checkbox}>
							<Checkbox
								status={
									checked.makeup ? 'checked' : 'unchecked'
								}
								color="#f85f6a"
								onPress={() => handleChecked('makeup')}
							/>
							<Text style={styles.checkboxTxt}>
								Provide makeup service for special occasions
							</Text>
						</View>
						<View style={styles.checkbox}>
							<Checkbox
								status={
									checked.mehendi ? 'checked' : 'unchecked'
								}
								color="#f85f6a"
								onPress={() => handleChecked('mehendi')}
							/>
							<Text style={styles.checkboxTxt}>
								Provide mehendi hand decoration service
							</Text>
						</View>

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
						</View>
						<Button
							primary
							block
							style={{...styles.button, ...stylesCtm.primaryBtn}}
							onPress={onSubmit}
						>
							{loading ? (
								<ActivityIndicator size="small" color="#fff" />
							) : (
								<Text style={stylesCtm.buttonText}>
									Confirm
								</Text>
							)}
						</Button>
					</Form>
				</ScrollView>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	button: {
		marginVertical: 30,
		marginHorizontal: 40,
	},
	checkbox: {
		display: 'flex',
		marginHorizontal: 20,
		flexDirection: 'row',
		paddingVertical: 10,
		alignItems: 'center'
	},
	checkboxTxt: {
		paddingLeft: 15,
		lineHeight: 20
	}
});
