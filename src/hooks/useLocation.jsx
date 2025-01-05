import {Platform, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useDispatch} from 'react-redux';
import {setLocation, setUserDeniedLocation} from '../redux/userSlice';
import {getLocation} from '../utils/location';
import Toast from 'react-native-toast-message';

const useLocation = () => {
  const dispatch = useDispatch();
  // const getLocation = () => {
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       console.log('Position:', position);
  //       const {latitude, longitude} = position.coords;
  //       dispatch(setLocation({latitude, longitude}));
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
        dispatch(
          setLocation({location: {latitude, longitude}, locationDeny: false}),
        );
      } else {
        const requestForPermission = await request(permission);
        if (requestForPermission === RESULTS.GRANTED) {
          const {latitude, longitude} = await getLocation();
          dispatch(
            setLocation({location: {latitude, longitude}, locationDeny: false}),
          );
        } else {
          dispatch(setUserDeniedLocation(true));
        }
      }
    } catch (error) {
      console.error('Location Error:', error);
      Alert.alert(
        'Error',
        'Unable to request location permission. Please check your settings.',
      );
    }
  };
  useEffect(() => {
    handleLocationPermission();
  }, []);
  return;
};

export default useLocation;
