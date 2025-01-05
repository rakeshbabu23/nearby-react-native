import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import {Colors} from '../../../../constants/Colors';
import useLike from '../../../../hooks/useLike';
import {getAspectRatioHeight} from '../../../../constants/aspectRatios';
import useGetCommets from '../../../../hooks/useGetCommets';
import Comments from '../helpers/Comments';

const {width: screenWidth} = Dimensions.get('window');

// Dark mode color palette inspired by Instagram
const DARK_COLORS = {
  background: Colors.appContainer.bg,
  cardBackground: Colors.appContainer.bg,
  text: '#FFFFFF',
  secondaryText: '#A0A0A0',
  iconDefault: '#B0B0B0',
  heartActive: '#FF3040',
};

const InstagramStyleImageCard = ({
  postId,
  author,
  time,
  imageUrl,
  votecount,
  aspectRatio,
  distance,
  profileImageUrl,
  likes,
  comments,
  text,
  post,
}) => {
  const navigation = useNavigation();
  const postStore = useSelector(state => state.post);
  const {addOrUndoLikeApiCall} = useLike(post);
  const {commentsLoading} = useGetCommets(postId);

  const isPostLiked = postStore.likedPosts.some(
    likedPost => likedPost._id === postId,
  );
  const sanitizedAspectRatios = aspectRatio.split(':');

  const bottomSheetRef = useRef(null);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: profileImageUrl
              ? `${profileImageUrl}?t=${new Date().getTime()}`
              : 'https://pearlss4development.org/wp-content/uploads/2020/05/profile-placeholder.jpg',
          }}
          style={styles.profileImage}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.username}>{author}</Text>
          <View style={styles.postInfo}>
            <Text style={styles.timestamp}>{moment(time).fromNow()}</Text>
            
          </View>
        </View>
      </View>

      {/* Post Image */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ImagePostInfo', {
            postId,
            author,
            time,
            imageUrl,
            votecount,
            aspectRatio,
            profileImageUrl,
            description: text,
            post,
            likes,
            comments,
          })
        }>
        <Image
          source={{uri: imageUrl}}
          style={[
            styles.postImage,
            {
              height:
                screenWidth *
                (Number(sanitizedAspectRatios[1]) / sanitizedAspectRatios[0]),
            },
          ]}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={addOrUndoLikeApiCall}>
            <Ionicons
              name={isPostLiked ? 'heart' : 'heart-outline'}
              size={28}
              color={
                isPostLiked ? DARK_COLORS.heartActive : DARK_COLORS.iconDefault
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate('ImagePostInfo', {
                postId,
                author,
                time,
                imageUrl,
                votecount,
                aspectRatio,
                profileImageUrl,
                description: text,
                post,
                likes,
                comments,
              })
            }>
            <Ionicons
              name="chatbubble-outline"
              size={28}
              color={DARK_COLORS.iconDefault}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="paper-plane-outline"
              size={24}
              color={DARK_COLORS.iconDefault}
            />
          </TouchableOpacity> */}
        </View>
        {/* <TouchableOpacity style={styles.actionButton}>
          <Ionicons
            name="bookmark-outline"
            size={24}
            color={DARK_COLORS.iconDefault}
          />
        </TouchableOpacity> */}
      </View>

      {/* Likes and Caption */}
      <View style={styles.contentContainer}>
        <Text style={styles.likesText}>
          {' '}
          {isPostLiked ? likes + 1 : likes} {likes > 1 ? 'likes' : 'like'}
        </Text>
        {text && (
          <View style={styles.captionContainer}>
            <Text style={styles.username}>{author} </Text>
            <Text style={styles.caption} numberOfLines={1}>
              {text.length > 40 ? `${text.slice(0, 40)}...` : text}
            </Text>
          </View>
        )}
        {comments > 0 && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ImagePostInfo', {
                postId,
                author,
                time,
                imageUrl,
                votecount,
                aspectRatio,
                profileImageUrl,
                description: text,
                post,
                likes,
                comments,
              })
            }>
            <Text style={styles.commentsText}>
              {comments < 2
                ? `View ${comments} comment`
                : `View all ${comments} comments`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DARK_COLORS.background,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 5,
    backgroundColor: DARK_COLORS.cardBackground,
  },
  profileImage: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(10) / 2,

    marginRight: 10,
    borderWidth: 1,
    borderColor: DARK_COLORS.secondaryText,
  },
  headerTextContainer: {
    flex: 1,
  },
  username: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Poppins-Medium',
    color: DARK_COLORS.text,
  },
  postInfo: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    color: '#fff',
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
  moreOptionsButton: {
    padding: 5,
  },
  postImage: {
    width: screenWidth,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: DARK_COLORS.cardBackground,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 15,
  },
  contentContainer: {
    paddingHorizontal: 10,
    backgroundColor: DARK_COLORS.cardBackground,
    paddingBottom: 10,
  },
  likesText: {
    fontFamily: 'Poppins-Regular',
    fontSize: responsiveHeight(1.6),
    color: DARK_COLORS.text,
  },
  captionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  caption: {
    flex: 1,
    color: DARK_COLORS.text,
    fontFamily: 'Poppins-Regular',
  },
  commentsText: {
    color: DARK_COLORS.secondaryText,
    marginTop: 5,
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
});

export default InstagramStyleImageCard;
