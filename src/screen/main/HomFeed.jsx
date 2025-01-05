import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  LayoutAnimation,
  Platform,
  UIManager,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import SettingSvg from '../../components/svgs/SettingSvg';
import TextsView from '../../components/main/home/Texts/TextsView';
import ImagesView from '../../components/main/home/Images/ImageView';
import VideoView from '../../components/main/home/Videos/VideoView';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import useLocation from '../../hooks/useLocation';
import {
  getNearbyTags,
  userCurrentLocationInfo,
  userInfo,
} from '../../services/userService';
import Chip from '../../components/general/Chip';
import {useDispatch, useSelector} from 'react-redux';
import {
  setNearbyTags,
  setSelectedDistance,
  setSelectedTags,
} from '../../redux/postSlice';
import {setInformation} from '../../redux/userSlice';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../constants/Colors';
import Toast from 'react-native-toast-message';
import useSocket from '../../hooks/useSocket';
import {useFocusEffect} from '@react-navigation/native';
const obj = ['Texts', 'Images', 'Videos'];
// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Masonry Layout Component
const MasonryLayout = ({
  data,
  numColumns = 4,
  containerWidth = Dimensions.get('window').width,
  spacing = 8,
  renderItem,
}) => {
  const [columns, setColumns] = useState([[], []]);
  const [heights, setHeights] = useState([0, 0]);

  // Calculate column width dynamically
  const columnWidth =
    (containerWidth - (numColumns - 1) * spacing) / numColumns;

  useEffect(() => {
    // Configure layout animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    organizeData();
  }, [data]);

  const organizeData = () => {
    // Reset columns and heights
    const newColumns = Array(numColumns)
      .fill()
      .map(() => []);
    const newHeights = Array(numColumns).fill(0);

    // Distribute items among columns
    data.forEach(item => {
      // Find shortest column
      const shortestColumn = newHeights.indexOf(Math.min(...newHeights));

      // Add item to shortest column
      newColumns[shortestColumn].push(item);

      // Estimate height based on content type
      let itemHeight = 100; // Default height
      if (item.type === 'image' && item.aspectRatio) {
        itemHeight = columnWidth / item.aspectRatio;
      } else if (item.type === 'text') {
        // Estimate text height based on content length
        const lineHeight = 20;
        const padding = 16;
        const titleLines = Math.ceil(item.title.length / 15);
        const descLines = Math.ceil(item.description.length / 25);
        itemHeight = (titleLines + descLines) * lineHeight + padding * 2;
      }

      // Update column height
      newHeights[shortestColumn] += itemHeight + spacing;
    });

    setColumns(newColumns);
    setHeights(newHeights);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.masonry}>
        {columns.map((column, columnIndex) => (
          <View
            key={columnIndex}
            style={[
              styles.column,
              {
                width: columnWidth,
                marginLeft: columnIndex > 0 ? spacing : 0,
              },
            ]}>
            {column.map((item, index) => (
              <View key={item.id || index} style={{marginBottom: spacing}}>
                {renderItem ? renderItem(item) : null}
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// Sample Data Generator
const generateSampleData = (count = 4, {texts, images}) => {
  const categories = [
    'Technology',
    'Science',
    'Nature',
    'Philosophy',
    'Art',
    'Music',
    'Travel',
    'Food',
  ];
  //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
  const aspectRatios = [0.7, 0.8, 1, 1.2, 1.5, 1.6];
  let imageIndex = -1,
    textIndex = -1;
  return Array.from({length: count}, (_, index) => {
    let type = Math.random() > 0.4 ? 'image' : 'text';
    if (type === 'image') {
      if (imageIndex > images.length) {
        type = 'text';
      } else {
        imageIndex += 1;
      }
    } else {
      if (textIndex > texts.length) {
        type = 'image';
      } else {
        textIndex += 1;
      }
    }
    if (type === 'image') {
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      const aspectRatio =
        aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
      return {
        id: String(index + 1),
        type: 'image',
        uri: images[imageIndex].media.images[0].imageUrl,
        aspectRatio,
        title: images[imageIndex].text,
        category,
      };
    } else {
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      return {
        id: String(index + 1),
        type: 'text',
        title: `${category} Insights`,
        description: texts[textIndex].text,
        color: getRandomColor(),
      };
    }
  });
};

// Lorem text generator
const generateLoremText = () => {
  const sentences = [
    'Exploring the depths of human knowledge reveals countless mysteries.',
    'Innovation drives progress in unexpected ways.',
    'Nature holds secrets that continue to fascinate scientists.',
    'Art is a reflection of the human experience.',
    'Technology transforms our understanding of the world.',
    'Philosophical inquiry challenges our perception of reality.',
    'Creativity knows no bounds when imagination takes flight.',
  ];

  const sentenceCount = Math.floor(Math.random() * 3) + 2;
  return Array.from(
    {length: sentenceCount},
    () => sentences[Math.floor(Math.random() * sentences.length)],
  ).join(' ');
};

// Random color generator
const getRandomColor = () => {
  const colors = [
    '#F5E6D3', // Soft Beige
    '#E6F3E6', // Pale Green
    '#E6E6FA', // Lavender
    '#F0F8FF', // Alice Blue
    '#FFF0F5', // Lavender Blush
    '#F5F5DC', // Beige
    '#E0FFFF', // Light Cyan
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const dist = ['tenKm', 'twentyKm', 'fiftyKm'];
// Main App Component

export default function App() {
  // const [data, setData] = useState(generateSampleData(80));
  const socket = useSocket('http://3.111.55.237:3000');
  const {selectedTags, selectedDistance, nearbyTags} = useSelector(
    state => state.post,
  );
  const {address, userId} = useSelector(state => state.user);

  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [fetchLocationLoader, setFetchLocationLoader] = useState(false);
  const [status, setStatus] = useState('');
  const [tagsLoader, setTagsLoader] = useState(false);
  const bottomSheetRef = useRef(null);
  const renderItem = item => {
    if (item.type === 'image') {
      return (
        <View style={styles.imageContainer}>
          <Image
            source={{uri: item.uri}}
            style={[styles.image, {aspectRatio: item.aspectRatio}]}
            resizeMode="cover"
          />
          <Text style={styles.imageTitle}>{item.title}</Text>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          style={[styles.textCard, {backgroundColor: item.color}]}>
          <Text style={styles.textCardTitle}>{item.title}</Text>
          <Text style={styles.textCardDescription} numberOfLines={4}>
            {item.description}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const getUserInfo = async () => {
    try {
      setFetchLocationLoader(true);
      const response = await userInfo();
      const {data} = response.data;
      //setUserData({...data});
      dispatch(
        setInformation({
          name: data.name,
          email: data.email,
          address: data.address,
          visibility: data.visibility,
          profileImage: data.profileImage,
          location: data.location.coordinates,
        }),
      );
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'unknown error',
      });
      console.error('Error fetching user info:', error);
    } finally {
      setFetchLocationLoader(false);
    }
  };
  useEffect(() => {
    socket.emit('on_user_login', {userId});
  }, [userId]);
  useEffect(() => {
    getUserInfo();
  }, []);
  useEffect(() => {
    Toast.show({
      type: 'success',
      text1: 'Welcome',
      text2: 'Login successful',
    });
  }, []);
  // useEffect(() => {
  //   const getTags = async () => {
  //     try {
  //       const response = await getNearbyTags(selectedDistance);
  //       const {data} = response.data;
  //       dispatch(setNearbyTags(data));
  //       dispatch(setSelectedTags(data));
  //     } catch (error) {
  //       console.error('Error fetching tags:', error);
  //     }
  //   };
  //   getTags();
  // }, [selectedDistance]);

  const fetchTags = useCallback(async () => {
    try {
      setTagsLoader(true);
      const response = await getNearbyTags(selectedDistance);
      const {data} = response.data;
      dispatch(setNearbyTags(data));
      dispatch(setSelectedTags(data));
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'unknown error',
      });
      console.error('Error fetching tags:', error);
    } finally {
      setTagsLoader(false);
    }
  }, [dispatch, selectedDistance]);
  useFocusEffect(
    useCallback(() => {
      fetchTags();
    }, [fetchTags]),
  );

  const handleSelectedDistance = selectedDist => {
    dispatch(setSelectedDistance(selectedDist));
    //bottomSheetRef.current?.close();
  };
  const handleTag = tag => {
    dispatch(setSelectedTags({tag}));
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {activeTab !== 2 && (
        <View style={styles.cityNameContainer}>
          <Text style={styles.cityLabel}>You are at,</Text>
          {fetchLocationLoader && (
            <Text style={styles.cityNameLoaderText}>
              Fetching your location...
            </Text>
          )}
          {!fetchLocationLoader && (
            <Text style={styles.cityName}>
              {address?.length > 25 ? `${address.slice(0, 25)}...` : address}
            </Text>
          )}
        </View>
      )}

      <View style={styles.tabContainer}>
        <View style={styles.tabs}>
          {[0, 1, 2, 3].map(tab => {
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
        <Pressable
          style={styles.settingIcon}
          onPress={() => bottomSheetRef.current?.expand()}>
          <SettingSvg />
        </Pressable>
      </View>
      {activeTab === 10 && (
        <View style={styles.postsContainer}>
          <MasonryLayout
            data={data}
            numColumns={2}
            spacing={12}
            renderItem={renderItem}
          />
        </View>
      )}
      {activeTab === 0 && <TextsView />}
      {activeTab === 1 && <ImagesView />}
      {activeTab === 2 && <VideoView />}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['25%', '75%']}
        enablePanDownToClose={true}
        enableOverDrag={true}
        enableContentPanningGesture={false}
        backgroundStyle={styles.bottomSheetBackground}
        handleComponent={() => (
          <View style={styles.handleContainer}>
            <View style={styles.handleIndicator} />
          </View>
        )}>
        <BottomSheetView style={styles.bottomSheetContainer}>
          <View style={styles.distanceContainer}>
            {dist.map(d => {
              return (
                <Chip
                  label={d}
                  key={d}
                  onPress={() => handleSelectedDistance(d)}
                  selected={selectedDistance === d}
                />
              );
            })}
          </View>
          <View style={styles.tagsContainer}>
            <Text style={styles.nearByText}>Nearby Tags</Text>
            {tagsLoader ? (
              <View style={styles.tagsLoadingContainer}>
                <ActivityIndicator size={'large'} color="#008800" />
                <Text style={styles.tagsLoaderText}>Please wait...</Text>
              </View>
            ) : (
              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
                horizontal={false}>
                <View style={styles.tags}>
                  {nearbyTags.length < 1 ? (
                    <View style={styles.noTagsTextContainer}>
                      <Text style={styles.noTagsText}>No tags found.</Text>
                    </View>
                  ) : (
                    nearbyTags.map(tag => {
                      return (
                        tag && (
                          <Chip
                            label={tag}
                            key={tag}
                            onPress={() => handleTag(tag)}
                            selected={selectedTags.includes(tag)}
                          />
                        )
                      );
                    })
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  bottomSheetContainer: {
    flex: 1,
  },
  masonry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  cityNameContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 5,
  },
  cityLabel: {
    fontSize: responsiveFontSize(2),
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
  cityNameLoaderText: {
    fontSize: responsiveFontSize(2.5),
    color: '#ffffff',
    fontFamily: 'Poppins-Regular',
  },
  cityName: {
    fontSize: responsiveFontSize(2.5),
    color: '#fff',
    fontFamily: 'Playwrite-Regular',
  },
  // Image Styles
  imageContainer: {
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: undefined,
  },
  imageTitle: {
    padding: 8,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
    //position: "absolute",
    bottom: 0,
    color: '#333',
  },

  // Text Card Styles
  textCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  textCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    fontFamily: 'Poppins-Medium',
  },
  textCardDescription: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.appContainer.bg,
  },
  container: {
    flex: 0.1,
    backgroundColor: Colors.appContainer.bg,
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
  settingIcon: {
    transform: [{scale: 1.0}],
    marginRight: responsiveWidth(1.5),
  },
  postsContainer: {
    flex: 1,

    paddingHorizontal: 5,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    margin: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  text: {
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
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
  distanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nearByText: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Poppins-Medium',
    color: '#000',
    marginBottom: responsiveHeight(1),
    textAlign: 'center',
  },
  tagsContainer: {
    marginVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(4),
    //minHeight: responsiveHeight(5),
  },
  tags: {
    // minHeight: responsiveHeight(5),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tagsLoadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: responsiveHeight(4),
    gap: 10,
  },
  tagsLoaderText: {
    fontSize: responsiveFontSize(2.5),
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  noTagsTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
  noTagsText: {
    fontSize: responsiveFontSize(2),
    color: '#333',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginVertical: responsiveHeight(4),
  },
});
