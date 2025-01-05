import {
  StyleSheet,
  Text,
  View,
  Image,
  Switch,
  FlatList,
  Pressable,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import {myPosts, updateUser} from '../../services/userService';
import TextCard from '../../components/main/home/Texts/TextCard';
import ImageCard from '../../components/main/home/Images/ImageCard';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setInformation} from '../../redux/userSlice';
import ReelItem from '../../components/main/home/Videos/VideoCard';
import {Colors} from '../../constants/Colors';
import EmptyList from '../../components/general/EmptyList';
const obj = ['Texts', 'Images', 'Videos'];
// Sample data for user posts

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const [activeTab, setActiveTab] = useState(0);
  const [isVisibleEnabled, setIsVisibleEnabled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  //const [userData, setUserData] = useState({});

  const [page, setPage] = useState({Texts: 1, Images: 1, Videos: 1});
  const [userPosts, setUserPosts] = useState({
    Texts: [],
    Images: [],
    Videos: [],
  });
  const [hasMorePosts, setHasMorePosts] = useState({
    Texts: true,
    Images: true,
    Videos: true,
  });
  const [loadMore, setLoadMore] = useState({
    Texts: false,
    Images: false,
    Videos: false,
  });
  const [postsLoading, setPostsLoading] = useState({
    Texts: false,
    Images: false,
    Videos: false,
  });

  const toggleSwitch = async newState => {
    setIsVisibleEnabled(newState);
    try {
      const response = await updateUser({visibility: newState});
      const {data} = response.data;
      Toast.show({
        type: 'success',
        text1: 'Settings updated successfully',
      });
      dispatch(
        setInformation({
          ...data,
          visibility: data.visibility,
          location: data.location.coordinates,
        }),
      );
    } catch (err) {
      console.error('Error updating visibility:', err);
      Alert.alert('Error updating visibility');
    }
  };
  const getUserPosts = async (pageToFetch = 1, isRefresh = false) => {
    try {
      if (!isRefresh) {
        setPostsLoading(prevState => ({...prevState, [obj[activeTab]]: true}));
        setLoadMore(prevState => ({...prevState, [obj[activeTab]]: true}));
      }
      const response = await myPosts(obj[activeTab], pageToFetch);
      const {data} = response.data;
      //
      if (isRefresh) {
        setUserPosts(prevState => {
          return {
            ...prevState,
            [obj[activeTab]]: data,
          };
        });
      } else {
        setUserPosts(prevState => {
          return {
            ...prevState,
            [obj[activeTab]]: [
              ...(prevState[obj[activeTab]] || []),
              ...(data || []),
            ],
          };
        });
      }
      if (data.length < 10) {
        setHasMorePosts(prevState => ({...prevState, [obj[activeTab]]: false}));
      } else {
        setHasMorePosts(prevState => ({...prevState, [obj[activeTab]]: true}));
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'unknown error',
      });
      s;
      console.error('Error fetching posts:', errpr);
    } finally {
      setPostsLoading(prevState => ({...prevState, [obj[activeTab]]: false}));
      setLoadMore(prevState => ({...prevState, [obj[activeTab]]: false}));
    }
  };
  useEffect(() => {
    getUserPosts(1, true);
  }, [activeTab]);
  const loadMorePosts = () => {
    if (!loadMore[obj[activeTab]] && hasMorePosts[obj[activeTab]]) {
      setLoadMore(prevState => ({...prevState, [obj[activeTab]]: true}));
      const nextPage = page[obj[activeTab]] + 1;
      setPage(prevState => ({...prevState, [obj[activeTab]]: nextPage}));
      getUserPosts(nextPage, false);
    }
  };
  const onRefresh = () => {
    setPage({Texts: 1, Images: 1, Videos: 1});
    setPostsLoading({Texts: false, Images: false, Videos: false});
    setLoadMore({Texts: false, Images: false, Videos: false});
    setUserPosts({Texts: [], Images: [], Videos: []});
    setHasMorePosts({Texts: true, Images: true, Videos: true});
    getUserPosts(1, true);
  };
  const showLoader = () => {
    if (postsLoading[obj[activeTab]] && !refreshing) {
      return <ActivityIndicator size="small" color="#fff" />;
    } else if (
      !hasMorePosts[obj[activeTab]] &&
      userPosts[obj[activeTab]].length > 0
    ) {
      return (
        <View style={{paddingVertical: responsiveHeight(1.5)}}>
          <Text
            style={{
              textAlign: 'center',
              color: '#fff',
              marginTop: responsiveHeight(1.5),
            }}>
            No more posts to show.
          </Text>
        </View>
      );
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  return (
    <View style={styles.container}>
      {activeTab !== 2 && (
        <View style={{flexDirection: 'row'}}>
          <View style={styles.profileContainer}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{
                  uri: userData.profileImage
                    ? `${userData.profileImage}?t=${new Date().getTime()}`
                    : 'https://pearlss4development.org/wp-content/uploads/2020/05/profile-placeholder.jpg',
                  cache: 'reload',
                }}
                style={styles.profileImage}
              />
            </View>

            <View style={styles.ownerInfoContainer}>
              <Text style={styles.ownerName}>
                {userData.name.length > 18
                  ? `${userData.name.slice(0, 18)}...`
                  : userData.name}
              </Text>
              <View style={styles.visibility}>
                <Text style={styles.visibleToOther}>
                  Visible to other users
                </Text>
                <Switch
                  trackColor={{false: '#fff', true: '#fff'}}
                  thumbColor={userData?.visibility ? '#008FFF' : '#008FFF'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={flag => toggleSwitch(flag)}
                  value={userData?.visibility}
                />
              </View>
              <View style={styles.locationContainer}>
                <Text style={styles.locationLabel}>You're at:</Text>
                <Text style={styles.locationInfo}>
                  {userData.address?.length > 30
                    ? `${userData.address.slice(0, 30)}...`
                    : userData.address}
                </Text>
              </View>
            </View>
          </View>
          <Pressable
            style={{position: 'absolute', top: 10, right: 10}}
            onPress={() => {
              navigation.navigate('Settings', {
                userData,
              });
            }}>
            <Ionicons name="ellipsis-vertical" color="#fff" size={20} />
          </Pressable>
        </View>
      )}
      <View style={styles.tabContainer}>
        <View style={styles.tabs}>
          {[0, 1, 2].map(tab => {
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  {
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: responsiveWidth(1),
                    width: responsiveWidth(16),
                  },
                ]}>
                <Text
                  style={[
                    activeTab === tab
                      ? styles.activeTabText
                      : styles.inactiveTabText,
                  ]}>
                  {obj[tab]}
                </Text>

                <View
                  style={[
                    activeTab === tab
                      ? styles.activeTabIndicator
                      : styles.inactiveTabIndicator,
                  ]}></View>
              </Pressable>
            );
          })}
        </View>
      </View>
      {(activeTab === 0 || activeTab === 1) && (
        <FlatList
          data={userPosts[obj[activeTab]]}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item, index}) =>
            activeTab === 0 ? (
              <TextCard
                postId={item._id}
                author={item.ownerDetails.name}
                time={item.createdAt}
                distance={20}
                content={item.text}
                likes={item.likes}
                comments={item.comments}
                profileImageUrl={item.ownerDetails.profileImage}
                post={item}
              />
            ) : (
              <ImageCard
                postId={item._id}
                author={item.ownerDetails.name}
                time={item.createdAt}
                distance={20}
                content={item.text}
                imageUrl={item.media.images[0]?.imageUrl}
                aspectRatio={item.media.images[0]?.aspectRatio}
                votecount={20}
                profileImageUrl={item.ownerDetails.profileImage}
                likes={item.likes}
                comments={item.comments}
                text={item.text}
                post={item}
              />
            )
          }
          ListEmptyComponent={() => (
            <EmptyList message="You have not posted yet.Start sharing!" />
          )}
          contentContainerStyle={{paddingBottom: 20}}
          ListFooterComponent={showLoader}
        />
      )}
      {activeTab === 2 && (
        <FlatList
          data={userPosts[obj[activeTab]]}
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={showLoader}
          ListEmptyComponent={() => (
            <EmptyList message="You have not posted yet.Start sharing!" />
          )}
        />
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appContainer.bg,
  },
  profileContainer: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1),
    flexDirection: 'row',
    gap: 6,
  },
  profileImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    borderRadius: responsiveWidth(12.5),
    marginRight: responsiveWidth(2),
  },
  ownerInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  ownerName: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Poppins-Medium',
    color: '#fff',
  },
  visibility: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
  },
  visibleToOther: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'Poppins-Regular',
    color: '#fff',
  },
  locationContainer: {
    flexDirection: 'column',
  },
  locationInfo: {
    fontSize: responsiveFontSize(1.7),

    fontFamily: 'Poppins-Regular',
    color: '#fff',
  },
  locationLabel: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'Poppins-Light',
    color: '#fff',
  },
  postsContainer: {
    flex: 1,
    paddingHorizontal: responsiveWidth(2),
    marginTop: responsiveHeight(1),
  },
  postItem: {
    width: (Dimensions.get('window').width - responsiveWidth(1)) / 3,
    height: responsiveWidth(28),
    margin: responsiveWidth(1),
    borderRadius: 8, // Optional for rounded corners
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width,
    backgroundColor: Colors.appContainer.bg,
    paddingTop: responsiveHeight(1.5),
  },
  tabs: {
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeTabText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Poppins-Medium',
    letterSpacing: 0,
  },
  inactiveTabText: {
    color: 'gray',
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Poppins-Medium',
    letterSpacing: 0,
  },
  activeTabIndicator: {
    borderBottomWidth: responsiveHeight(0.5),
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    width: responsiveWidth(16),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#008FFF',
  },
  inactiveTabIndicator: {
    borderBottomWidth: responsiveHeight(0.5),
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    width: responsiveWidth(16),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.appContainer.bg,
  },

  loader: {
    marginVertical: responsiveHeight(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
