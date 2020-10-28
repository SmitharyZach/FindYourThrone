import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MapSearchScreen from './screens/MapSearchScreen';
import BathroomDetailsScreen from './screens/BathroomDetailsScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Bathrooms">
        <Stack.Screen
          name="Bathrooms"
          component={MapSearchScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Details"
          component={BathroomDetailsScreen}
          listeners={{
            transitionEnd: () => {
              console.log('start transition');
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
