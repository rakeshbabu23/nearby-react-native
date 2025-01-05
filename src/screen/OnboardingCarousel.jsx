import {
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
  Animated,
  StatusBar,
  Pressable,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import LottieView from 'lottie-react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Geolocation from '@react-native-community/geolocation';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useDispatch} from 'react-redux';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import carouselData from '../../assets/data/Onboarding';
import RoundedButton from '../components/onboarding/RounedButton';
import SubmitButton from '../components/onboarding/SubmitButton';
import GoogleSvg from '../components/svgs/Google';
import {setLocation, setUserDeniedLocation} from '../redux/userSlice';
import useLocation from '../hooks/useLocation';
import {completeAuthentication} from '../services/authService';

// not in use
const OnboardingCarousel = () => {
  const flatListRef = useRef(null);
  const windowWidth = Dimensions.get('window').width;
  const animationRefs = useRef(carouselData.map(() => React.createRef()));
  const [currentIndex, setCurrentIndex] = useState(0);
  //const [locationDenied, setLocationDenied] = useState(false);
  const {location, locationDenied} = useLocation(true);
  const scrollX = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  useEffect(() => {
    animationRefs.current[0].current.play();
  }, []);
  useEffect(() => {
    const id = scrollX.addListener(({value}) => {
      const index = Math.round(value / windowWidth); // Update index based on scroll position
      setCurrentIndex(index);
    });
    return () => {
      scrollX.removeListener(id);
    };
  }, [scrollX]);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '961737810639-3mpeenfs3bgcsuog99r731lj4hvevhb6.apps.googleusercontent.com',
    });
  }, []);
  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );

      console.log('User signed in:', userCredential.user);

      const registerUser = await completeAuthentication({
        firebaseToken: idToken,
        userLocation: location,
      });
      console.log('registerUser', registerUser);
      //dispatch();

      if (locationDenied) {
        dispatch(setUserDeniedLocation(false));
      } else {
        dispatch(setLocation([location.latitude, location.longitude]));
      }
    } catch (error) {
      console.error('Error details:', error);
      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the sign-in.');
      } else if (error?.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-in is already in progress.');
      } else if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services are not available.');
      } else {
        console.error('Unknown error occurred:', error);
      }
    }
  };

  const handleForwardButton = index => {
    setCurrentIndex(curr => curr + 1);
    flatListRef.current.scrollToIndex({
      index: index + 1,
      animated: true,
    });
  };

  const renderSlide = ({item, index}) => {
    const inputRange = [
      (index - 1) * windowWidth,
      index * windowWidth,
      (index + 1) * windowWidth,
    ];
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.slideContainer,
          {width: windowWidth, backgroundColor: item.color, opacity},
        ]}>
        <View style={styles.textContainer}>
          <Text style={styles.heading}>{item.heading}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <View style={styles.animationContainer}>
          <LottieView
            ref={animationRefs.current[index]}
            source={item.slide}
            style={styles.animation}
            autoPlay
            loop
          />
        </View>
      </Animated.View>
    );
  };

  const renderDots = () => {
    if (currentIndex === 4) {
      return null;
    }
    return carouselData.map((_, index) => {
      const inputRange = [
        (index - 1) * windowWidth,
        index * windowWidth,
        (index + 1) * windowWidth,
      ];

      const animatedDotWidth = scrollX.interpolate({
        inputRange,
        outputRange: [10, 20, 10],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View
          key={index}
          style={[styles.dot, {width: animatedDotWidth}]}
        />
      );
    });
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {currentIndex !== 4 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingHorizontal: responsiveWidth(4),
              paddingTop: responsiveHeight(2),
            }}>
            <Pressable
              onPress={() => {
                flatListRef.current.scrollToIndex({
                  index: carouselData.length - 1,
                  animated: true,
                });
              }}
              style={{color: 'black', fontSize: responsiveFontSize(2.2)}}>
              <Text>Skip</Text>
            </Pressable>
          </View>
        )}
        <Animated.FlatList
          ref={flatListRef}
          data={carouselData}
          renderItem={renderSlide}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
          bounces={false}
          scrollEventThrottle={16}
        />
        <View style={styles.dotContainer}>{renderDots()}</View>
        {currentIndex !== 4 && (
          <View style={styles.dotContainer}>
            <RoundedButton action={() => handleForwardButton(currentIndex)} />
          </View>
        )}
        {currentIndex === 4 && (
          <View style={styles.submitButtonContainer}>
            <SubmitButton
              Svg={GoogleSvg}
              action={() => {
                googleLogin();
              }}>
              Continue with Google
            </SubmitButton>
            {/* <Pressable onPress={googleLogin}>
              <View style={styles.loginButton}>
                <View style={{marginLeft: 5}}>
                  <Text
                    style={{color: '#222222', fontWeight: '400', fontSize: 18}}>
                    Login with Google
                  </Text>
                </View>
              </View>
            </Pressable> */}
          </View>
        )}
      </View>
    </>
  );
};

export default OnboardingCarousel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
  animationContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  animation: {
    width: '80%',
    height: '80%',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  submitButtonContainer: {
    flex: 0.2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: responsiveHeight(8),
  },
});
