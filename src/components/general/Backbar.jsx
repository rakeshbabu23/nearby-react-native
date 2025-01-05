import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const Backbar = () => {
  const navigation = useNavigation();

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        navigation.goBack();
      }}>
      <Ionicons name="arrow-back-outline" size={24} color="#fff"></Ionicons>
    </Pressable>
  );
};

export default Backbar;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: responsiveWidth(2),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(1),
  },
});
