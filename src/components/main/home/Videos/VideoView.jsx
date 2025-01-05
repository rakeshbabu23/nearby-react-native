import React, {useState, useRef, useEffect, useCallback} from 'react';
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
import {getPosts} from '../../../../services/postService';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import useLike from '../../../../hooks/useLike';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {setLikedPosts, setVideoPosts} from '../../../../redux/postSlice';
import ReelItem from './VideoCard';
import EmptyList from '../../../general/EmptyList';
import Toast from 'react-native-toast-message';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const ReelsView = () => {
  const dispatch = useDispatch();
  const {selectedDistance, selectedTags, videoPosts} = useSelector(
    state => state.post,
  );
  //const [videoPosts, setVideoPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(1);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const fetchVideoPosts = async (pageToFetch = 1, isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
        setLoadMore(true);
      }
      // Replace this with your actual API call
      const response = await getPosts(
        'video',
        pageToFetch,
        selectedDistance,
        selectedTags,
      );
      const {data} = response.data;

      if (isRefreshing) {
        //setVideoPosts(data);
        dispatch(setVideoPosts({data, isRefreshing: true}));
      } else {
        //setVideoPosts(prev => [...prev, ...data]);
        dispatch(setVideoPosts({data, isRefreshing: false}));
      }
      if (data.length < 10) {
        setHasMorePosts(false);
      } else {
        setHasMorePosts(true);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'unknown error',
      });
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const getVideoPosts = useCallback(
    async (pageToFetch = 1, isRefreshing = false) => {
      try {
        if (!isRefreshing) {
          setLoading(true);
          setLoadMore(true);
        }
        // Replace this with your actual API call
        const response = await getPosts(
          'video',
          pageToFetch,
          selectedDistance,
          selectedTags,
        );
        const {data} = response.data;

        if (isRefreshing) {
          //setVideoPosts(data);
          dispatch(setVideoPosts({data, isRefreshing: true}));
        } else {
          //setVideoPosts(prev => [...prev, ...data]);
          dispatch(setVideoPosts({data, isRefreshing: false}));
        }
        if (data.length < 10) {
          setHasMorePosts(false);
        } else {
          setHasMorePosts(true);
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error?.response?.data?.message || 'unknown error',
        });
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [dispatch, selectedDistance, selectedTags],
  );
  useFocusEffect(
    useCallback(() => {
      getVideoPosts(1, true);
    }, [getVideoPosts]),
  );

  // useEffect(() => {
  //   fetchVideoPosts(1, true);
  // }, [selectedDistance, selectedTags]);

  // const onRefresh = () => {
  //   setRefreshing(true);
  //   fetchVideoPosts(true);
  // };
  const onRefresh = () => {
    setPage(1);
    setRefreshing(true);
    fetchVideoPosts(1, true);
  };

  // const handleLoadMore = () => {
  //   if (!loading && hasMorePosts) {
  //     fetchVideoPosts();
  //   }
  // };
  const handleLoadMore = () => {
    if (!loadMore && hasMorePosts) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchVideoPosts(nextPage, false);
      setLoadMore(true);
    }
  };

  const showLoader = () => {
    if (loading && !refreshing) {
      return (
        <View style={{paddingVertical: responsiveHeight(1.5)}}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    } else if (!hasMorePosts && videoPosts.length >= 1) {
      return (
        <View style={{paddingVertical: responsiveHeight(1.5)}}>
          <Text
            style={{
              textAlign: 'center',
              color: '#fff',
              marginTop: responsiveHeight(1.5),
              fontFamily: 'Poppins-Regular',
            }}>
            You've reached the end! No more posts for now.
          </Text>
        </View>
      );
    }
    return null;
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={videoPosts}
        renderItem={({item, index}) => (
          <ReelItem
            item={item}
            isPaused={index !== currentIndex}
            onPlayPausePress={() => {
              /* Optional: Add play/pause logic */
            }}
          />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={SCREEN_HEIGHT}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="white"
          />
        }
        ListEmptyComponent={EmptyList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={showLoader}
      />
    </View>
  );
};

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

export default ReelsView;
