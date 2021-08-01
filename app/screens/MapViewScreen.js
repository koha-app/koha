import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

// generic notif view
function NotifScreen() {
  return (
    <View style={styles.container}>
      <Text>{global.e}</Text>
    </View>
  );
}

function MapViewScreen() {
    // states and modifiers
    const [mapRegion, setRegion] = useState(null)
    const [hasLocationPermissions, setLocationPermission] = useState(false)

    // do after render
    useEffect(() => {
        const getLocationAsync = async () => {

            // check permissions
            let { status } = await Location.requestForegroundPermissionsAsync();
            if ('granted' === status) {
                setLocationPermission(true);

                // get location
                let { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({})

                // initial region set (happens once per app load)
                setRegion({ latitude, longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
            }
        }
        // wait for permissions
        if (hasLocationPermissions === false) {
            getLocationAsync()
        }
    })

    if (hasLocationPermissions === false) {
        global.e = "Error: Please Enable Location Permissions";
        return (<NotifScreen />);
    }
    
    if (mapRegion === null) {
        global.e = "Loading Local Area";
        return (<NotifScreen />);
    }

    return (
        <MapView
            style={styles.container}
            region={mapRegion}
        >
        </MapView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
})

export default MapViewScreen;