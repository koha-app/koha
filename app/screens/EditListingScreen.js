import React, { Component, useEffect, useState, useRef } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Button,
	ActivityIndicator,
	ScrollView,
	TouchableOpacity,
	TextInput,
	Platform,
	StatusBar,
	Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ListItem } from 'react-native-elements';
import Colours from '../config/colours.js';
import Gui from '../config/gui.js';
import firebase from 'firebase/app';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import API from '../config/api.js';


function ListingDetailScreen({ route, navigation }) {
	const [web, setWeb] = useState(Platform.OS === 'web');
	const [listingId, setListingId] = useState(route.params.listingId);
	const [loading, setLoading] = useState(true);
	const [listing, setListing] = useState(null);
	const [type, setType] = useState("");

	const [showDate, setShowDate] = useState(false);
	const [openCategoryType, setOpenCategoryType] = useState(false);
	const [openAllergenType, setOpenAllergenType] = useState(false);
	const [openCollectionType, setOpenCollectionType] = useState(false);
	const [openConditionType, setOpenConditionType] = useState(false);

	const [modalDelete, setModalDeleteVisible] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalText, setModalText] = useState(false);
	const [modalRedirect, setModalRedirect] = useState(false);

	// All listings
	const [listingTitle, setListingTitle] = useState(null);
	const [description, setDescription] = useState(null);
	const [location, setLocation] = useState({ lat: 0, lng: 0, name: '' });
	const [locationOriginal, setLocationOriginal] = useState(null);
	const [category, setCategory] = useState(null);
	const [quantity, setQuantity] = useState(null);
	const [expiryDate, setExpiryDate] = useState(ConvertDate(Date.now()));
	const [eventDate, setEventDate] = useState(ConvertDate(Date.now()));
	
	// Food
	const [allergen, setAllergen] = useState(null);
	const [collectionMethod, setCollectionMethod] = useState(null);
	const [imageFileName, setimageFileName] = useState(null);

	// Items
	const [condition, setCondition] = useState(null);

	// Events
	const [capacity, setCapacity] = useState(null);

	const [categoryFood, setCategoryFood] = useState([
		{ value: 'fruit', label: 'Fruit' },
		{ value: 'vegetables', label: 'Vegetables' },
		{ value: 'dry_goods', label: 'Dry Goods' },
		{ value: 'cooked', label: 'Cooked Meals' },
		{ value: 'bakery', label: 'Bakery Items' },
		{ value: 'dairy', label: 'Dairy' },
		{ value: 'misc', label: 'Miscellaneous' },
	]);

	const [categoryAllergen, setCategoryAllergen] = useState([
		{ value: 'gluten', label: 'Gluten' },
		{ value: 'peanuts', label: 'Peanuts' },
		{ value: 'seafood', label: 'Seafood' },
		{ value: 'dairy', label: 'Dairy' },
		{ value: 'eggs', label: 'Eggs' },
	]);
	
	const [collectionItems, setCollectionItems] = useState([
		{ value: 'pick_up', label: 'Pick Up' },
		{ value: 'delivery', label: 'Delivery' },
	]);

	const [categoryItems, setCategoryItems] = useState([
		{ value: 'baby', label: 'Baby Items' },
		{ value: 'household', label: 'Household Essentials' },
		{ value: 'toiletries', label: 'Toiletries' },
		{ value: 'school', label: 'School Items' },
		{ value: 'clothing', label: 'Clothing' },
		{ value: 'misc', label: 'Miscellaneous' },
	]);

	const [categoryCondition, setCategoryCondition] = useState([
		{ value: 'new', label: 'New' },
		{ value: 'used', label: 'Used' },
	]);

	const [categoryService, setCategoryService] = useState([
		{ value: 'community', label: 'Community Service' },
		{ value: 'other', label: 'Other' },
	]);

	function categoryOpened(val) {
		setOpenCategoryType(val);
		setOpenAllergenType(false);
		setOpenCollectionType(false);
		setOpenConditionType(false);
		setOpenCollectionType(false);
	}
	function allergenOpened(val) {
		setOpenCategoryType(false);
		setOpenAllergenType(val);
		setOpenCollectionType(false);
		setOpenConditionType(false);
		setOpenCollectionType(false);
	}
	function collectionOpened(val) {
		setOpenCategoryType(false);
		setOpenAllergenType(false);
		setOpenCollectionType(val);
		setOpenConditionType(false);
	}
	function conditionOpened(val) {
		setOpenCategoryType(false);
		setOpenAllergenType(false);
		setOpenCollectionType(false);
		setOpenConditionType(val);
	}

	function ConvertDate(seconds) {
		if (seconds == null) {
			seconds = Date.now();
		}
		var local = new Date(seconds);
		var date = new Date(local.getTime());
		return (
			(date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
			'/' +
			(date.getMonth() + 1 < 10
				? '0' + (date.getMonth() + 1)
				: date.getMonth() + 1) +
			'/' +
			date.getFullYear()
		);
	}

	function deleteListing() {
		const db = firebase.firestore();

		// Sets the delete field and then notifies the user
		db.collection("listings").doc(listingId).update(
		{
			deleted: true,
			public: false,
		})
		.then(() => {			
			setModalText("The listing has been deleted.");
			setModalVisible(true);
			setModalRedirect(true);
		})
		.catch((error) => {
			console.error(error);
			setModalText(error.message);
			setModalVisible(true);
		});
	}

	function updateListing() {
		const db = firebase.firestore();

		switch (type)
		{
			case "food":
			{
				switch (true) {
					case listingTitle === '':
						setModalText("Please enter a title for your listing");
						setModalVisible(true);
						return false;
		
					case description === '':
						setModalText("Please enter a description for your listing");
						setModalVisible(true);
						return false;
		
					case location['lat'] == 0 || location['lng'] == 0:
						setModalText("Please enter a location for your listing");
						setModalVisible(true);
						return false;
		
					case quantity == null || quantity <= 0:
						setModalText("Please enter a quantity for your listing");
						setModalVisible(true);
						return false;
		
					case expiryDate == null:
						setModalText("Please enter an expiry date for your listing");
						setModalVisible(true);
						return false;
		
					case !collectionMethod in ['pick_up', 'delivery']:
						setModalText("Please enter a collection method for your listing");
						setModalVisible(true);
						return false;
				}

				db.collection("listings").doc(listingId).set(
				{
					listingTitle: listingTitle,
					description: description,
					location: location,
					allergen: allergen,
					quantity: quantity,
					expiryDate: expiryDate,
					collectionMethod: collectionMethod,
					edited: true,
				},{merge:true})
				.then(() => {
					setModalText("The listing has been updated.");
					setModalVisible(true);
					setModalRedirect(true);
				})
				.catch((error) => {
					console.error(error);
					setModalText(error.message);
					setModalVisible(true);
				});
				break;
			};
			case "essentialItem":
			{
				switch (true) {
					case listingTitle === '':
						setModalText("Please enter a title for your listing");
						setModalVisible(true);
						return false;
		
					case description === '':
						setModalText("Please enter a description for your listing");
						setModalVisible(true);
						return false;
		
					case location['lat'] == 0 || location['lng'] == 0:
						setModalText("Please enter a location for your listing");
						setModalVisible(true);
						return false;
		
					case quantity == null || quantity <= 0:
						setModalText("Please enter a quantity for your listing");
						setModalVisible(true);
						return false;
					
					case !category in ['baby', 'household', 'toiletries', 'school', 'clothing', 'misc']:
						setModalText("Please enter a category for your listing");
						setModalVisible(true);
						return false;

					case !condition in ['new', 'used']:
						setModalText("Please enter an item condition for your listing");
						setModalVisible(true);
						return false;

					case !collectionMethod in ['pick_up', 'delivery']:
						setModalText("Please enter a collection method for your listing");
						setModalVisible(true);
						return false;
				}

				db.collection("listings").doc(listingId).set(
				{
					listingTitle: listingTitle,
					description: description,
					location: location,
					condition: condition,
					quantity: quantity,
					expiryDate: expiryDate,
					collectionMethod: collectionMethod,
					edited: true,
				},{merge:true})
				.then(() => {
					setModalText("The listing has been updated.");
					setModalVisible(true);
					setModalRedirect(true);
				})
				.catch((error) => {
					console.error(error);
					setModalText(error.message);
					setModalVisible(true);
				});
				break;
			};
			case "event":
			{
				switch (true) {
					case listingTitle === '':
						setModalText("Please enter a title for your event");
						setModalVisible(true);
						return false;
		
					case description === '':
						setModalText("Please enter a description for your event");
						setModalVisible(true);
						return false;
		
					case location['lat'] == 0 || location['lng'] == 0:
						setModalText("Please enter a location for your event");
						setModalVisible(true);
						return false;
		
					case capacity == null || capacity <= 0:
						setModalText("Please enter a capacity for your event");
						setModalVisible(true);
						return false;
					
					case eventDate == null:
						setModalText("Please enter a date for your event");
						setModalVisible(true);
						return false;
				}

				db.collection("listings").doc(listingId).set(
				{
					listingTitle: listingTitle,
					description: description,
					location: location,
					capacity: capacity,
					eventDate: eventDate,
					edited: true,
				},{merge:true})
				.then(() => {
					setModalText("The event has been updated.");
					setModalVisible(true);
					setModalRedirect(true);
				})
				.catch((error) => {
					console.error(error);
					setModalText(error.message);
					setModalVisible(true);
				});
				break;
			};
			case "service":
			{
				switch (true) {
					case listingTitle === '':
						setModalText("Please enter a title for your service listing");
						setModalVisible(true);
						return false;
		
					case description === '':
						setModalText("Please enter a description for your service listing");
						setModalVisible(true);
						return false;
		
					case location['lat'] == 0 || location['lng'] == 0:
						setModalText("Please enter a location for your service listing");
						setModalVisible(true);
						return false;
		
					case !category in ['community','other']:
						setModalText("Please enter a capacity for your service listing");
						setModalVisible(true);
						return false;
					
					case eventDate == null:
						setModalText("Please enter a date for your service listing");
						setModalVisible(true);
						return false;
				}

				db.collection("listings").doc(listingId).set(
				{
					listingTitle: listingTitle,
					description: description,
					location: location,
					eventDate: eventDate,
					category: category,
					edited: true,
				},{merge:true})
				.then(() => {
					setModalText("The service listing has been updated.");
					setModalVisible(true);
					setModalRedirect(true);
				})
				.catch((error) => {
					console.error(error);
					setModalText(error.message);
					setModalVisible(true);
				});
				break;
			};
		};
	}

	function setDate(date) {
		setShowDate(false);
		setExpiryDate(date);
		setEventDate(date);
	}

	useEffect(() => {
		setLoading(true);
		console.log(listingId)
		const subscriber = firebase
			.firestore()
			.collection('listings')
			.where(firebase.firestore.FieldPath.documentId(), '==', listingId)
			.onSnapshot((querySnapshot) => {
				querySnapshot.forEach((documentSnapshot) =>{
					setListing(documentSnapshot.data());
					setType(documentSnapshot.data()["listingType"]);
					setListingTitle(documentSnapshot.data()["listingTitle"]);
					setDescription(documentSnapshot.data()["description"]);
					setLocation(documentSnapshot.data()["location"]);
					setLocationOriginal({
						description: documentSnapshot.data()["location"]["name"],
						geometry: { location: { lat: documentSnapshot.data()["location"]["lat"], lng: documentSnapshot.data()["location"]["lng"] } },
					});
					setCategory(documentSnapshot.data()["category"]);
					setAllergen(documentSnapshot.data()["allergen"]);
					setQuantity(documentSnapshot.data()["quantity"]);
					setCollectionMethod(documentSnapshot.data()["collectionMethod"]);
					setCondition(documentSnapshot.data()["condition"]);
					setCapacity(documentSnapshot.data()["capacity"]);
				});
				setLoading(false);
			});

		// Unsubscribe from events when no longer in use
		return () => subscriber();
	}, [listingId]);

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor={Colours.white} barStyle='dark-content'/>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalDelete}
				onRequestClose={() => {setModalDeleteVisible(false)}}>
				<View style={styles.modalCenter}>
					<View style={[styles.modalView, styles.modalViewDelete]}>
						<View style={styles.modalViewText}>
							<Text style={styles.modalText}>Are you sure you want to delete this listing?<br/>You can't undo this action.</Text>
						</View>
						<View style={styles.rowFlex}>
							<TouchableOpacity
								style={[styles.modalButton, styles.modalDeleteButton]}
								onPress={() => {deleteListing(); setModalDeleteVisible(false)}}>
								<Text style={styles.modalButtonText}>DELETE</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.modalButton, styles.modalCancelButton]}
								onPress={() => {setModalDeleteVisible(false)}}>
								<Text style={styles.modalButtonCancelText}>CANCEL</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {setModalVisible(false)}}>
				<View style={styles.modalCenter}>
					<View style={styles.modalView}>
						<View style={styles.modalViewText}>
							<Text style={styles.modalText}>{modalText}</Text>
						</View>
						<TouchableOpacity
							style={[styles.modalButton]}
							onPress={() => {setModalVisible(false); if (modalRedirect) {setModalRedirect(false); navigation.goBack();}}}>
							<Text style={styles.modalButtonText}>OK</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
			<ScrollView>			
				{loading && <ActivityIndicator size="large" color={Colours.activityIndicator}/>}
				{!loading &&
				(
					<View>
						<View style={styles.buttons}>
						<TouchableOpacity
								style={[styles.button, styles.cancelButton]}
								onPress={() => {navigation.goBack()}}>
								<Text style={[styles.buttonText, styles.cancelText]}>CANCEL</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.button, styles.saveButton]}
								onPress={() => {updateListing();}}>
								<Text style={styles.buttonText}>SAVE</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.button, styles.deleteButton]}
								onPress={() => {setModalDeleteVisible(true)}}>
								<Text style={[styles.buttonText, styles.deleteText]}>DELETE</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.contentView}>
							<Text style={styles.inputTitle}>Listing Title</Text>
							<TextInput
								onChangeText={(val) => setListingTitle(val)}
								value={listingTitle}
								placeholder="Title"
								style={styles.inputText}
							/>
							<Text style={styles.inputTitle}>Listing Description</Text>
							<TextInput
								onChangeText={(val) => setDescription(val)}
								value={description}
								placeholder="Description"
								style={styles.inputText}
							/>
							<Text style={styles.inputTitle}>Location</Text>
							<GooglePlacesAutocomplete
								placeholder="Search..."
								onFail={(error) => console.error(error)}
								fetchDetails={true}
								value={location["name"]}
								predefinedPlaces={[locationOriginal]}
								onFail={(data, details) => console.error(data, details)}
								onNotFound={(data, details) => console.error(data, details)}
								onPress={(data, details) =>
									setLocation({
										lat: details['geometry']['location']['lat'],
										lng: details['geometry']['location']['lng'],
										name: data['description'],
									})
								}
								query={{
									key: API.google_map,
									language: 'en',
									components: 'country:nz',
								}}
								requestUrl={{
									useOnPlatform: 'web',
									url: 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api', // or any proxy server that hits https://maps.googleapis.com/maps/api
								}}
								styles={{
									textInputContainer: styles.textInputContainer,
									textInput: styles.textInput,
									listView: styles.listView,
									//separator: styles.separator,
									//poweredContainer: styles.poweredContainer,
									//description: styles.description,
									//row: styles.row,
									//powered: styles.powered,
								}}
								zIndex={8000}
								debounce={200}
							/>
							{
								type != "essentialItem"
								&&
								(
									<Text style={styles.inputTitle}>{type == "food"? "Expiry Date": "Date"}</Text>
								)
							}
							{type !== "essentialItem" && web && (
								<DatePicker
									selected={new Date(Date.now())}
									onChange={(val) => setDate(ConvertDate(val))}
									minDate={Date.now()}
									dateFormat="dd/MM/yyyy"
									zIndex={9000}
									customInput={
										<TouchableOpacity
											style={styles.date}
											onPress={() => setShowDate(true)}
										>
											<Text style={styles.dateText}>{expiryDate}</Text>
										</TouchableOpacity>
									}
								/>
							)}
							{type !== "essentialItem" && !web && (
								<TouchableOpacity
									style={styles.date}
									onPress={() => setShowDate(true)}
								>
									<Text style={styles.dateText}>{expiryDate}</Text>
								</TouchableOpacity>
							)}
							{type !== "essentialItem" && !web && showDate && (
								<DateTimePicker
									mode="date"
									dateFormat="day month year"
									minimumDate={Date.now()}
									value={new Date(Date.now())}
									onChange={(val) =>
										setDate(ConvertDate(val['nativeEvent']['timestamp']))
									}
								/>
							)}
							{
								type === "food"
								&&
								(
									<View>
										<Text style={styles.inputTitle}>Category</Text>
										<DropDownPicker
											open={openCategoryType}
											items={categoryFood}
											value={category}
											setOpen={(val) => categoryOpened(val)}
											setValue={(val) => setCategory(val)}
											showArrowIcon={!web}
											showTickIcon={false}
											zIndex={5000}
											placeholder="Select..."
											placeholderStyle={styles.dropDownPlaceholderText}
											dropDownContainerStyle={styles.dropDownBody}
											textStyle={styles.dropDownText}
											style={styles.inputText}
										/>
										<Text style={styles.inputTitle}>Allergen</Text>
										<DropDownPicker
											open={openAllergenType}
											items={categoryAllergen}
											value={allergen}
											setOpen={(val) => allergenOpened(val)}
											setValue={(val) => setAllergen(val)}
											showArrowIcon={!web}
											showTickIcon={false}
											zIndex={3000}
											placeholder="Select..."
											placeholderStyle={styles.dropDownPlaceholderText}
											dropDownContainerStyle={styles.dropDownBody}
											textStyle={styles.dropDownText}
											style={styles.inputText}
										/>
										<Text style={styles.inputTitle}>Quantity</Text>
										<TextInput
											value={quantity}
											onChangeText={(val) => setQuantity(val.replace(/\D/, ''))}
											placeholder="Quantity"
											keyboardType="numeric"
											style={styles.inputText}
										/>
										<Text style={styles.inputTitle}>Collection Method</Text>
										<DropDownPicker
											open={openCollectionType}
											items={collectionItems}
											value={collectionMethod}
											setOpen={(val) => collectionOpened(val)}
											setValue={(val) => setCollectionMethod(val)}
											showArrowIcon={!web}
											showTickIcon={false}
											zIndex={1000}
											placeholder="Select..."
											placeholderStyle={styles.dropDownPlaceholderText}
											dropDownContainerStyle={styles.dropDownBody}
											textStyle={styles.dropDownText}
											style={styles.inputText}
										/>										
									</View>
								)
							}
							{
								type === "essentialItem"
								&&
								(
									<View>
										<Text style={styles.inputTitle}>Category</Text>
										<DropDownPicker
											open={openCategoryType}
											items={categoryItems}
											value={category}
											setOpen={(val) => categoryOpened(val)}
											setValue={(val) => setCategory(val)}
											showArrowIcon={!web}
											showTickIcon={false}
											zIndex={5000}
											placeholder="Select..."
											placeholderStyle={styles.dropDownPlaceholderText}
											dropDownContainerStyle={styles.dropDownBody}
											textStyle={styles.dropDownText}
											style={styles.inputText}
										/>
										<Text style={styles.inputTitle}>Condition</Text>
										<DropDownPicker
											open={openConditionType}
											items={categoryCondition}
											value={condition}
											setOpen={(val) => conditionOpened(val)}
											setValue={(val) => setCondition(val)}
											showArrowIcon={!web}
											showTickIcon={false}
											zIndex={3000}
											placeholder="Select..."
											placeholderStyle={styles.dropDownPlaceholderText}
											dropDownContainerStyle={styles.dropDownBody}
											textStyle={styles.dropDownText}
											style={styles.inputText}
										/>
										<Text style={styles.inputTitle}>Quantity</Text>
										<TextInput
											value={quantity}
											onChangeText={(val) => setQuantity(val.replace(/\D/, ''))}
											placeholder="Quantity"
											keyboardType="numeric"
											style={styles.inputText}
										/>
										<Text style={styles.inputTitle}>Collection Method</Text>
										<DropDownPicker
											open={openCollectionType}
											items={collectionItems}
											value={collectionMethod}
											setOpen={(val) => collectionOpened(val)}
											setValue={(val) => setCollectionMethod(val)}
											showArrowIcon={!web}
											showTickIcon={false}
											zIndex={1000}
											placeholder="Select..."
											placeholderStyle={styles.dropDownPlaceholderText}
											dropDownContainerStyle={styles.dropDownBody}
											textStyle={styles.dropDownText}
											style={styles.inputText}
										/>										
									</View>
								)
							}
							{
								type === "event"
								&&
								(
									<View>
										<Text style={styles.inputTitle}>Event Capacity</Text>
										<TextInput
											value={capacity}
											onChangeText={(val) => setCapacity(val.replace(/\D/, ''))}
											placeholder="Number of people"
											keyboardType="numeric"
											style={styles.inputText}
										/>									
									</View>
								)
							}
							{
								type === "service"
								&&
								(
									<View>
										<Text style={styles.inputTitle}>Category</Text>
										<DropDownPicker
											open={openCategoryType}
											items={categoryService}
											value={category}
											setOpen={(val) => categoryOpened(val)}
											setValue={(val) => setCategory(val)}
											showArrowIcon={!web}
											showTickIcon={false}
											zIndex={5000}
											placeholder="Select..."
											placeholderStyle={styles.dropDownPlaceholderText}
											dropDownContainerStyle={styles.dropDownBody}
											textStyle={styles.dropDownText}
											style={styles.inputText}
										/>
									</View>
								)
							}
						</View>
					</View>
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colours.white,
	},
	contentView: {	
		marginLeft: Gui.screen.width * 0.2,
		width: Gui.screen.width * 0.6,
	},
	inputTitle: {
		textAlign: 'left',
		textAlignVertical: 'top',
		marginTop: Gui.screen.height * 0.025,
		fontSize: Gui.screen.height * 0.025,
		height: Gui.screen.height * 0.03,
		width: Gui.screen.width * 0.6,
		color: Colours.default,
	},
	inputText: {
		textAlign: 'left',
		textAlignVertical: 'center',
		marginTop: Gui.screen.height * 0.005,
		fontSize: Gui.screen.height * 0.03,
		height: Gui.screen.height * 0.05,
		width: Gui.screen.width * 0.6,
		color: Colours.default,
		borderRadius: 3,
		borderWidth: 1,
		borderColor: Colours.default,
	},
	rowFlex: {
		flexDirection: 'row',
	},
	buttons: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width * 1,
		height: Gui.screen.height * 0.04,
		backgroundColor: Colours.white,
		marginTop: Gui.screen.height * 0.02,
		marginBottom: Gui.screen.height * 0.02,
	},
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width * 0.1,
		height: Gui.screen.height * 0.04,
		borderRadius: 5,
		borderWidth: 3,
		borderColor: Colours.koha_navy,
	},
	cancelButton: {
		marginRight: Gui.screen.width * 0.05,
		borderColor: Colours.koha_green,
	},
	saveButton: {
		width: Gui.screen.width * 0.1,
	},
	deleteButton: {
		marginLeft: Gui.screen.width * 0.05,
		borderColor: Colours.koha_peach,
	},
	buttonText: {
		textAlign: 'center',
		fontSize: Gui.button.fontSize,
		color: Colours.koha_navy,
		fontWeight: 'bold',
	},
	deleteText: {
		color: Colours.koha_peach,
	},
	cancelText: {
		color: Colours.koha_green,
	},
	textInputContainer: {
		height: Gui.screen.height * 0.055,
		width: Gui.screen.width * 0.6,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: Colours.default,
	},
	textInput: {
		textAlign: 'left',
		textAlignVertical: 'top',
		fontSize: Gui.screen.height * 0.03,
		height: Gui.screen.height * 0.05,
		color: Colours.default,
	},
	listView: {
		marginTop: 1,
		width: Gui.screen.width * 0.6,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: Colours.default,
	},
	poweredContainer: {
		width: Gui.screen.width * 0.6,
	},
	date: {
		textAlign: 'left',
		textAlignVertical: 'center',
		marginTop: Gui.screen.height * 0.005,
		fontSize: Gui.screen.height * 0.03,
		height: Gui.screen.height * 0.05,
		width: Gui.screen.width * 0.6,
		color: Colours.default,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: Colours.default,
		fontWeight: 'normal',
		padding: 10,
	},
	dateText: {
		marginTop: -Gui.screen.height * 0.0075,
		fontSize: Gui.screen.height * 0.03,
	},
	dropDownText: {
		textAlign: 'left',
		textAlignVertical: 'center',
		fontSize: Gui.screen.height * 0.03,
		backgroundColor: Colours.white,
	},
	dropDownPlaceholderText: {
		textAlign: 'left',
		textAlignVertical: 'center',
		fontSize: Gui.screen.height * 0.03,
		color: Colours.grey,
	},
	dropDownBody: {
		textAlign: 'left',
		textAlignVertical: 'center',
		fontSize: Gui.screen.height * 0.03,
		width: Gui.screen.width * 0.6,
	},
	modalCenter: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalView: {
		backgroundColor: Colours.white,
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width * 0.9,
		height: Gui.screen.height * 0.275,
		borderWidth: 5,
		borderRadius: 5,
		shadowColor: Colours.black,
		shadowOffset:
		{
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.00,
		elevation: 24,
	},
	modalViewDelete: {
		backgroundColor: Colours.koha_pink,
	},
	modalViewText: {
		justifyContent: 'center',
		width: Gui.screen.width * 0.75,
		height: (Gui.screen.height * 0.275) * 0.66,
	},
	modalText: {		
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: (Gui.screen.height * 0.275) * 0.1
	},
	modalButton: {
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width * 0.50,
		height: Gui.button.height,
		borderRadius: Gui.button.borderRadius,
		borderWidth: 2,
		borderColor: Colours.koha_navy,
		backgroundColor: Colours.koha_navy,
	},
	modalButtonText: {
		fontSize: Gui.screen.height * 0.25 * 0.12,
		color: Colours.white,
		fontWeight: 'bold',
	},
	modalDeleteButton: {
		width: Gui.screen.width * 0.2,
		backgroundColor: Colours.koha_peach,
		borderColor: Colours.koha_peach,
		marginRight: Gui.screen.width * 0.05
	},
	modalCancelButton: {
		width: Gui.screen.width * 0.4,
	},
	modalButtonCancelText: {
		fontSize: Gui.screen.height * 0.25 * 0.12,
		color: Colours.white,
		fontWeight: 'bold',
	},
});
export default ListingDetailScreen;