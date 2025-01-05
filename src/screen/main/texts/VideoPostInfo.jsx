import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import Comments from '../../../components/main/home/helpers/Comments';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import moment from 'moment';
import {Colors} from './../../../constants/Colors';
import useComment from '../../../hooks/useComment';
import {useSelector} from 'react-redux';
import useGetCommets from '../../../hooks/useGetCommets';
import useLike from '../../../hooks/useLike';
const DARK_COLORS = {
  background: Colors.appContainer.bg,
  cardBackground: Colors.appContainer.bg,
  text: '#FFFFFF',
  secondaryText: '#A0A0A0',
  iconDefault: '#B0B0B0',
  heartActive: '#FF3040',
};
const VideoPostInfo = ({route}) => {
  const {post} = route.params;
  const [newComment, setNewComment] = useState('');
  const [isReadMore, setIsReadMore] = useState(false);
  const handleComment = useComment(post._id, newComment);
  const userStore = useSelector(state => state.user);
  const {commentsLoading} = useGetCommets(post._id);
  const postStore = useSelector(state => state.post);
  const {addOrUndoLikeApiCall} = useLike(post);
  const isPostLiked = postStore.likedPosts.some(
    likedPost => likedPost._id === post._id,
  );
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={true} horizontal={false}>
        <View style={styles.authorContainer}>
          <Image
            source={{
              uri:
                post.ownerDetails.profileImage ||
                'https://pearlss4development.org/wp-content/uploads/2020/05/profile-placeholder.jpg',
            }}
            style={styles.profileImage}
          />
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>{post.ownerDetails.name}</Text>
            <View style={styles.postInfo}>
              <Text style={styles.timestamp}>
                {moment(post.createAt).fromNow()}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              addOrUndoLikeApiCall();
            }}>
            <Ionicons
              name={isPostLiked ? 'heart' : 'heart-outline'}
              size={30}
              color={
                isPostLiked ? DARK_COLORS.heartActive : DARK_COLORS.iconDefault
              }
            />
            <Text style={styles.actionText}>
              {isPostLiked ? post.likes + 1 : post.likes}
            </Text>
          </TouchableOpacity>

          {/* Upvote Button */}
        </View>

        {/* Description */}
        {post.text && (
          <View>
            {post.text.length > 20 && !isReadMore ? (
              <Text style={styles.description}>
                {post.text.slice(0, 20)} {`... `}
                <Text
                  style={{color: '#ccc'}}
                  onPress={() => setIsReadMore(prev => !prev)}>
                  Read more
                </Text>
              </Text>
            ) : (
              <>
                <Text style={{color: '#ccc'}}>{post.text}</Text>
                {post.text.length > 20 && (
                  <Text
                    style={{color: '#ccc'}}
                    onPress={() => setIsReadMore(prev => !prev)}>
                    Read less
                  </Text>
                )}
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
              showsVerticalScrollIndicator={true}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleComment}>
              <Ionicons name="send" size={20} color={'#fff'} />
            </TouchableOpacity>
          </View>

          {commentsLoading ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator color="#fff" size="large" />
            </View>
          ) : (
            <Comments postId={post._id} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default VideoPostInfo;
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
    alignItems: 'flex-start',
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveHeight(2),
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
    color: Colors.textcard.postInfo,
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
    color: Colors.text,
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
    justifyContent: 'flex-start',
    width: Dimensions.get('window').width * 0.5,
  },
  dot: {
    color: '#fff',
  },

  distance: {
    fontFamily: 'Poppins-Regular',
    fontSize: responsiveHeight(1.2),
    color: Colors.textcard.postInfo,
  },
  actionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: responsiveFontSize(1.6),
    color: '#fff',
    textAlign: 'center',
  },
});
