import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const RounedButton = ({action}) => {
  return (
    <View style={styles.outerContainer}>
      <Pressable style={styles.container} onPress={action}>
        <Ionicons name="arrow-forward-outline" size={32} color="white" />
      </Pressable>
    </View>
  );
};

export default RounedButton;

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#d946ef',
    shadowColor: '#d946ef',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    shadowColor: '#fff',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d946ef',
    marginBottom: responsiveHeight(1),
  },
});
