import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Animated,
  Pressable,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Toast from 'react-native-toast-message';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import {setUserData} from '../../redux/userSlice';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useLocation from '../../hooks/useLocation';
import {useNavigation} from '@react-navigation/native';
import {sendOtp, verifyOtp} from '../../services/authService';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    label: 'Explore and Connect Locally',
    value: `Discover what's happening around you, connect with locals, and share moments in real time.`,
    icon: 'compass-outline',
  },
  {
    label: 'Personalize Your Discovery',
    value: `Choose your radius to explore posts, reels, and thoughts from nearby people, tailored to your location.`,
    icon: 'location-outline',
  },
  {
    label: 'Make New Friends and Share Your World',
    value: `Meet new people, plan meetups, and share your experiences through time-limited posts and updates.`,
    icon: 'people-outline',
  },
];

const UserInfo = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const slidingValue = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [heading, setHeading] = useState(0);
  const [subHeading, setSubHeading] = useState(0);
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

  // Rotating Onboarding Text
  useEffect(() => {
    const interval = setInterval(() => {
      setHeading(prev => (prev + 1) % ONBOARDING_DATA.length);
      setSubHeading(prev => (prev + 1) % ONBOARDING_DATA.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleStep = () => {
    if (
      !nameError &&
      !emailError &&
      !passwordError &&
      name &&
      email &&
      password
    ) {
      dispatch(
        setUserData({
          fullName: name,
          email,
          password,
        }),
      );
      navigation.navigate('ProfileImage');
    }
  };

  const handleEmail = val => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    setEmail(val);
    setEmailError(val.length < 1 || !emailRegex.test(val));
  };

  const handlePassword = val => {
    setPassword(val);
    setPasswordError(val.length < 6);
  };

  const handleName = val => {
    setName(val);
    setNameError(val.length < 2);
  };
  const handleOtp = val => {
    if (val.length < 7) {
      setOtp(val);
    }
  };

  const handleSendOtp = async () => {
    try {
      await sendOtp({email});

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'OTP sent to your email.',
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response.data.message,
      });
    }
  };
  const handleVerifyOtp = async () => {
    try {
      await verifyOtp({email, otp});
      setOtpVerified(true);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'OTP verified successfully',
      });
    } catch (error) {
      console.error(error.response.data);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response.data.message,
      });
    }
  };

  return (
    <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Animated Onboarding Header */}
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
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
          <View style={styles.iconContainer}>
            <Ionicons
              name={ONBOARDING_DATA[heading].icon}
              size={40}
              color="#008FFF"
            />
          </View>
          <Text style={styles.headerTitle}>
            {ONBOARDING_DATA[heading].label}
          </Text>
          <Text style={styles.headerSubtitle}>
            {ONBOARDING_DATA[subHeading].value}
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
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#008FFF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.inputField}
                onChangeText={handleName}
                value={name}
                placeholder="Enter your full name"
                placeholderTextColor="#aaa"
              />
            </View>
            {nameError && (
              <Text style={styles.errorText}>
                {name.length < 1
                  ? 'Name cannot be empty'
                  : 'Name should be at least 2 characters long'}
              </Text>
            )}
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <View style={styles.emailAndOtpLabels}>
              <Text style={styles.inputLabel}>Email</Text>
              {!otpVerified && !emailError && email.length > 0 && (
                <TouchableOpacity onPress={() => handleSendOtp()}>
                  <Text
                    style={[
                      styles.inputLabel,
                      {
                        color: 'green',
                        fontFamily: 'Poppins-Medium',
                      },
                    ]}>
                    Send OTP
                  </Text>
                </TouchableOpacity>
              )}
              {otpVerified && (
                <Text
                  style={[
                    styles.inputLabel,
                    {
                      color: 'green',
                      fontFamily: 'Poppins-Medium',
                    },
                  ]}>
                  Verifed!
                </Text>
              )}
            </View>

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
                editable={!otpVerified}
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
          {!otpVerified && !emailError && email.length > 0 && (
            <View style={styles.inputGroup}>
              <View style={styles.emailAndOtpLabels}>
                <Text style={styles.inputLabel}>OTP</Text>
                <TouchableOpacity onPress={() => handleSendOtp()}>
                  <Text style={styles.inputLabel}>Resend</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#008FFF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.inputField}
                  onChangeText={handleOtp}
                  value={otp}
                  placeholder="Enter otp"
                  placeholderTextColor="#aaa"
                />
                <TouchableOpacity
                  onPress={() => {
                    handleVerifyOtp();
                  }}>
                  <Text
                    style={[
                      styles.inputLabel,
                      {
                        fontFamily: 'Poppins-Medium',
                        marginHorizontal: responsiveWidth(2),
                      },
                    ]}>
                    Verify otp
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

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
            {passwordError && (
              <Text style={styles.errorText}>
                {password.length < 1
                  ? 'Password cannot be empty'
                  : 'Password must be at least 6 characters long'}
              </Text>
            )}
          </View>
        </Animated.View>

        {/* Next Button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [{translateX: slidingValue}],
              opacity: fadeAnim,
            },
          ]}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleStep}
            disabled={!name || !email || !password || !otpVerified}>
            <LinearGradient
              colors={
                name && email && password
                  ? ['#008FFF', '#008FFF']
                  : ['#4A4A4A', '#4A4A4A']
              }
              style={styles.gradientButton}>
              <Text style={styles.gradientButtonText}>Next</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
            <Text style={styles.signUpLinkText}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
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
    height: responsiveHeight(22),
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(106, 17, 203, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.5),
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
    marginBottom: responsiveHeight(3),
  },
  inputGroup: {
    marginBottom: responsiveHeight(1.5),
  },
  inputLabel: {
    fontSize: responsiveFontSize(2),
    //fontWeight: '600',
    fontFamily: 'Poppins-Regular',
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
    fontFamily: 'Poppins-Regular',
  },
  passwordToggle: {
    paddingHorizontal: responsiveWidth(3),
  },
  errorText: {
    fontSize: responsiveFontSize(1.4),
    color: '#FF4B4B',
    marginTop: responsiveHeight(0.5),
    marginLeft: responsiveWidth(1),
    fontFamily: 'Poppins-Regualr',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
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
    justifyContent: 'center',
  },
  signUpText: {
    color: '#aaa',
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Poppins-SemiBold',
  },
  signUpLinkText: {
    color: '#008FFF',
    fontSize: responsiveFontSize(1.6),
    textAlign: 'right',
    fontFamily: 'Poppins-SemiBold',
  },
  emailAndOtpLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width - responsiveWidth(12),
    //marginBottom: responsiveHeight(10),
  },
});

export default UserInfo;
