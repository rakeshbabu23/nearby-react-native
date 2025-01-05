import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {responsiveHeight} from 'react-native-responsive-dimensions';

const EmptyList = ({message}) => {
  return (
    <View style={{paddingVertical: responsiveHeight(1.5)}}>
      <Text
        style={{
          textAlign: 'center',
          color: '#fff',
          marginTop: responsiveHeight(1.5),
          fontFamily: 'Poppins-Regular',
          fontSize: responsiveHeight(1.8),
        }}>
        {message || 'No posts here yet! Check back soon.'}
      </Text>
    </View>
  );
};

export default EmptyList;
