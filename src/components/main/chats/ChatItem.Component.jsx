import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../../constants/Colors';
import ProfileImage from '../../../screen/auth/ProfileImage';
const ChatItem = ({
  profileImage,
  name,
  lastMessage,
  time,
  unreadCount,
  screenName,
  item,
}) => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigation.navigate('ChatScreen', {
          receiverId: item.receiverDetails._id,
          receiverName: item.receiverDetails.name,
          profileImage,
        })
      }>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: item?.receiverDetails?.profileImage
              ? item.receiverDetails.profileImage
              : 'https://pearlss4development.org/wp-content/uploads/2020/05/profile-placeholder.jpg',
          }}
          style={styles.image}
        />
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.lastMessage}>
          {lastMessage.length > 30
            ? `${lastMessage.slice(0, 30)}...`
            : lastMessage}
        </Text>
      </View>
      <View style={styles.timeContainer}>
        {screenName === 'nearby' ? (
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() =>
              navigation.navigate('ChatScreen', {
                receiverId: item.receiverDetails._id,
                receiverName: item.receiverDetails.name,
                profileImage,
              })
            }>
            <Text style={styles.chatText}>Chat</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.time}>
              {new Date(item.createdAt).toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              })}
            </Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>90</Text>
              </View>
            )}
          </>
        )}
      </View>
    </Pressable>
  );
};

export default ChatItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: responsiveHeight(1),
    paddingRight: responsiveHeight(1),
  },
  imageContainer: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatInfo: {
    flex: 0.6,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 2,
    paddingHorizontal: responsiveWidth(1),
  },
  image: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(12) / 2,
  },
  name: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Poppins-Medium',
    color: '#fff',
  },
  lastMessage: {
    fontFamily: 'Poppins-Regular',
    fontSize: responsiveHeight(1.5),
    color: '#fff',
  },
  timeContainer: {
    flex: 0.2,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  time: {
    fontFamily: 'Poppins-Regular',
    fontSize: responsiveHeight(1.2),
    color: '#fff',
  },
  unreadBadge: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    borderRadius: responsiveWidth(5) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  unreadCount: {
    fontSize: responsiveHeight(1.2),
    color: '#000',
  },
  chatButton: {
    backgroundColor: '#0891B2',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: responsiveWidth(2),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    width: responsiveWidth(20),
  },
  chatText: {
    color: 'white',
    fontSize: responsiveHeight(1.5),
  },
});
