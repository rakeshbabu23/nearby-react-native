import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {Colors, DARK_COLORS} from '../../../constants/Colors';
import Backbar from '../../../components/general/Backbar';
import useComment from '../../../hooks/useComment';
import useGetCommets from '../../../hooks/useGetCommets';
import {useSelector} from 'react-redux';
import Comments from '../../../components/main/home/helpers/Comments';
import useLike from '../../../hooks/useLike';

const TextCard = ({route}) => {
  const {postId, author, time, distance, content, likes, post, comments} =
    route.params;
  const {commentsLoading} = useGetCommets(postId);
  const postStore = useSelector(state => state.post);
  const {addOrUndoLikeApiCall} = useLike(post);
  const isPostLiked = postStore.likedPosts.some(
    likedPost => likedPost._id === postId,
  );

  const [newComment, setNewComment] = useState('');
  const handleComment = useComment(postId, newComment);

  return (
    <View style={styles.container}>
      <Backbar />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        {/* Main Post Content */}
        <View style={styles.mainCardContainer}>
          {/* Author Info */}
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
                <Text style={styles.timestamp}>{moment(time).fromNow()}</Text>
              </View>
            </View>
          </View>

          {/* Post Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.content}>{content}</Text>
          </View>

          {/* Interaction Bottom Bar */}
          <View style={styles.bottom}>
            <Pressable
              style={styles.iconContainer}
              onPress={addOrUndoLikeApiCall}>
              <Ionicons
                name={isPostLiked ? 'heart' : 'heart-outline'}
                size={22}
                color={
                  isPostLiked
                    ? DARK_COLORS.heartActive
                    : DARK_COLORS.iconDefault
                }
              />
              <Text style={styles.voteNumber}>
                {' '}
                {isPostLiked ? likes + 1 : likes}
              </Text>
            </Pressable>
            <Pressable style={styles.iconContainer}>
              <Ionicons
                name="chatbubble-outline"
                size={22}
                color={DARK_COLORS.iconDefault}
              />
              <Text style={styles.voteNumber}>{comments}</Text>
            </Pressable>
          </View>
        </View>

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
              <ActivityIndicator color="#fff" size="large" />
            </View>
          ) : (
            <Comments postId={postId} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default TextCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appContainer.bg,
    paddingHorizontal: responsiveWidth(2),
  },
  scrollContainer: {
    flex: 1,
  },
  mainCardContainer: {
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
  contentContainer: {
    marginVertical: responsiveHeight(1),
  },
  content: {
    fontFamily: 'Poppins-Regular',
    fontSize: responsiveHeight(1.8),
    color: Colors.textcard.content,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: responsiveWidth(2),
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: Colors.textcard.iconContainer,
    borderRadius: 25,
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.5),
  },
  voteNumber: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.textcard.iconVote,
    fontFamily: 'Poppins-Regular',
    marginLeft: responsiveWidth(1),
  },
  // comment styles

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
  commentsSectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: responsiveFontSize(2),
    color: '#fff',
    marginBottom: responsiveHeight(1),
  },
});
