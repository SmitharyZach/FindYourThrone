import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Card from '../components/Card';
import FlatCard from '../components/FlatCard';
import Emoji from 'react-native-emoji';
import {useFocusEffect} from '@react-navigation/native';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import RadioForm from 'react-native-simple-radio-button';
import {Rating, AirbnbRating} from 'react-native-ratings';

const BathroomDetailsScreen = ({route}) => {
  const poopEmoji = require('../PoopEmoji.png');
  const [bathroom, setBathroom] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [textReviewValue, onChangeReviewText] = useState('');
  const [bathroomStocked, setBathroomStocked] = useState('');
  const [bathroomOutside, setBathroomOutside] = useState('');
  const [bathroomKey, setBathroomKey] = useState('');
  const [averageRating, setAverageRating] = useState();
  const [userRating, setUserRating] = useState(3);
  const {itemName} = route.params;
  const {itemAddress} = route.params;
  const {open} = route.params;
  const {itemId} = route.params;
  const {itemRating} = route.params;
  const bathroomData = {
    google_id: `${itemId}`,
    bathroom_name: `${itemName}`,
  };
  const radio_props = [
    {label: 'Yes', value: true},
    {label: 'No', value: false},
  ];

  useFocusEffect(
    React.useCallback(() => {
      const fetchBathroom = async () => {
        try {
          await fetch(`http://localhost:3000/v1/bathrooms/${itemId}`)
            .then((response) => response.json())
            .then((result) => setBathroom(result));
        } catch (e) {
          console.log('error', e);
        }
      };
      const fetchReviews = async () => {
        try {
          await fetch(`http://localhost:3000/v1/reviews/${itemId}`)
            .then((response) => response.json())
            .then((data) => setReviews(data))
            .then(() => setLoading(false));
        } catch (e) {
          console.log('error', e);
        }
      };
      const fetchAverage = async () => {
        try {
          await fetch(`http://localhost:3000/v1/bathrooms/average/${itemId}`)
            .then((response) => response.json())
            .then((data) => setAverageRating(data));
        } catch (e) {
          console.log('error', e);
        }
      };
      fetchBathroom();
      fetchReviews();
      fetchAverage();
      return;
    }, [itemId]),
  );
  console.log('Findbathrooms', bathroom);
  console.log('find review', reviews);
  console.log('find average', averageRating);
  const sumbitReviewHandler = () => {
    const fetchReviews = async () => {
      try {
        const reviews = await fetch(
          `http://localhost:3000/v1/reviews/${itemId}`,
        )
          .then((resposne) => resposne.json())
          .then((data) => setReviews(data))
          .then(() => setLoading(false));
      } catch (e) {
        console.log('error', e);
      }
    };

    data = {
      bathroom_id: bathroom.bathrooms[0].id,
      rating: userRating,
      review: textReviewValue,
      stocked: bathroomStocked,
      key: bathroomKey,
      outside: bathroomOutside,
      google_id: bathroom.bathrooms[0].google_id,
    };
    if (
      bathroomStocked === '' ||
      bathroomOutside === '' ||
      bathroomKey === '' ||
      textReviewValue === ''
    ) {
      Alert.alert('Please fill out all forms');
    } else {
      fetch(`http://localhost:3000/v1/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:');
        })
        .catch((error) => {
          console.error('Error:');
        });
      fetch(`http://localhost:3000/v1/reviews/${itemId}`)
        .then((resposne) => resposne.json())
        .then((data) => setReviews(data))
        .then(() => setLoading(false));
      setModal(false);
      setBathroomStocked('');
      setBathroomOutside('');
      setBathroomKey('');
      onChangeReviewText('');
    }
  };

  const cancelReviewHandler = () => {
    setModal(false);
    setBathroomStocked('');
    setBathroomOutside('');
    setBathroomKey('');
    onChangeReviewText('');
  };
  return (
    <View style={styles.screen}>
      <Modal transparent={true} visible={modal}>
        <View style={styles.modalBackground}>
          <Card style={styles.modalCard}>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.reviewTitle}>Review Bathroom</Text>
              <View style={styles.modalReviewBox}>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.detailText}>
                    Slide the poop scale to rate bathroom
                  </Text>
                </View>
                <Rating
                  type={'custom'}
                  ratingImage={poopEmoji}
                  ratingColor="gold"
                  ratingBackgroundColor="#f6edd8"
                  ratingCount={5}
                  imageSize={30}
                  showRating
                  onFinishRating={(rating) => setUserRating(rating)}
                  style={{padding: 10}}
                />
                <View style={{alignItems: 'center', paddingTop: 10}}>
                  <Text style={styles.detailText}>
                    Thoughts about the bathroom:{'\n'}
                  </Text>
                </View>
                <TextInput
                  onChangeText={(text) => onChangeReviewText(text)}
                  value={textReviewValue}
                  multiline={true}
                  maxLength={999}
                  numberOfLines={6}
                  style={styles.reviewTextInput}></TextInput>
                <View style={styles.modalReviewSection}>
                  <Text style={styles.detailText}>
                    Was the bathroom properly stocked?
                  </Text>
                  <RadioForm
                    formHorizontal={true}
                    labelHorizontal={true}
                    radio_props={radio_props}
                    initial={-1}
                    onPress={(value) => {
                      setBathroomStocked(value);
                    }}
                    buttonColor={'gold'}
                    selectedButtonColor={'gold'}
                    style={styles.radioButton}
                  />
                </View>
                <View style={styles.modalReviewSection}>
                  <Text style={styles.detailText}>
                    Was the bathroom outside?
                  </Text>
                  <RadioForm
                    formHorizontal={true}
                    labelHorizontal={true}
                    radio_props={radio_props}
                    initial={-1}
                    onPress={(value) => {
                      setBathroomOutside(value);
                    }}
                    buttonColor={'gold'}
                    selectedButtonColor={'gold'}
                    style={styles.radioButton}
                  />
                </View>
                <View style={styles.modalReviewSection}>
                  <Text style={styles.detailText}>Was a key required?</Text>
                  <RadioForm
                    formHorizontal={true}
                    labelHorizontal={true}
                    radio_props={radio_props}
                    initial={-1}
                    onPress={(value) => {
                      setBathroomKey(value);
                    }}
                    buttonColor={'gold'}
                    selectedButtonColor={'gold'}
                    style={styles.radioButton}
                  />
                </View>
              </View>
            </View>
            <View style={styles.addCancelReviewRow}>
              <TouchableOpacity
                style={styles.addReviewButton}
                onPress={cancelReviewHandler}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addReviewButton}
                onPress={sumbitReviewHandler}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </Modal>
      <Card style={styles.detailsTitleCard}>
        <Text style={styles.gasStationTitle}>Throne Rating</Text>
        <FlatCard style={styles.bodyCard}>
          <View style={styles.rating}>
            <Text>
              <Emoji name="hankey" style={{fontSize: 30}} />
              <Emoji name="hankey" style={{fontSize: 30}} />
              <Emoji name="hankey" style={{fontSize: 30}} />
              <Emoji name="hankey" style={{fontSize: 30}} />
              <Emoji name="hankey" style={{fontSize: 30}} />
            </Text>
          </View>
          <View style={styles.ratingExplanation}>
            <Text style={styles.detailText}>
              out of 5<Emoji name="hankey" />{' '}
            </Text>
          </View>
          <View style={styles.addressBox}>
            <Text style={styles.detailText}>Address </Text>
            <Text>{JSON.parse(JSON.stringify(itemAddress))}</Text>
          </View>
        </FlatCard>
      </Card>
      <Card style={styles.reviewTitleCard}>
        <View style={styles.reviewTopLine}>
          <Text style={styles.gasStationTitle}>Reviews</Text>
          <TouchableOpacity
            style={styles.addReviewButton}
            onPress={() => setModal(true)}>
            <Text style={styles.buttonText}> + Add</Text>
          </TouchableOpacity>
        </View>

        <View>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              style={{height: 350}}
              extraData={reviews.bathroom_reviews}
              data={reviews.bathroom_reviews}
              keyExtractor={({id}, index) => id}
              renderItem={({item}) => (
                <TouchableWithoutFeedback>
                  <View style={styles.listItem}>
                    <Text style={styles.detailText}>Review:</Text>
                    <Text>
                      {item.review}
                      {'\n'}
                    </Text>
                    <View style={styles.reviewRow}>
                      <Text style={styles.detailText}>Stocked? </Text>
                      <Text>
                        {item.stocked === true ? (
                          <Text>Yes</Text>
                        ) : (
                          <Text>No</Text>
                        )}
                      </Text>
                    </View>
                    <View style={styles.reviewRow}>
                      <Text style={styles.detailText}>Outside Bathroom? </Text>
                      <Text>
                        {item.outside === true ? (
                          <Text>Yes</Text>
                        ) : (
                          <Text>No</Text>
                        )}
                      </Text>
                    </View>
                    <View style={styles.reviewRow}>
                      <Text style={styles.detailText}>
                        Was a key required?{' '}
                      </Text>
                      <Text>
                        {item.key === true ? <Text>Yes</Text> : <Text>No</Text>}
                      </Text>
                    </View>
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
  screen: {
    flex: 1,
    padding: 10,
  },
  gasStationTitle: {
    color: 'gold',
    fontSize: 25,
    fontWeight: 'bold',
  },
  reviewTitle: {
    color: 'gold',
    fontSize: 25,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'gold',
    fontSize: 22,
    fontWeight: 'bold',
  },
  detailsTitleCard: {
    backgroundColor: '#9B30FF',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewTitleCard: {
    backgroundColor: '#9B30FF',
    marginTop: 10,
  },
  bodyCard: {
    backgroundColor: '#d1b2e0',
    margin: 10,
    width: '95%',
    padding: 10,
  },
  rating: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  ratingExplanation: {
    paddingTop: 0,
    alignItems: 'center',
    paddingBottom: 10,
  },
  ratingText: {
    fontSize: 30,
    color: '#9B30FF',
    fontWeight: 'bold',
    padding: 5,
  },
  detailText: {
    fontWeight: 'bold',
  },
  listItem: {
    paddingTop: 15,
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginVertical: 15,
    backgroundColor: '#C485FF',
    borderColor: 'gold',
    borderWidth: 2,
    shadowRadius: 6,
    borderRadius: 10,
  },
  modalReviewBox: {
    paddingTop: 15,
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginVertical: 15,
    backgroundColor: '#C485FF',
    borderColor: 'gold',
    borderWidth: 2,
    shadowRadius: 6,
    borderRadius: 10,
    width: '95%',
  },
  reviewRow: {
    flex: 1,
    flexDirection: 'row',
  },
  addressBox: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  addReviewButton: {
    borderWidth: 2,
    borderColor: 'gold',
    borderRadius: 10,
    padding: 5,
  },
  reviewTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBackground: {
    backgroundColor: '#000000aa',
    flex: 1,
  },
  modalCard: {
    backgroundColor: '#9B30FF',
    marginVertical: 60,
    marginHorizontal: 25,
    paddingTop: 25,
    flex: 1,
  },
  reviewTextInput: {
    height: 40,
    borderColor: 'gold',
    borderWidth: 1,
    borderRadius: 5,
    height: 70,
  },
  radioButton: {
    paddingTop: 10,
    justifyContent: 'space-evenly',
  },
  modalReviewSection: {
    padding: 10,
  },
  addCancelReviewRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

export default BathroomDetailsScreen;
