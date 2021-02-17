import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import BottomNav from '../components/BottomNav.js';

export default function Home({navigation}) {

	return(
		<React.Fragment>
		<ScrollView showsVerticalScrollIndicator={false}>
			<View style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:300}}>
				<Text>Home</Text>
			</View>
		</ScrollView>
		<BottomNav />
		</React.Fragment>
	)
}