import React, { useEffect, useState } from 'react';

import Colours from '../config/colours.js';
import Gui from '../config/gui.js';

import {
	View,
	StyleSheet,
	Image,
	StatusBar,
	ActivityIndicator,
} from 'react-native';

import firebase from 'firebase/app';
import 'firebase';

function Splash({ navigation }) {
	var unsubscribe = firebase.auth().onAuthStateChanged(user =>
	{
		var navigationTarget = 'Entry';
		if (user)
		{
			navigationTarget = 'UserType';
			if (user.displayName.substring(1, 2) == '|')
			{
				navigationTarget = 'Nav';				
			}
			else if (!user.emailVerified)
			{
				navigationTarget = 'VerifyEmail';
			}
		}
		
		var id = setInterval(() => 
		{
			console.log(Date.now())
			navigation.navigate(navigationTarget)
			clearInterval(id);
		}, 1000);
		unsubscribe()
	})	

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor={Colours.white} barStyle='dark-content'/>			
			<Image style={styles.logo} source={require('../assets/logo.png')}/>
			<ActivityIndicator size="large" color={Colours.activityIndicator} style={styles.loading}/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Gui.container.backgroundColor,
		alignItems: 'center',
	},
	logo: {
		resizeMode: 'contain',
		top: Gui.screen.height * 0.18,
		width: Gui.screen.width * 0.6,
		height: Gui.screen.height * 0.3,
	},
	loading: {
		marginTop: Gui.screen.height * 0.3,
	},
});

export default Splash;
