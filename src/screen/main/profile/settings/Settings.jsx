import React, {useCallback, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  Dimensions,
  Alert,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Toast from 'react-native-toast-message';
import {logout, updateUser} from '../../../../services/userService';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setInformation, setLogout} from '../../../../redux/userSlice';
import {Colors} from '../../../../constants/Colors';
import BeautifulLoader from '../../../../components/general/Loader';

const Settings = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const bottomSheetRef = useRef(null);
  const locationInputRef = useRef(null);
  const [location, setLocation] = useState(userData.address);
  const [updatedCordinates, setUpdatedCordinates] = useState({
    lat: userData.location[1],
    long: userData.location[0],
  });
  const [isEdit, setIsEdit] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [profileImage, setProfileImage] = useState(userData.profileImage);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = async query => {
    const API_KEY = 'pk.b947b52cdc557100cbb97527d1289281';
    const url = `https://api.locationiq.com/v1/autocomplete.php?key=${API_KEY}&q=${query}&limit=5&format=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'unknown error',
      });
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      await logout();
      Toast.show({
        type: 'success',
        text1: 'Logged out successful',
      });
      dispatch(setLogout());
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'unknown error',
      });
      Alert.alert('Error', 'Unable to log out.');
      console.error('Error logging out:', error);
    }
  };
  const pickImageFromCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
        compressImageQuality: 0.8,
      });
      bottomSheetRef.current?.close();
      setProfileImage(image.path);
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
      bottomSheetRef.current?.close();
      setProfileImage(image.path);
    } catch (error) {
      if (error.message !== 'User cancelled image selection') {
        Alert.alert('Error', 'Unable to access jnkj.');
      }
    }
  };
  const updateUserData = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      const coordinates = [
        Number(updatedCordinates.long),
        Number(updatedCordinates.lat),
      ];
      formData.append('userLocation', JSON.stringify(coordinates));
      formData.append('address', location);

      if (userData.profileImage !== profileImage) {
        formData.append('file', {
          uri: `file://${profileImage}`,
          name: 'profileImage.jpg',
          type: 'image/jpeg',
        });
      }
      const response = await updateUser(formData);
      const {data} = response.data;
      dispatch(
        setInformation({
          name: data.name,
          email: data.email,
          address: data.address,
          visibility: data.visibility,
          profileImage: data.profileImage,
          location: data.location.coordinates,
        }),
      );
      navigation.goBack();
      Toast.show({
        type: 'success',
        text1: 'Profile updated successfully',
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to update user data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      locationInputRef.current?.blur();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Section */}

      <View style={styles.profileSection}>
        <Pressable style={styles.updateContainer} onPress={updateUserData}>
          <Text style={styles.update}>Update</Text>
        </Pressable>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: profileImage
                ? `${profileImage}?t=${new Date().getTime()}`
                : 'https://pearlss4development.org/wp-content/uploads/2020/05/profile-placeholder.jpg',
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.editProfileIcon}
            onPress={() => bottomSheetRef.current.expand()}>
            <Ionicons name="pencil" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>{userData.name}</Text>
        <Text style={styles.profileEmail}>{userData.email}</Text>
      </View>

      {/* Location Input */}
      <View style={styles.locationContainer}>
        <View style={styles.locationText}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Pressable
            style={styles.sectionTitle}
            onPress={() => {
              if (isEdit) {
                setLocation(userData.address);
                locationInputRef.current?.blur();
                setIsEdit(false);
              } else {
                setLocation('');
                locationInputRef.current?.focus();
                setIsEdit(true);
              }
            }}>
            <Text style={styles.sectionTitle}>
              {isEdit ? 'Cancel' : 'Edit'}
            </Text>
          </Pressable>
        </View>

        <TextInput
          ref={locationInputRef}
          style={styles.input}
          placeholder="Enter your location"
          placeholderTextColor="#999"
          value={location}
          onChangeText={text => {
            setLocation(text);
            fetchSuggestions(text);
          }}
          // editable={isEdit}
        />
        {suggestions.length > 0 && isEdit && (
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => {
                  setLocation(item.display_address);
                  setUpdatedCordinates({
                    lat: item.lat,
                    long: item.lon,
                  });
                  setSuggestions([]);
                }}>
                <Ionicons name="location" size={20} color="#4a4a4a" />
                <Text style={styles.suggestionText}>
                  {item.display_address}
                </Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsContainer}
          />
        )}
      </View>

      {/* Logout Button */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons
          name="log-out"
          size={24}
          color="white"
          style={styles.logoutIcon}
        />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['15%']}
        enablePanDownToClose={true}
        handleComponent={null}
        backgroundStyle={styles.bottomSheetBackground}
        handleComponent={() => (
          <View style={styles.handleContainer}>
            <View style={styles.handleIndicator} />
          </View>
        )}>
        <BottomSheetView style={styles.bottomSheetContainer}>
          <Text style={styles.actionText}>Choose from</Text>
          <View style={styles.actionButtonContainer}>
            <Pressable
              style={styles.actionButton}
              onPress={pickImageFromCamera}>
              <Ionicons name="camera" color="#000" size={30} />
            </Pressable>
            <Pressable
              style={styles.actionButton}
              onPress={pickImageFromGallery}>
              <Ionicons name="image" color="#000" size={30} />
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheet>
      {isLoading && (
        <BeautifulLoader visible={isLoading} message="Please wait..." />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appContainer.bg,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: responsiveHeight(2),
    backgroundColor: Colors.appContainer.bg,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#e0e0e0',
  },
  editProfileIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4a90e2',
    borderRadius: 20,
    padding: 8,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#fff',
  },
  locationContainer: {
    backgroundColor: Colors.appContainer.bg,
    paddingHorizontal: 20,
    paddingVertical: responsiveHeight(1),
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2),
    color: '#fff',
    marginBottom: 5,
    fontFamily: 'Poppins-Medium',
  },
  input: {
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: Colors.appContainer.bg,
    fontSize: 16,
    color: '#fff',
  },
  locationText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
  },
  suggestionsContainer: {
    maxHeight: 200,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    marginLeft: 10,
    fontSize: responsiveFontSize(1.7),
    color: '#000',
    fontFamily: 'Poppins-Medium',
  },
  settingsOptionsContainer: {
    backgroundColor: '#ffffff',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  settingsOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#4a4a4a',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ff6b6b',
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 3,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handleIndicator: {
    width: 40, // Width of the handle
    height: 4, // Height of the handle
    borderRadius: 2, // Rounded edges
    backgroundColor: '#ccc', // Light gray color
  },
  bottomSheetContainer: {
    padding: 8,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  actionText: {
    fontSize: responsiveFontSize(2),
    color: '#000',
    marginBottom: 10,
    marginHorizontal: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  actionButton: {
    borderWidth: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  updateContainer: {
    paddingBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(2),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  update: {
    fontFamily: 'Poppins-SemiBold',
    color: '#3B82F6',
    fontSize: responsiveFontSize(2),
  },
});

export default Settings;
