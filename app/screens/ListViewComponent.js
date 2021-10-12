import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import Colours from '../config/colours.js';
import gui from '../config/gui.js';

const ListViewComponent = (props) => {
	const [listings] = useState(props.listing);
	const [watchedListings] = useState(props.watched);
	const [noResults] = useState(props.results);

	return (
		<ScrollView keyboardShouldPersistTaps="handled" style={styles.scroll}>
			{watchedListings.map((item, i) => {
				return (
					<ListItem
						style={styles.list}
						key={i}
						bottomDivider
						onPress={() =>
							navigation.navigate('ListingDetailScreen', {
								listingId: item.key,
							})
						}
					>
						<ListItem.Content>
							<ListItem.Title>Liked: {item.listingTitle}</ListItem.Title>
							<ListItem.Subtitle>{item.description}</ListItem.Subtitle>
						</ListItem.Content>
					</ListItem>
				);
			})}
			{noResults ? (
				<View>
					<Text style={styles.noListings}>No listings found</Text>
				</View>
			) : (
				listings.map((item, i) => {
					return (
						<ListItem
							style={styles.list}
							key={i}
							bottomDivider
							onPress={() =>
								navigation.navigate('ListingDetailScreen', {
									listingId: item.key,
								})
							}
						>
							<ListItem.Content>
								<ListItem.Title>{item.listingTitle}</ListItem.Title>
								<ListItem.Subtitle>{item.description}</ListItem.Subtitle>
							</ListItem.Content>
						</ListItem>
					);
				})
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colours.white,
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingTop: Platform.OS === 'ios' ? 20 : 0,
	},
	noListings: {
		fontSize: 22,
		padding: '10%',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	filterContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 10,
	},
	scroll: {
		width: '100%',
		height: '73%',
	},
	list: {
		width: gui.screen.width,
	},
});

export default ListViewComponent;