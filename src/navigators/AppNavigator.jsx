import React, {useCallback, useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useDispatch, useSelector} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import LocationDenied from '../screen/LocationDenied';
import MainNavigator from '../navigators/main/MainNavigator';
import ChatScreen from '../screen/main/ChatScreen';
import ImagePost from '../screen/main/ImagePost';
import Camera from '../screen/main/Home/Camera';
import ProfileImage from '../screen/auth/ProfileImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import {setLocation, setUserLoggedIn} from '../redux/userSlice';
import TextInfo from '../screen/main/texts/TextInfo';
import ImagePostInfo from '../screen/main/texts/ImagePostInfo';
import VideoPostInfo from '../screen/main/texts/VideoPostInfo';
import Settings from '../screen/main/profile/settings/Settings';
import Signup from '../screen/auth/Signup';
import Login from '../screen/auth/Login';
import Splash from '../screen/splash/Splash';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useFocusEffect} from '@react-navigation/native';
const AppNavigator = () => {
  const Stack = createStackNavigator();
  const userState = useSelector(state => state.user);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      try {
        const value = await AsyncStorage.getItem('userId');
        if (value !== null) {
          const parsedValue = JSON.parse(value);
          setIsLoggedIn(true);
          dispatch(
            setUserLoggedIn({
              isLoggedIn: true,
              userId: parsedValue,
            }),
          );
        } else {
          setIsLoggedIn(false);
          dispatch(setUserLoggedIn({isLoggedIn: false, userId: null}));
        }
      } catch (e) {
        setIsLoggedIn(false);
        dispatch(setUserLoggedIn({isLoggedIn: false, userId: null}));
      } finally {
        setLoading(false);
      }
    };
    setTimeout(() => {
      getUser();
    }, 3000);
  }, []);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const checkLocationPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    const checkPermission = await check(permission);
    if (checkPermission === RESULTS.GRANTED) {
      setLocation({
        location: {
          latitude: null,
          longitude: null,
        },
        locationDeny: false,
      });
    }
  };
  useFocusEffect(
    useCallback(() => {
      checkLocationPermission();
    }, []),
  );

  if (loading) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }
  if (userState.locationDeny) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="LocationDenied"
          component={LocationDenied}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <>
        {!userState.isLoggedIn ? (
          <>
            <Stack.Screen
              name="LogIn"
              component={Login}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SignUp"
              component={Signup}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="ProfileImage"
              component={ProfileImage}
              options={{headerShown: false}}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="MainNavigator"
              component={MainNavigator}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ImagePost"
              component={ImagePost}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Camera"
              component={Camera}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="TextPostInfo"
              component={TextInfo}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ImagePostInfo"
              component={ImagePostInfo}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="VideoPostInfo"
              component={VideoPostInfo}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Settings"
              component={Settings}
              options={{headerShown: false}}
            />
          </>
        )}
      </>
    </Stack.Navigator>
  );
};

export default AppNavigator;
