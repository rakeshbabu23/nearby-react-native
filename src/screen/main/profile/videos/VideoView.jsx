import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Image,
} from 'react-native';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {setLikedPosts} from '../../../../redux/postSlice';
import useLike from '../../../../hooks/useLike';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const ReelItem = ({item, isPaused, onPlayPausePress}) => {
  const navigation = useNavigation();
  const postStore = useSelector(state => state.post);
  const [showPostDescription, setShowPostDescription] = useState(false);
  const {addOrUndoLikeApiCall} = useLike(item);
  if (item.isUserLiked) {
    setLikedPosts(item);
  }
  const isPostLiked = postStore.likedPosts.some(
    likedPost => likedPost._id === item._id,
  );
  const [videoSize, setVideoSize] = useState({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 100,
    top: 0,
  });
  const [isVideoPlaying, setIsVideoPlaying] = useState(!isPaused);
  const handleLoad = data => {
    const {width, height} = data.naturalSize;
    const aspectRatio = width / height;
    const calculatedWidth = SCREEN_WIDTH;
    const calculatedHeight = calculatedWidth / aspectRatio;

    // Center the video vertically if it's smaller than screen height
    const topPosition =
      calculatedHeight < SCREEN_HEIGHT
        ? (SCREEN_HEIGHT - calculatedHeight) / 2
        : 0;

    setVideoSize({
      width: calculatedWidth,
      height: calculatedHeight,
      top: topPosition,
    });
  };

  useEffect(() => {
    setIsVideoPlaying(!isPaused);
  }, [isPaused]);

  return (
    <View style={styles.reelContainer}>
      {/* Video */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPlayPausePress}
        style={styles.videoTouchable}>
        <View style={styles.videoWrapper}>
          <Video
            source={{uri: item.media.videos[0].videoUrl}}
            style={[
              styles.video,
              {
                width: videoSize.width,
                height: videoSize.height,
                //  top: videoSize.top,
              },
            ]}
            resizeMode="cover"
            repeat
            paused={isPaused}
            onLoad={handleLoad}
          />
        </View>

        {/* Pause Overlay */}
        {isPaused && (
          <View style={styles.pauseOverlay}>
            <Ionicons name="play" size={80} color="white" />
          </View>
        )}
      </TouchableOpacity>

      {/* Video Details */}
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.3 )', 'transparent']}
        style={styles.videoDetailsContainer}
        start={{x: 0.5, y: 1}}
        end={{x: 0.5, y: 0}}>
        <View style={styles.authorContainer}>
          {!showPostDescription && (
            <>
              <View style={styles.authorImageContainer}>
                <Image
                  source={{
                    uri: item.ownerDetails.profileImage
                      ? item.ownerDetails.profileImage
                      : 'https://pearlss4development.org/wp-content/uploads/2020/05/profile-placeholder.jpg',
                  }}
                  style={styles.authorImage}
                  resizeMode="cover"
                />
              </View>

              <View>
                <Text style={styles.authorName}>{item.ownerDetails.name}</Text>
                <View style={styles.postInfoContainer}>
                  <Text style={styles.postInfoText}>{20} Km</Text>
                  <Text style={styles.postInfoText}>•</Text>
                  <Text style={styles.postInfoText}>
                    {moment(item.createAt).fromNow()}
                  </Text>
                </View>
                {item.text && (
                  <TouchableOpacity
                    style={styles.postInfoText}
                    onPress={() => setShowPostDescription(flag => !flag)}>
                    <Text style={{color: '#fff'}}>
                      {showPostDescription ? 'see less' : 'see more'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
          {showPostDescription && (
            <ScrollView
              style={styles.postDescriptionContainer}
              nestedScrollEnabled={true}
              horizontal={false}>
              <Text style={{color: '#fff'}}>
                {item.text}
                {'\n'}
                <TouchableOpacity onPress={() => setShowPostDescription(false)}>
                  <Text
                    style={{color: '#fff', textDecorationLine: 'underline'}}>
                    {' '}
                    see less
                  </Text>
                </TouchableOpacity>
              </Text>
            </ScrollView>
          )}
        </View>
      </LinearGradient>
      {!showPostDescription && (
        <View style={styles.videoActionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              addOrUndoLikeApiCall;
            }}>
            <Ionicons
              name={isPostLiked || item.isUserLiked ? 'heart' : 'heart-outline'}
              size={30}
              color={isPostLiked || item.isUserLiked ? 'red' : 'white'}
            />
            <Text style={styles.actionText}>
              {item.isUserLiked
                ? item.likes
                : isPostLiked
                ? item.likes + 1
                : item.likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('VideoPostInfo', {post: item})}>
            <Ionicons name="chatbubble-outline" size={30} color="white" />
            <Text style={styles.actionText}>{item.comments}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ReelItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  reelContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
    //backgroundColor: 'pink',
  },
  videoTouchable: {
    width: '100%',
    height: '100%',
  },
  videoWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  video: {
    position: 'absolute',
    alignSelf: 'center',
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  videoDetailsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    // backgroundColor: 'rgba(0,0,0,0.2)',
    // padding: 15,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  authorImageContainer: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(10) / 2,
    marginRight: 10,
    overflow: 'hidden',
  },
  authorImage: {
    width: '100%',
    height: '100%',
  },
  authorName: {
    color: 'white',
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Poppins-SemiBold',
  },
  postInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postInfoText: {
    color: '#fff',
    marginRight: 5,
    opacity: 0.7,
    fontSize: responsiveFontSize(1.4),
    fontFamily: 'Poppins-Regular',
  },
  videoActionsContainer: {
    marginRight: responsiveWidth(2),
    flexDirection: 'column',
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
  },
  actionText: {
    color: 'white',
    marginTop: responsiveHeight(0.5),
    fontFamily: 'Poppins-Regular',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  postDescriptionContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    maxHeight: 100,
    bottom: 20,
    width: SCREEN_WIDTH,
    left: 0,
  },
});
