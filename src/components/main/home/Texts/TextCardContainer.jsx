import {View, Text, Image, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Colors} from '../../../../constants/Colors';
import {useNavigation} from '@react-navigation/native';

const TextCard = ({postId, author, time, distance, content, votecount}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.mainCardContainer}>
      <View style={styles.authorContainer}>
        <Image
          style={styles.authorImage}
          source={{
            uri: 'https://pearlss4development.org/wp-content/uploads/2020/05/profile-placeholder.jpg',
          }}
        />
        <View style={styles.authorInfo}>
          <Text style={styles.author}>{author}</Text>
          <View style={styles.postInfo}>
            <Text style={styles.timestamp}>{time}</Text>
          </View>
        </View>
      </View>
      <Pressable
        onPress={() => {
          navigation.navigate('TextPostInfo', {
            postId,
            author,
            time,
            distance,
            content,
            votecount,
          });
        }}>
        <Text style={styles.content}>{content}</Text>
      </Pressable>
      <View style={styles.bottom}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="arrow-up-circle-outline"
            size={20}
            color={Colors.textcard.iconVote}
          />
          {/* <Ionicons name="arrow-up-circle" size={20} color="white" /> */}
          <Text style={styles.voteNumber}>{votecount}</Text>
        </View>
      </View>
    </View>
  );
};

export default TextCard;
//
const styles = StyleSheet.create({
  mainCardContainer: {
    flex: 1,
    backgroundColor: Colors.textcard.background,
    borderRadius: 10,
    flexDirection: 'column',
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(1),
    marginVertical: responsiveHeight(1),
    borderWidth: 1,
    gap: 4,
    borderColor: '#ccc',
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 4,
  },
  authorImage: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(10) / 2,
  },
  authorInfo: {
    flexDirection: 'column',
  },
  postInfo: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  timestamp: {
    fontFamily: 'Poppins-Light',
    fontSize: responsiveHeight(1.2),
    color: Colors.textcard.postInfo,
  },
  distance: {
    fontFamily: 'Poppins-Regular',
    fontSize: responsiveHeight(1.2),
    color: Colors.textcard.postInfo,
  },
  author: {
    fontFamily: 'Poppins-Medium',
    fontSize: responsiveHeight(1.8),
    color: '#fff',
  },
  content: {
    fontFamily: 'Poppins-Regular',
    fontSize: responsiveHeight(1.8),
    color: Colors.textcard.content,
    marginVertical: responsiveHeight(1),
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: Colors.textcard.iconContainer,
    borderRadius: 25,
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.5),
    // borderWidth: 1,
    // borderColor: Colors.textcard.iconVote,
  },
  voteNumber: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.textcard.iconVote,
    fontFamily: 'Poppins-Regular',
    marginLeft: responsiveWidth(1),
  },
});
