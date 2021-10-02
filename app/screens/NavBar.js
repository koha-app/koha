import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Colours from '../config/colours.js';

import MapViewScreen from './MapViewScreen';
import ListViewScreen from './ListViewScreen';
import Notification from './Notification.js';
import Profile from './Profile.js';
import GiveKoha from './GiveKoha.js';

const Tab = createBottomTabNavigator();

function NavBar({ navigation }) {
	React.useEffect(
		() =>
			navigation.addListener('beforeRemove', (e) => {
				e.preventDefault();
			}),
		[navigation]
	);
	return (
		<Tab.Navigator
			initialRouteName="Map View"
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: Colours.default,
				tabBarInactiveTintColor: Colours.grey,
				tabBarStyle: {
					position: 'absolute',
					backgroundColor: Colours.koha_beige,
					padding: 10,
				},
			}}
		>
			<Tab.Screen
				name="Map View"
				component={MapViewScreen}
				options={{
					tabBarLabel: 'Map View',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="map-search-outline"
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="List View"
				component={ListViewScreen}
				options={{
					tabBarLabel: 'List View',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="view-list-outline"
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Give Koha"
				component={GiveKoha}
				options={{
					tabBarLabel: 'Give Koha',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="plus-circle-outline"
							size={24}
							color={color}
						/>
					),
				}}
			/>

			<Tab.Screen
				name="Notification"
				component={Notification}
				options={{
					tabBarLabel: 'Notification',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="bell-outline"
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={Profile}
				options={{
					tabBarLabel: 'Profile',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="account-circle-outline"
							size={24}
							color={color}
						/>
					),
				}}
			/>
		</Tab.Navigator>
	);
}

export default NavBar;
