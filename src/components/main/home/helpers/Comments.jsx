import {StyleSheet, Text, View, FlatList, Image} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {
  responsiveWidth,
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

import {Colors} from '../../../../constants/Colors';

const renderComment = (item, userId) => {
  return (
    <View key={item._id} style={styles.commentContainer}>
      <Image
        source={{
          uri: item?.userId?.profileImage
            ? item.userId.profileImage
            : 'https://pearlss4development.org/wp-content/uploads/2020/05/profile-placeholder.jpg',
        }}
        style={styles.commentProfilePic}
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentAuthor}>
          {item.userId._id === userId ? 'You' : item.userId.name}
        </Text>
        <Text style={styles.commentText}>{item.text}</Text>
        <Text style={styles.commentTimestamp}>
          {moment(item.createdAt).fromNow()}
        </Text>
      </View>
    </View>
  );
};
const Comments = ({postId}) => {
  const postStore = useSelector(state => state.post);
  const userStore = useSelector(state => state.user);
  return (
    <FlatList
      data={postStore.comments[postId]}
      renderItem={({item, index}) => renderComment(item, userStore.userId)}
      keyExtractor={item => item._id.toString()}
      ListEmptyComponent={
        <Text style={{textAlign: 'center', marginVertical: 20, color: 'gray'}}>
          No comments yet.
        </Text>
      }
    />
  );
};

export default Comments;

const styles = StyleSheet.create({
  // Comments Section Styles
  commentsSection: {
    marginTop: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(2),
  },

  commentContainer: {
    flexDirection: 'row',
    marginBottom: responsiveHeight(2),
    alignItems: 'flex-start',
  },
  commentProfilePic: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    marginRight: responsiveWidth(2),
  },
  commentContent: {
    flex: 1,
    backgroundColor: Colors.appContainer.bg,
    borderRadius: 10,
    padding: responsiveWidth(2),
  },
  commentAuthor: {
    fontFamily: 'Poppins-Medium',
    fontSize: responsiveFontSize(1.7),
    color: '#fff',
    marginBottom: responsiveHeight(0.5),
  },
  commentText: {
    fontFamily: 'Poppins-Regular',
    fontSize: responsiveFontSize(1.6),
    color: Colors.textcard.content,
    marginBottom: responsiveHeight(0.5),
  },
  commentTimestamp: {
    fontFamily: 'Poppins-Light',
    fontSize: responsiveFontSize(1.4),
    color: Colors.textcard.postInfo,
  },
});
