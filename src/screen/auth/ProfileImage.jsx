import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Alert,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import CookieManager from '@react-native-cookies/cookies';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {completeAuthentication} from '../../services/authService';
import Geolocation from '@react-native-community/geolocation';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {setUserLoggedIn} from '../../redux/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
const {width, height} = Dimensions.get('window');
import BeautifulLoader from '../../components/general/Loader';
import {getLocation} from '../../utils/location';
import Toast from 'react-native-toast-message';
const ProfileImage = ({onImageSelect, onSkip}) => {
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.user);
  const [profileImage, setProfileImage] = useState(null);
  const slidingValue = useRef(
    new Animated.Value(Dimensions.get('window').width),
  ).current;
  // const {location, locationDenied} = useLocation(true);
  const [locationDenied, setLocationDenied] = useState(false);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [isLoading, setIsLoading] = useState({state: false, message: null});
  // const getLocation = () => {
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       console.log('Position:', position);
  //       const {latitude, longitude} = position.coords;
  //       setLocation({latitude, longitude});
  //     },
  //     error => {
  //       console.error('Location Error:', error);
  //       Alert.alert('Error', 'Unable to fetch location. Please try again.');
  //     },
  //     {
  //       enableHighAccuracy: false, // Set to true for GPS-based accuracy
  //       timeout: 15000, // Timeout in milliseconds
  //       maximumAge: 10000, // Maximum cached age of location
  //     },
  //   );
  // };
  const handleLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      const checkPermission = await check(permission);
      if (checkPermission === RESULTS.GRANTED) {
        const {latitude, longitude} = await getLocation();
        return {latitude, longitude};
      } else {
        const requestForPermission = await request(permission);
        if (requestForPermission === RESULTS.GRANTED) {
          const {latitude, longitude} = await getLocation();
          return {latitude, longitude};
        } else {
          setLocationDenied(true);
        }
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to request location permission. Please check your settings.',
      );
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response.data.message,
      });
    }
  };

  useEffect(() => {
    handleLocationPermission();
    setTimeout(() => {
      Animated.timing(slidingValue, {
        toValue: Dimensions.get('window').width * 0.0001,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    }, 5000);
  }, []);

  const pickImageFromCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
        compressImageQuality: 0.8,
      });
      setProfileImage(image.path);
      onImageSelect && onImageSelect(image.path);
    } catch (error) {
      if (error.message !== 'User cancelled image selection') {
        Alert.alert('Error', 'Unable to access camera.');
      }
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });
      setProfileImage(image.path);
      onImageSelect && onImageSelect(image.path);
    } catch (error) {
      if (error.message !== 'User cancelled image selection') {
        Alert.alert('Error', 'Unable to access jnkj.');
      }
    }
  };
  const handleUserRegistration = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userInfo.name);
      formData.append('email', userInfo.email);
      formData.append('password', userInfo.password);
      if (profileImage) {
        formData.append('profileImage', {
          uri: `file://${profileImage}`, // Ensure file:// prefix
          name: 'profileImage.jpg', // Specify a name
          type: 'image/jpeg', // Specify the correct MIME type
        });
      }
      let coordinates = [Number(location.longitude), Number(location.latitude)];
      if (!coordinates || coordinates[0] === 0 || coordinates[1] === 0) {
        setIsLoading({
          state: true,
          message: 'Fetching your location...',
        });
        const {latitude, longitude} = await handleLocationPermission();
        coordinates = [Number(longitude), Number(latitude)];
        setIsLoading({
          state: false,
          message: null,
        });
      }

      formData.append('userLocation', JSON.stringify(coordinates));
      setIsLoading({
        state: true,
        message: 'Please wait...',
      });
      const registerUser = await completeAuthentication(formData);

      const cookieString = Array.isArray(registerUser.headers['set-cookie'])
        ? registerUser.headers['set-cookie'].join(', ')
        : registerUser.headers['set-cookie'];

      if (!cookieString) {
        console.error('No cookie string found.');
        return;
      }

      // Clean up the cookie string
      const actualCookieString = cookieString.replace(/^\[|\]$/g, '').trim();

      // Split and process cookies
      const cookies = actualCookieString
        .split(',')
        .map(cookie => {
          try {
            // Trim spaces and parse key-value pairs
            const parts = cookie.trim().split(';');
            const [keyValue, ...attributes] = parts;
            const [key, value] = keyValue.split('=');

            // Ensure key-value is valid
            if (!key || !value) {
              console.warn(`Skipping malformed cookie: ${cookie}`);
              return null;
            }

            // Extract expiry (if present) from attributes
            const expiryAttr = attributes.find(
              attr =>
                attr.trim().toLowerCase().startsWith('max-age') ||
                attr.trim().toLowerCase().startsWith('expires'),
            );
            let maxAge = 0; // Default expiry
            if (expiryAttr) {
              if (expiryAttr.toLowerCase().startsWith('max-age')) {
                maxAge = parseInt(expiryAttr.split('=')[1].trim(), 10);
              } else if (expiryAttr.toLowerCase().startsWith('expires')) {
                maxAge =
                  new Date(expiryAttr.split('=')[1].trim()).getTime() -
                  Date.now();
              }
            }

            return {
              name: key.trim(),
              value: value.trim(),
              maxAge: maxAge > 0 ? maxAge / 1000 : 86400, // Default to 1 day if no expiry found
              attributes: attributes.map(attr => attr.trim()), // Capture additional attributes if needed
            };
          } catch (error) {
            console.error(`Error parsing cookie: ${cookie}`, error);
            return null; // Skip invalid cookies
          }
        })
        .filter(Boolean); // Remove null entries

      // Set cookies using CookieManager
      try {
        await Promise.all(
          cookies.map(async ({name, value, maxAge}) => {
            // Construct the URL for setting cookies
            const fullUrl = `https://3.111.55.237/${name}`;

            try {
              await CookieManager.set(fullUrl, {
                name,
                value,
                domain: '3.111.55.237',
                path: '/',
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                maxAge, // Add maxAge to cookie settings
              });
            } catch (error) {
              console.error(`Error setting cookie: ${name}=${value}`, error);
              throw error; // Maintain rejection for Promise.all
            }
          }),
        );
      } catch (error) {
        console.error('Error setting one or more cookies:', error);
        // Additional global error handling if required
      }

      const storeUser = async value => {
        try {
          await AsyncStorage.setItem('userId', JSON.stringify(value._id));
          await AsyncStorage.setItem(
            'userLocation',
            JSON.stringify(coordinates),
          );
        } catch (error) {
          console.log(error);
        }
      };
      storeUser(registerUser.data.data);

      dispatch(
        setUserLoggedIn({
          isLoggedIn: true,
          userId: registerUser.data.data._id,
        }),
      );
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response.data.message,
      });
    } finally {
      setIsLoading({
        state: false,
        message: null,
      });
    }
  };

  return (
    <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
      {/* Skip Button */}
      <Pressable onPress={handleUserRegistration} style={styles.skipContainer}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Title */}
        <View>
          <Text style={styles.titleText}>Give your profile a face</Text>
          <Text style={styles.subtitleText}>
            Help people know you are not bot by uploading a picture
          </Text>
        </View>

        {/* Profile Image Area */}
        <View style={styles.profileImageWrapper}>
          <Pressable
            style={styles.profileImageContainer}
            onPress={profileImage ? null : pickImageFromCamera}>
            {profileImage ? (
              <Image
                source={{uri: profileImage}}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons
                  name="camera-outline"
                  size={width * 0.2}
                  color="#FFFFFF"
                />
                <Text style={styles.addPhotoText}>Tap to Add Photo</Text>
              </View>
            )}
          </Pressable>
          {profileImage && (
            <Pressable
              style={styles.removeImageButton}
              onPress={() => setProfileImage(null)}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </Pressable>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          {!profileImage ? (
            <>
              <Pressable
                style={styles.actionButton}
                onPress={pickImageFromCamera}>
                <Ionicons name="camera" size={24} color="#008FFF" />
                <Text style={styles.actionButtonText}>Camera</Text>
              </Pressable>

              <Pressable
                style={styles.actionButton}
                onPress={pickImageFromGallery}>
                <Ionicons name="image" size={24} color="#008FFF" />
                <Text style={styles.actionButtonText}>Gallery</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              style={styles.nextButton}
              onPress={handleUserRegistration}>
              <Text style={styles.gradientButtonText}>Let's Go</Text>
            </Pressable>
          )}
        </View>
      </View>
      {isLoading.state && (
        <BeautifulLoader visible={isLoading} message={isLoading.message} />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008FFF',
  },
  skipContainer: {
    position: 'absolute',
    top: height * 0.06,
    right: width * 0.06,
    zIndex: 10,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: width * 0.08,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: width * 0.07,
    marginBottom: height * 0.01,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  subtitleText: {
    color: '#E0E0E0',
    fontSize: width * 0.04,
    marginBottom: height * 0.04,
    textAlign: 'center',
  },
  profileImageWrapper: {
    marginBottom: height * 0.04,
    alignItems: 'center',
    position: 'relative',
  },
  profileImageContainer: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    color: '#FFFFFF',
    marginTop: height * 0.02,
    fontSize: width * 0.04,
  },
  removeImageButton: {
    position: 'absolute',
    top: 0,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
    borderRadius: 10,
    marginHorizontal: width * 0.02,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    color: '#008FFF',
    marginLeft: width * 0.02,
    fontSize: width * 0.04,
    fontFamily: 'Poppins-SemiBold',
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  continueButtonText: {
    color: '#008FFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nextButton: {
    width: width * 0.8,
    height: responsiveHeight(6),
    borderRadius: 30,
    backgroundColor: '#008FFF',
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientButton: {
    flex: 1,
  },
  gradientButtonText: {
    fontSize: responsiveFontSize(2.2),
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
});

export default ProfileImage;
