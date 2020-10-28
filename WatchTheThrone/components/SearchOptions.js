import React from 'react';
import {View, Button} from 'react-native';

<View>
  <Input
    style={styles.input}
    blurOnSumbit
    onChangeText={searchInputHandler}
    value={search}
  />
  <Button title="Search" color="yellow" />
</View>;
