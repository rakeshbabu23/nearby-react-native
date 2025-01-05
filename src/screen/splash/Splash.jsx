import {View, Text, StyleSheet, Animated, Easing} from 'react-native';
import React, {useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const Splash = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
      <Animated.View
        style={{opacity: fadeAnim, transform: [{scale: scaleAnim}]}}>
        <Text style={styles.text}>Nearby</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#008FFF',
    fontSize: responsiveFontSize(5),
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 2,
  },
});

export default Splash;
