import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Card from '../components/Card';
import Geolocation from '@react-native-community/geolocation';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const MapSearchScreen = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setlongitude] = useState(0);

  const searchInputHandler = (enteredText) => {
    setSearch(enteredText);
  };

  var lat;
  var long;

  Geolocation.getCurrentPosition((position) => {
    setLatitude(position.coords.latitude);
    setlongitude(position.coords.longitude);
  });

  useEffect(() => {
    const apiKey = '&key=AIzaSyAqkW-25QouoODMct5p1gp5VuT69LPIKQw';
    const url =
      'https://maps.googleapis.com/maps/api/place/textsearch/json?query=bathroom&';
    const latlong = `location=${latitude},${longitude}&radius=1500`;
    const type = '&type=gas_station';

    fetch(url + latlong + type + apiKey)
      .then((response) => response.json())
      .then((json) => setData(json.results))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  console.log(data);

  const startSearchHandler = () => {
    console.log(search);
    const apiKey = '&key=AIzaSyAqkW-25QouoODMct5p1gp5VuT69LPIKQw';
    const url =
      'https://maps.googleapis.com/maps/api/place/textsearch/json?query=bathroom&';
    const latlong = `location=${latitude},${longitude}`;
    const type = '&type=gas_station';
    console.log(url + latlong + type + apiKey);

    fetch(url + latlong + type + apiKey)
      .then((response) => response.json())
      .then((json) => setData(json.results))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  return (
    <View style={styles.wrapper}>
      <Card style={styles.card}>
        <View style={styles.searchHeader}>
          <Text style={styles.headerText}>Bathrooms Nearby</Text>
        </View>
        <View styles={styles.row}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              style={{height: 500}}
              data={data}
              keyExtractor={({place_id}, index) => place_id}
              renderItem={({item}) => (
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate('Details', {
                      itemName: item.name,
                      itemAddress: item.formatted_address,
                      open: item.opening_hours.open_now,
                      itemId: item.place_id,
                      itemRating: item.rating,
                    })
                  }>
                  <View style={styles.listItem}>
                    <Text>
                      {item.name} Bathroom
                      {'\n'}
                      {item.formatted_address}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
          )}
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    marginTop: 50,
  },
  card: {
    height: 600,
    maxWidth: '95%',
    margin: 20,
    backgroundColor: '#9B30FF',
  },
  listItem: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#C485FF',
    borderColor: 'gold',
    borderWidth: 2,
    shadowRadius: 6,
    borderRadius: 10,
  },
  input: {
    flexDirection: 'column',
    width: 200,
    color: 'gold',
  },
  searchHeader: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  headerText: {
    color: 'gold',
    fontSize: 25,
    fontWeight: 'bold',
  },
  wrapper: {
    paddingTop: 100,
  },
});

export default MapSearchScreen;
