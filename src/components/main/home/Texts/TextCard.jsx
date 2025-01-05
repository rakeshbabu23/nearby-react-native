import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import {Colors, DARK_COLORS} from '../../../../constants/Colors';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setLikedPosts} from '../../../../redux/postSlice';
import useLike from '../../../../hooks/useLike';

const TextCard = ({
  postId,
  author,
  time,
  distance,
  content,
  likes,
  comments,
  post,
  profileImageUrl,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const postStore = useSelector(state => state.post);
  const {addOrUndoLikeApiCall} = useLike(post);
  const isPostLiked = postStore.likedPosts.some(
    likedPost => likedPost._id === postId,
  );

  const truncateContent = (text, limit) =>
    text.replace(/\s+/g, '').length > limit
      ? `${text.slice(0, limit).trim()}...`
      : text;

  return (
    <View style={styles.mainCardContainer}>
      {/* Author Section */}
      <View style={styles.authorContainer}>
        <Image
          style={styles.authorImage}
          source={{
            uri: profileImageUrl
              ? `${profileImageUrl}?t=${new Date().getTime()}`
              : 'https://pearlss4development.org/wp-content/uploads/2020/05/profile-placeholder.jpg',
          }}
        />
        <View style={styles.authorInfo}>
          <Text style={styles.author}>{author}</Text>
          <View style={styles.postInfo}>
            <Text style={styles.timestamp}>{moment(time).fromNow()}</Text>
            
          </View>
        </View>
      </View>

      {/* Content Section */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('TextPostInfo', {
            postId,
            author,
            time,
            distance,
            content,
            likes,
            comments,
          })
        }>
        <Text style={styles.content}>
          {truncateContent(content, 300)}
          {content.replace(/\s+/g, '').length > 300 && (
            <Text style={styles.readMore}>Read more</Text>
          )}
        </Text>
      </TouchableOpacity>

      {/* Bottom Icons */}
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={addOrUndoLikeApiCall}>
          <Ionicons
            name={isPostLiked ? 'heart' : 'heart-outline'}
            size={22}
            color={
              isPostLiked ? DARK_COLORS.heartActive : DARK_COLORS.iconDefault
            }
          />
          <Text style={styles.voteNumber}>
            {isPostLiked ? likes + 1 : likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons
            name="chatbubble-outline"
            size={22}
            color={DARK_COLORS.iconDefault}
          />
          <Text style={styles.voteNumber}>{comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TextCard;
//
const styles = StyleSheet.create({
  mainCardContainer: {
    flex: 1,
    backgroundColor: Colors.appContainer.bg,
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
    // backgroundColor: Colors.textcard.iconContainer,
    borderRadius: 25,
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.5),
  },
  voteNumber: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.textcard.iconVote,
    fontFamily: 'Poppins-Regular',
    marginLeft: responsiveWidth(1),
  },
});
