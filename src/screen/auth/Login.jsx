import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {setUserDeniedLocation, setUserLoggedIn} from '../../redux/userSlice';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useLocation from '../../hooks/useLocation';
import BeautifulLoader from '../../components/general/Loader';
import {getLocation} from '../../utils/location';
import {userLogin} from '../../services/authService';
import Toast from 'react-native-toast-message';
const {width: SCREEN_WIDTH} = Dimensions.get('window');

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const slidingValue = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const {location} = useSelector(state => state.user);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState({state: false, message: null});

  useLocation();

  // Sliding and Fade Animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(slidingValue, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleEmail = val => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    setEmail(val);
    setEmailError(val.length < 1 || !emailRegex.test(val));
  };

  const handlePassword = val => {
    setPassword(val);
  };
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
          dispatch(setUserDeniedLocation());
        }
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to request location permission. Please check your settings.',
      );
    }
  };

  const handleLogin = async () => {
    if (!emailError && email && password) {
      const handleUserRegistration = async () => {
        try {
          let coordinates = [
            Number(location.longitude),
            Number(location.latitude),
          ];
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
          setIsLoading({
            state: true,
            message: 'Please wait...',
          });
          const registerUser = await userLogin({
            email,
            password,
            location: JSON.stringify(coordinates),
          });

          const cookieString = Array.isArray(registerUser.headers['set-cookie'])
            ? registerUser.headers['set-cookie'].join(', ')
            : registerUser.headers['set-cookie'];

          if (!cookieString) {
            console.error('No cookie string found.');
            return;
          }

          // Clean up the cookie string
          const actualCookieString = cookieString
            .replace(/^\[|\]$/g, '')
            .trim();

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
                  console.error(
                    `Error setting cookie: ${name}=${value}`,
                    error,
                  );
                  throw error;
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
            text2: error?.response?.data?.message || 'unknown error',
          });
        } finally {
          setIsLoading({
            state: false,
            message: null,
          });
        }
      };
      handleUserRegistration();
    }
  };

  return (
    <>
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View
            style={[
              styles.headerContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}>
            <Text style={styles.headerTitle}>Welcome Back</Text>
            <Text style={styles.headerSubtitle}>
              Log in to continue your local discovery journey
            </Text>
          </Animated.View>

          {/* Input Fields */}
          <Animated.View
            style={[
              styles.inputContainer,
              {
                transform: [{translateX: slidingValue}],
                opacity: fadeAnim,
              },
            ]}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#008FFF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.inputField}
                  onChangeText={handleEmail}
                  value={email}
                  placeholder="Enter your email"
                  placeholderTextColor="#aaa"
                  keyboardType="email-address"
                />
              </View>
              {emailError && (
                <Text style={styles.errorText}>
                  {email.length < 1
                    ? 'Email cannot be empty'
                    : 'Invalid email format'}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#008FFF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.inputField}
                  onChangeText={handlePassword}
                  value={password}
                  placeholder="Enter your password"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#008FFF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            {/* <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity> */}
          </Animated.View>

          {/* Login Button */}
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                transform: [{translateX: slidingValue}],
                opacity: fadeAnim,
              },
            ]}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={!email || !password}>
              <LinearGradient
                colors={
                  email && password
                    ? ['#008FFF', '#008FFF']
                    : ['#4A4A4A', '#4A4A4A']
                }
                style={styles.gradientButton}>
                <Text style={styles.gradientButtonText}>Log In</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signUpLinkText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAwareScrollView>
      </LinearGradient>
      {isLoading.state && (
        <BeautifulLoader visible={isLoading} message={isLoading.message} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: responsiveHeight(4),
    paddingHorizontal: responsiveWidth(5),
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: responsiveHeight(4),
    height: responsiveHeight(15),
  },
  headerTitle: {
    fontSize: responsiveFontSize(3),
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: responsiveHeight(1),
  },
  headerSubtitle: {
    fontSize: responsiveFontSize(1.8),
    color: '#aaa',
    textAlign: 'center',
    paddingHorizontal: responsiveWidth(5),
  },
  inputContainer: {
    marginBottom: responsiveHeight(2),
  },
  inputGroup: {
    marginBottom: responsiveHeight(2.5),
  },
  inputLabel: {
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    color: '#fff',
    marginBottom: responsiveHeight(1),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#008FFF',
  },
  inputIcon: {
    paddingHorizontal: responsiveWidth(3),
  },
  inputField: {
    flex: 1,
    height: responsiveHeight(6),
    fontSize: responsiveFontSize(1.8),
    color: '#fff',
    paddingRight: responsiveWidth(3),
  },
  passwordToggle: {
    paddingHorizontal: responsiveWidth(3),
  },
  errorText: {
    fontSize: responsiveFontSize(1.4),
    color: '#FF4B4B',
    marginTop: responsiveHeight(0.5),
    marginLeft: responsiveWidth(1),
    fontFamily: 'Poppins-Regular',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: responsiveHeight(2),
  },
  forgotPasswordText: {
    color: '#008FFF',
    fontSize: responsiveFontSize(1.6),
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    width: responsiveWidth(40),
    height: responsiveHeight(6),
    borderRadius: 30,
    overflow: 'hidden',
    //elevation: 5,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientButtonText: {
    fontSize: responsiveFontSize(2.2),
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: responsiveHeight(2),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#4A4A4A',
  },
  dividerText: {
    color: '#aaa',
    marginHorizontal: responsiveWidth(2),
    fontSize: responsiveFontSize(1.6),
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: responsiveHeight(2),
  },
  signUpText: {
    color: '#aaa',
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Poppins-SemiBold',
  },
  signUpLinkText: {
    color: '#008FFF',
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Poppins-SemiBold',
  },
});

export default LoginScreen;
