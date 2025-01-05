import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {Colors} from '../../../constants/Colors';
import {getAspectRatioHeight} from '../../../constants/aspectRatios';
import useComment from '../../../hooks/useComment';
import useGetCommets from '../../../hooks/useGetCommets';
import Comments from '../../../components/main/home/helpers/Comments';
import useLike from '../../../hooks/useLike';
import {useSelector} from 'react-redux';

const DARK_COLORS = {
  background: Colors.appContainer.bg,
  cardBackground: Colors.appContainer.bg,
  text: '#FFFFFF',
  secondaryText: '#A0A0A0',
  iconDefault: '#B0B0B0',
  heartActive: '#FF3040',
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const ImagePostInfo = ({route}) => {
  const {
    postId,
    author,
    time,
    distance,
    imageUrl,
    aspectRatio,
    profileImageUrl,
    description,
    post,
    likes,
    comments,
  } = route.params;
  const postStore = useSelector(state => state.post);
  const [newComment, setNewComment] = useState('');
  const [isReadMore, setIsReadMore] = useState(false);
  const {addOrUndoLikeApiCall} = useLike(post);
  const isPostLiked = postStore.likedPosts.some(
    likedPost => likedPost._id === postId,
  );
  const handleComment = useComment(postId, newComment);
  const {commentsLoading} = useGetCommets(postId);

  return (
    <View style={styles.container}>
      {/* Full-screen Image */}

      {/* Overlay Content */}
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Author Info and Actions */}
        <Image
          source={{uri: imageUrl}}
          style={[
            styles.fullImage,
            {height: getAspectRatioHeight(aspectRatio)},
          ]}
          resizeMode="cover"
        />
        <View style={styles.authorContainer}>
          <Image
            source={{
              uri:
                profileImageUrl ||
                'https://pearlss4development.org/wp-content/uploads/2020/05/profile-placeholder.jpg',
            }}
            style={styles.profileImage}
          />
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>{author}</Text>
            <View style={styles.postInfo}>
              <Text style={styles.timestamp}>{moment(time).fromNow()}</Text>
            </View>
          </View>

          {/* Upvote Button */}
          <TouchableOpacity
            style={styles.upvoteButton}
            onPress={addOrUndoLikeApiCall}>
            <Ionicons
              name={isPostLiked ? 'heart' : 'heart-outline'}
              size={28}
              color={
                isPostLiked ? DARK_COLORS.heartActive : DARK_COLORS.iconDefault
              }
            />
            <Text style={styles.upvoteCount}>
              {isPostLiked ? likes + 1 : likes}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        {description && (
          <View>
            {description.length > 20 && !isReadMore ? (
              <Text style={styles.description}>
                {description.slice(0, 20)} {`... `}
                <Text
                  style={{color: '#ccc'}}
                  onPress={() => setIsReadMore(prev => !prev)}>
                  Read more
                </Text>
              </Text>
            ) : (
              <>
                <Text style={{color: '#ccc'}}>{description}</Text>
                <Text
                  style={{color: '#ccc'}}
                  onPress={() => setIsReadMore(prev => !prev)}>
                  Read less
                </Text>
              </>
            )}
          </View>
        )}

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsSectionTitle}>Comments</Text>

          {/* Comment Input */}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              placeholderTextColor={Colors.text_muted}
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleComment}>
              <Ionicons name="send" size={20} color={'#fff'} />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          {commentsLoading ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator color="#000" />
            </View>
          ) : (
            <Comments postId={postId} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appContainer.bg,
  },
  fullImage: {
    width: Dimensions.get('window').width,
    resizeMode: 'cover',
    //borderRadius: responsiveWidth(5),
    overflow: 'hidden',
  },
  contentOverlay: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: responsiveWidth(5),
    borderTopRightRadius: responsiveWidth(5),
    marginTop: -responsiveHeight(4),
    paddingTop: responsiveHeight(3),
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
    marginBottom: responsiveHeight(2),
  },
  profileImage: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(10) / 2,
    marginRight: responsiveWidth(2),
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontFamily: 'Poppins-Medium',
    fontSize: responsiveFontSize(2),
    color: '#fff',
  },
  timestamp: {
    fontFamily: 'Poppins-Light',
    fontSize: responsiveFontSize(1.5),
    color: '#ccc',
  },
  upvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upvoteCount: {
    marginLeft: responsiveWidth(1),
    fontFamily: 'Poppins-Medium',
    fontSize: responsiveFontSize(1.8),
    color: '#fff',
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: responsiveFontSize(1.8),
    paddingHorizontal: responsiveWidth(4),
    marginBottom: responsiveHeight(2),
    color: '#fff',
  },
  // Comments Section Styles
  commentsSection: {
    marginTop: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(2),
  },
  commentsSectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: responsiveFontSize(2),
    color: '#fff',
    marginBottom: responsiveHeight(1),
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textcard.iconContainer,
    borderRadius: 20,
    paddingHorizontal: responsiveWidth(2),
    marginBottom: responsiveHeight(2),
    borderWidth: 1,
    borderColor: '#fff',
  },
  commentInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: responsiveFontSize(1.6),
    color: '#fff',
    maxHeight: responsiveHeight(10),
    minHeight: responsiveHeight(5),
    paddingVertical: responsiveHeight(1),
  },
  sendButton: {
    marginLeft: responsiveWidth(2),
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
    backgroundColor: Colors.textcard.iconContainer,
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
});

export default ImagePostInfo;
