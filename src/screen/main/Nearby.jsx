import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import LottieView from 'lottie-react-native';
import BottomSheet, {
  BottomSheetView,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from '@gorhom/bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {nearbyPeople} from '../../services/userService';
import {setNearbyPeople} from '../../redux/userSlice';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Colors} from '../../constants/Colors';
import Chats from './Chats';
import Chip from '../../components/general/Chip';
import Toast from 'react-native-toast-message';
const ranges = ['twoKm', 'fiveKm', 'tenKm', 'twentyKm', 'fiftyKm', 'hundredKm'];
const positions = [
  [600, 280],
  [360, 150],
  [500, 350],
  [500, 100],
  [350, 300],
];
const dist = ['tenKm', 'twentyKm', 'fiftyKm'];

const Nearby = () => {
  const {userId} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const bottomSheetRef = useRef(null);
  const userData = useSelector(state => state.user.nearbyPeople);
  const lottieRef = useRef(null);
  const [fetchingPeopleLoader, setFetchingPeopleLoader] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState(dist[0]);
  const [people, setPeople] = useState([]);
  const [range, setRange] = useState(ranges[2]);

  useEffect(() => {
    async function getNearByPeople() {
      try {
        setFetchingPeopleLoader(true);
        const response = await nearbyPeople(range);
        const {data} = response.data;
        dispatch(setNearbyPeople(data));
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error?.response?.data?.message || 'unknown error',
        });
        console.error('Error fetching posts:', error);
      } finally {
        setFetchingPeopleLoader(false);
      }
    }
    getNearByPeople();
  }, [selectedDistance]);
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: Colors.appContainer.bg,
          position: 'relative',
        }}
        bounces={false}>
        <View style={styles.container}>
          <View style={styles.timelineContainer}>
            <Text style={styles.timeline} numberOfLines={2}>
              People within your radius of{' '}
            </Text>
            <Pressable
              onPress={() => bottomSheetRef.current?.expand()}
              style={styles.timeDropdown}>
              <Text style={styles.timeline}>{selectedDistance}</Text>
              <Text>
                <Entypo name="chevron-small-down" size={24} color="#fff" />
              </Text>
            </Pressable>
          </View>
          <View style={styles.animationContainer}>
            <LottieView
              ref={lottieRef}
              source={require('../../../assets/animation/Animation - 1732626583794.json')}
              style={styles.animation}
              autoPlay
              loop
            />
          </View>

          {userData.slice(0, 5).map((user, index) => (
            <Pressable
              key={user._id}
              style={{
                position: 'absolute',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 3,
                top: Dimensions.get('window').height - positions[index][0],
                right: Dimensions.get('window').width - positions[index][1],
              }}>
              <Image
                source={{
                  uri: user?.receiverDetails?.profileImage
                    ? user.receiverDetails.profileImage
                    : 'https://pearlss4development.org/wp-content/uploads/2020/05/profile-placeholder.jpg',
                }}
                style={styles.userImage}
              />
              <View style={styles.nameContainer}>
                <Text style={styles.userName}>
                  {user?.receiverDetails?.name.length >= 7
                    ? `${user?.receiverDetails?.name.slice(0, 5)}..`
                    : user.receiverDetails.name}
                </Text>
              </View>
            </Pressable>
          ))}
          {userData.length > 5 && (
            <View style={styles.arrowContainer}>
              <Ionicons name="chevron-up-outline" color="#fff" size={35} />
              <Text style={styles.arrowText}>
                Scroll up to view all {userData.length} people
              </Text>
            </View>
          )}
          {userData.length < 1 && (
            <View style={styles.arrowContainer}>
              <Ionicons name="chevron-up-outline" color="#fff" size={35} />
              <Text style={styles.arrowText}>
                No one’s here yet. Share your thoughts about the app with
                others!
              </Text>
            </View>
          )}
        </View>

        <Chats userData={userData} screenName="nearby" />
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['15%']}
        handleComponent={null}
        backgroundStyle={styles.bottomSheetBackground}
        enablePanDownToClose={true}
        enableOverDrag={true}
        enableContentPanningGesture={false}
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
                  onPress={() => setSelectedDistance(d)}
                  selected={selectedDistance === d}
                />
              );
            })}
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default Nearby;

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height - 60,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  animationContainer: {
    flexDirection: 'column',
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  timelineContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    marginRight: responsiveWidth(1),
    marginBottom: responsiveHeight(1),
  },
  timeDropdown: {
    flexDirection: 'row',
  },
  timeline: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    fontSize: responsiveFontSize(2),
  },
  morePeopleContainer: {
    flexDirection: 'row',
    paddingLeft:
      Dimensions.get('window').width - (Dimensions.get('window').width - 40),
    alignItems: 'center',
    alignContent: 'center',
    paddingBottom: 50,
    backgroundColor: Colors.appContainer.bg,
  },
  morePeople: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
  },
  nameContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    paddingHorizontal: responsiveWidth(1),
    paddingVertical: responsiveHeight(0.2),
    borderRadius: 20,
  },
  userName: {
    color: '#000',
    fontSize: responsiveFontSize(1),
    fontFamily: 'Poppins-Regular',
    textTransform: 'capitalize',
  },
  morePeopleText: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
  initial: {
    fontSize: responsiveFontSize(3),
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 60,

    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.4),
    fontFamily: 'Poppins-Regular',
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
});
