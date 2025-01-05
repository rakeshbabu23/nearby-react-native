import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import TextCard from './TextCard';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {getPosts} from '../../../../services/postService';
import {Colors} from '../../../../constants/Colors';
import {setTextPosts} from '../../../../redux/postSlice';
import EmptyList from '../../../general/EmptyList';
import Toast from 'react-native-toast-message';

const TextsView = () => {
  const dispatch = useDispatch();
  const {selectedDistance, selectedTags, textPosts} = useSelector(
    state => state.post,
  );
  //const [textPosts, setTextPosts] = useState([]);
  const [textPostsLoading, setTextsPostsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMoreTextPosts, setHasMoreTextPosts] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const getTextPosts = async (pageToFetch = 1, isRefreshing = false) => {
    try {
      if (!isRefreshing) setTextsPostsLoading(true);
      const response = await getPosts(
        'text',
        pageToFetch,
        selectedDistance,
        selectedTags,
      );
      const {data} = response.data;
      if (isRefreshing) {
        //setTextPosts(data); // Replace data on refresh
        dispatch(setTextPosts({data, isRefreshing: true}));
      } else {
        //setTextPosts(prev => [...prev, ...data]); // Append new data
        dispatch(setTextPosts({data, isRefreshing: false}));
      }
      if (data.length < 10) {
        setHasMoreTextPosts(false); // No more data to fetch
      } else {
        setHasMoreTextPosts(true);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'unknown error',
      });
    } finally {
      setTextsPostsLoading(false);
      setLoadingMore(false);
      if (isRefreshing) setRefreshing(false);
    }
  };
  useEffect(() => {
    getTextPosts(1, true);
  }, [selectedDistance, selectedTags]);
  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    getTextPosts(1, true);
  };
  const showLoader = () => {
    if (textPostsLoading && !refreshing) {
      return (
        <View style={{paddingVertical: responsiveHeight(1.5)}}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    } else if (!hasMoreTextPosts && textPosts.length >= 1) {
      return (
        <View style={{paddingVertical: responsiveHeight(1.5)}}>
          <Text
            style={{
              textAlign: 'center',
              color: '#fff',
              marginTop: responsiveHeight(1.5),
            }}>
            You've reached the end! No more posts for now.
          </Text>
        </View>
      );
    }
    return null;
  };
  const loadMore = () => {
    if (!loadingMore && hasMoreTextPosts) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      getTextPosts(nextPage);
    }
  };
  const renderEmptyComponent = () => (
    <View style={{paddingVertical: responsiveHeight(1.5)}}>
      <Text
        style={{
          textAlign: 'center',
          color: '#fff',
          marginTop: responsiveHeight(1.5),
        }}>
        No text posts here yet! Check back soon.
      </Text>
    </View>
  );
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: responsiveWidth(2),
        backgroundColor: Colors.appContainer.bg,
      }}>
      <FlatList
        data={textPosts}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({item, index}) => {
          return (
            <TextCard
              postId={item._id}
              author={item.ownerDetails.name}
              time={item.createdAt}
              distance={item.dist.calculated}
              content={item.text}
              likes={item.likes}
              comments={item.comments}
              profileImageUrl={item.ownerDetails.profileImage}
              post={item}
            />
          );
        }}
        ListEmptyComponent={EmptyList}
        onEndReachedThreshold={0.5}
        onEndReached={loadMore}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{paddingBottom: 20}}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={showLoader}
      />
    </View>
  );
};

export default TextsView;
