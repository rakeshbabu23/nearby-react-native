import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Dimensions,
  Animated,
} from 'react-native';
import React, {useState, useRef} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useDispatch} from 'react-redux';
import {addMedia} from '../../redux/postSlice';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const screenWidth = Dimensions.get('window').width; // Full screen width

const aspectRatios = [
  {width: 4, height: 5, label: '4:5'},
  {width: 1, height: 1, label: '1:1'},
  {width: 1.91, height: 1, label: '1.91:1'},
  {width: 9, height: 16, label: '9:16'},
];

const ImagePost = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {imagePaths, aspectRatios: selectedAspectRatios} = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [selectedAspectRatio, setSelectedAspectRatio] = useState(
    aspectRatios[0],
  );
  const [croppedImages, setCroppedImages] = useState([...imagePaths]);
  const [finalImages, setFinalImages] = useState(
    imagePaths.map((imagePath, index) => ({
      id: index + 1,
      uri: imagePath,
      flag: false,
    })),
  );
  // Update current index based on scroll position
  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX}}}],
    {useNativeDriver: false},
  );

  const handleMomentumScrollEnd = event => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(index);
  };

  const handleAspectRatioSelect = async (aspectRatio, index) => {
    // setSelectedAspectRatio(aspectRatio);
    try {
      const croppedImage = await ImagePicker.openCropper({
        path: croppedImages[index],
        width: aspectRatio.width * 500,
        height: aspectRatio.height * 500,
        cropping: true,
      });

      const updatedCroppedImages = [...croppedImages];
      updatedCroppedImages[index] = croppedImage.path;
      setCroppedImages(updatedCroppedImages);

      const updatedFinalImages = finalImages.map((item, idx) => {
        if (idx === index) {
          return {
            id: index + 1,
            uri: croppedImage.path,
            flag: true,
            aspectRatio: aspectRatio,
          };
        }
        return item;
      });
      setFinalImages(updatedFinalImages);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'unknown error',
      });
      console.error('Cropping failed:', error);
    }
  };

  const renderImages = ({item, index}) => {
    return (
      <View style={[styles.imageContainer, {width: screenWidth}]}>
        <Image source={{uri: croppedImages[index]}} style={styles.image} />
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Pressable>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            dispatch(addMedia(finalImages));
            navigation.goBack();
          }}>
          <Text style={styles.nextButtonText}>Done</Text>
        </Pressable>
      </View>
      <Animated.FlatList
        data={croppedImages}
        renderItem={renderImages}
        keyExtractor={(item, index) => String(index)}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{backgroundColor: '#000'}}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      />
      {finalImages.map((finalImage, index) => {
        if (index === currentIndex && !finalImage.flag) {
          return (
            <View key={index} style={styles.aspectRatiosContainer}>
              {aspectRatios.map(aspectRatio => (
                <Pressable
                  key={aspectRatio.label}
                  style={[
                    styles.aspectRatioButton,
                    selectedAspectRatio.label === aspectRatio.label &&
                      styles.selectedAspectRatioButton,
                  ]}
                  onPress={() => handleAspectRatioSelect(aspectRatio, index)}>
                  <Text style={styles.aspectRatioText}>
                    {aspectRatio.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          );
        }
        return null;
      })}
    </View>
  );
};

export default ImagePost;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  aspectRatiosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  aspectRatioButton: {
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(5),
    backgroundColor: '#000',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  aspectRatioText: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
    color: '#fff',
  },
  imageContainer: {
    // flex: 1,
    width: '100%',
    backgroundColor: 'blue',
  },
  image: {
    flex: 1,
    width: '100%',
    // height: '70%',
    resizeMode: 'contain',
  },
  nextButtonText: {
    color: '#000',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(2),
    marginVertical: responsiveHeight(2),
  },
});
