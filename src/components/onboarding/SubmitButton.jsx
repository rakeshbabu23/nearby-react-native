import React from 'react';
import {Text, TouchableOpacity, Dimensions, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const SocialGradientButton = ({svg, children, action}) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={action}>
      <LinearGradient
        colors={[
          '#DA22FF', // Vibrant pink
          '#9733EE', // Purple
        ]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        estimatedItemSize={10}
        style={styles.buttonContainer}>
        <Ionicons name="logo-google" size={20} color="#fff" />
        <Text style={styles.buttonText}>{children}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default SocialGradientButton;

const styles = StyleSheet.create({
  buttonContainer: {
    height: 56,
    width: Dimensions.get('window').width * 0.9,
    borderRadius: 40,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(16),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '600',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0,
  },
});
