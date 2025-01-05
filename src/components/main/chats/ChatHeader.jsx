import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
const {width: screenWidth} = Dimensions.get('window');
import {useNavigation} from '@react-navigation/native';
const ChatHeader = ({receiverName, isUserOnline, profileImage}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.headerNavigationContainer}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
          }}>
          <Ionicons name="arrow-back-outline" size={20} color="#fff" />
          <Image
            style={styles.ownerImage}
            source={{
              uri: profileImage
                ? profileImage
                : 'https://pearlss4development.org/wp-content/uploads/2020/05/profile-placeholder.jpg',
            }}
          />
        </Pressable>

        <View style={styles.chatOwnerInfoContainer}>
          <Text style={styles.ownerName}>{receiverName}</Text>
          <Text style={styles.timestamp}>
            {isUserOnline ? 'online' : 'offline'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.6),
    borderBottomWidth: 1,
    borderColor: '#fff',
    borderBottomEndRadius: '#000',
  },
  headerNavigationContainer: {
    //flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5,
  },
  chatOwnerInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: responsiveWidth(1),
  },
  ownerName: {
    fontFamily: 'Poppins-Medium',
    fontSize: responsiveFontSize(2),
    color: '#fff',
  },
  ownerImage: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(10) / 2,
  },
  timestamp: {
    fontFamily: 'Poppins-Light',
    fontSize: responsiveHeight(1.3),
    color: '#fff',
  },
});
