import React from 'react';
import {View, StyleSheet} from 'react-native';

const FlatCard = (props) => {
  return <View style={{...styles.card, ...props.style}}>{props.children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
  },
});

export default FlatCard;
