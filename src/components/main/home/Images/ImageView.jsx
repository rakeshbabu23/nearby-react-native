import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  RefreshControl,
  ActivityIndicator,
  Text,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ImageCard from './ImageCard';
import {setImagePosts} from '../../../../redux/postSlice';
import {getPosts} from '../../../../services/postService';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {Colors} from '../../../../constants/Colors';
import {useFocusEffect} from '@react-navigation/native';
import EmptyList from '../../../general/EmptyList';
import Toast from 'react-native-toast-message';

const ImageView = () => {
  const dispatch = useDispatch();
  const {selectedDistance, selectedTags, imagePosts} = useSelector(
    state => state.post,
  );
  // const [imagePosts, setImagePosts] = useState([]);
  const [page, setPage] = useState(1);
  const [imagePostsLoading, setImagePostsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMoreImagesPosts, setHasMoreImagesPosts] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const getImagePosts = async (pageToFetch = 1, isRefreshing) => {
    try {
      if (!isRefreshing) {
        setImagePostsLoading(true);
        setLoadMore(true);
      }
      const response = await getPosts(
        'image',
        pageToFetch,
        selectedDistance,
        selectedTags,
      );
      const {data} = response.data;
      if (isRefreshing) {
        //setImagePosts(data);
        dispatch(setImagePosts({data, isRefreshing: true}));
      } else {
        //setImagePosts(prev => [...prev, ...data]);
        dispatch(setImagePosts({data, isRefreshing: false}));
      }
      if (data.length < 10) {
        setHasMoreImagesPosts(false);
      } else {
        setHasMoreImagesPosts(true);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'unknown error',
      });
      console.error('Error fetching posts:', error);

      return;
    } finally {
      setImagePostsLoading(false);
      setLoadMore(false);
      if (isRefreshing) setRefreshing(false);
    }
  };
  const fetchImagePosts = useCallback(
    async (pageToFetch = 1, isRefreshing) => {
      try {
        if (!isRefreshing) {
          setImagePostsLoading(true);
          setLoadMore(true);
        }
        const response = await getPosts(
          'image',
          pageToFetch,
          selectedDistance,
          selectedTags,
        );
        const {data} = response.data;
        if (isRefreshing) {
          //setImagePosts(data);
          dispatch(setImagePosts({data, isRefreshing: true}));
        } else {
          //setImagePosts(prev => [...prev, ...data]);
          dispatch(setImagePosts({data, isRefreshing: false}));
        }
        if (data.length < 10) {
          setHasMoreImagesPosts(false);
        } else {
          setHasMoreImagesPosts(true);
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error?.response?.data?.message || 'unknown error',
        });
        console.error('Error fetching posts:', error);
        return;
      } finally {
        setImagePostsLoading(false);
        setLoadMore(false);
        if (isRefreshing) setRefreshing(false);
      }
    },
    [selectedDistance, selectedTags, dispatch],
  );
  useFocusEffect(
    useCallback(() => {
      fetchImagePosts(1, true);
    }, [fetchImagePosts]),
  );
  // useEffect(() => {
  //   getImagePosts(1, true);
  // }, [selectedDistance, selectedTags]);
  const loadMorePosts = () => {
    if (!loadMore && hasMoreImagesPosts) {
      const nextPage = page + 1;
      setPage(nextPage);
      getImagePosts(nextPage, false);
      setLoadMore(true);
    }
  };

  const onRefresh = () => {
    setPage(1);
    setRefreshing(true);
    getImagePosts(1, true);
  };
  const showLoader = () => {
    if (!refreshing && imagePostsLoading) {
      return (
        <View style={{paddingVertical: responsiveHeight(1.5)}}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    } else if (!hasMoreImagesPosts && imagePosts.length >= 1) {
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
    } else {
      return null;
    }
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={imagePosts}
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => (
          <ImageCard
            postId={item._id}
            author={item.ownerDetails.name}
            time={item.createdAt}
            content={item.text}
            imageUrl={item.media.images[0].imageUrl}
            aspectRatio={item.media.images[0].aspectRatio}
            votecount={20}
            profileImageUrl={item.ownerDetails.profileImage}
            likes={item.likes}
            comments={item.comments}
            text={item.text}
            post={item}
          />
        )}
        ListEmptyComponent={EmptyList}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReachedThreshold={0}
        onEndReached={loadMorePosts}
        ListFooterComponent={showLoader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appContainer.bg,
  },
  listContent: {
    paddingVertical: 10,
  },
});

export default ImageView;
