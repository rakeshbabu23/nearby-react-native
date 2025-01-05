import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Alert,
  Image,
  TextInput,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
  Modal,
} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomSheet, {
  BottomSheetView,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from '@gorhom/bottom-sheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Video from 'react-native-video';
import {
  addMedia,
  removeMedia,
  setDiscardMedia,
  setPostStatus,
} from '../../redux/postSlice';
import {createPost} from '../../services/postService';
import useKeyboard from '../../hooks/useKeyboard';
import {Colors} from '../../constants/Colors';
import Toast from 'react-native-toast-message';

const getGCD = (a, b) => {
  if (!b) return a;
  return getGCD(b, a % b);
};

const Post = () => {
  const dispatch = useDispatch();
  const postStore = useSelector(state => state.post);
  const {isKeyboardOpen} = useKeyboard();
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);
  const postInputRef = useRef(null);
  const tagInputRef = useRef(null);

  const [deadline, setDeadline] = useState({label: '1 day', value: 24});
  const [postText, setPostText] = useState('');
  const [postTagText, setPostTagText] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [postTags, setPostTags] = useState([]);
  const [discardPost, setDiscardPost] = useState(false);

  const handleCreateTag = () => {
    // Trim the tag and ensure it's not empty
    const trimmedTag = postTagText.trim();
    if (trimmedTag && !postTags.includes(trimmedTag)) {
      setPostTags([trimmedTag, ...postTags]);
      setPostTagText(''); // Clear the input
      // Keep keyboard open
      tagInputRef.current?.focus();
    }
  };

  const removeTag = tagToRemove => {
    setPostTags(postTags.filter(tag => tag !== tagToRemove));
  };

  const handleCameraPermission = async mediaType => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA;
      const result = await check(permission);
      if (result == RESULTS.GRANTED) {
        handleLaunchCamera(mediaType);
      } else {
        const askCameraPermission = await request(permission);
        if (askCameraPermission === RESULTS.GRANTED) {
          handleLaunchCamera(mediaType);
        } else if (askCameraPermission === RESULTS.DENIED) {
          Alert.alert(
            'Permission Denied',
            'You need to allow camera permissions to use camera',
          );
        } else if (askCameraPermission === RESULTS.BLOCKED) {
          Alert.alert(
            'Permission Denied',
            'You need to allow camera permissions to use camera',
          );
        }
      }
    } catch (error) {
      Alert.alert(
        'Permission Denied',
        'You need to allow camera permissions to use camera',
      );
    }
  };

  const handleLaunchCamera = mediaType => {
    launchCamera({mediaType}, response => {
      if (response.didCancel) {
    
      } else if (response.errorMessage) {
        Alert.alert('Camera Error', response.errorMessage);
      } else {
        const {uri, height, width} = response.assets[0];
        const gcd = getGCD(width, height);
        const widthRatio = width / gcd;
        const heightRatio = height / gcd;
        dispatch(
          addMedia([
            {
              id: `${postStore.media.length + 1}`,
              uri,
              aspectRatio: `${widthRatio}:${heightRatio}`,
              type: mediaType,
            },
          ]),
        );
      }
    });
  };
  const selectImage = async () => {
    const options = {
      mediaType: 'mixed',
      selectionLimit: 3 - postStore.media.length,
    };
    launchImageLibrary(options, response => {
      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.didCancel) {
        return;
      } else {
        let count = {
          images: 0,
          videos: 0,
        };
        response.assets.forEach(media => {
          if (media.type.startsWith('video')) {
            count.videos = count.videos + 1;
          } else {
            count.images = count.images + 1;
          }
        });
        if (count.images > 0 && count.videos > 0) {
          Alert.alert('Error', 'You can select upto 3 images or 1 video');
          return;
        }
        if (count.images < 1 && count.videos > 1) {
          Alert.alert('Error', 'You can select upto 1 video');
          return;
        }

        let postCount = postStore.media.length;
        const selectedImages = response.assets.map(image => {
          const gcd = getGCD(image.width, image.height);
          const widthRatio = image.width / gcd;
          const heightRatio = image.height / gcd;
          postCount += 1;
          return {
            id: postCount,
            uri: image.uri,
            aspectRatio: `${image.width}:${image.height}`,
            type: 'image',
          };
        });
        dispatch(addMedia(selectedImages));
      }
    });
  };
  const removeImage = imageUri => {
    dispatch(removeMedia(imageUri));
  };

  const handleItemSelect = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const items = [
    {label: '1 day', value: 24},
    {label: '2 days', value: 48},
    {label: '1 week', value: 168},
  ];

  useFocusEffect(
    useCallback(() => {
      bottomSheetRef.current?.close();
      postInputRef.current?.focus();
    }, []),
  );
  const handlePost = async () => {
    if (!postText && postStore.media.length < 1) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append('expiresIn', deadline.value);
      formData.append('text', postText);
      formData.append('tags', postTags);
      postStore.media.forEach((file, index) => {
        const extension = file.uri.split('.').pop();
        let mimeType = '';

        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
          mimeType = 'image/jpeg';
        } else if (['mp4', 'mov', 'avi'].includes(extension)) {
          mimeType = 'video/mp4';
        }

        formData.append('files', {
          uri: file.uri,
          type: mimeType,
          name: `file_${index}.${extension}`,
        });
        if (mimeType !== 'video/mp4') {
          formData.append(`aspectRatio_${index}`, file.aspectRatio);
        }
      });
      dispatch(setPostStatus('loading'));
      navigation.goBack();
      const response = await createPost(formData);
      dispatch(setDiscardMedia());
      dispatch(setPostStatus('completed'));
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'unknown error',
      });
      console.error(error);
    } finally {
      dispatch(setPostStatus('completed'));
    }
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.appContainer.bg}}>
        <StatusBar barStyle={'light-content'} />
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="close-outline" size={34} color="#fff" />
          </Pressable>
          <Pressable
            style={[
              !postText && postStore.media.length < 1
                ? styles.disabledPostbutton
                : styles.postButton,
            ]}
            onPress={handlePost}>
            <Text style={styles.postButtonText}>Post</Text>
          </Pressable>
        </View>
        <KeyboardAwareScrollView>
          <ScrollView
            showsVerticalScrollIndicator={true}
            horizontal={false}
            contentContainerStyle={styles.scrollContainer}>
            <View style={styles.timelineContainer}>
              <Text style={styles.timeline}>When should the post expire?</Text>
              <Pressable
                onPress={() => bottomSheetRef.current?.expand()}
                style={styles.timeDropdown}>
                <Text style={styles.timeline}>{deadline.label}</Text>
                <Text>
                  <Entypo name="chevron-small-down" size={24} color="#fff" />
                </Text>
              </Pressable>
            </View>
            {/* Tag Input Section */}
            <Text style={styles.postTagsLabel}>
              Enter some tags to describe your post
            </Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                ref={tagInputRef}
                value={postTagText}
                onChangeText={setPostTagText}
                style={styles.postTagInput}
                placeholder="Add tags"
                onSubmitEditing={handleCreateTag}
                returnKeyType="done"
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tagChipsContainer}>
                {postTags.map((tag, index) => (
                  <View key={index} style={styles.tagChip}>
                    <Text style={styles.tagChipText}>{tag}</Text>
                    <TouchableOpacity onPress={() => removeTag(tag)}>
                      <Icon name="close" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Post Input */}
            <TextInput
              ref={postInputRef}
              value={postText}
              onChangeText={setPostText}
              multiline={true}
              style={styles.postInput}
              placeholder="What's on your mind?"
            />

            {/* Selected Media */}
            <ScrollView
              contentContainerStyle={styles.selectedImagesContainer}
              horizontal>
              {postStore.media.map((media, index) => (
                <View key={index} style={styles.selectedImageWrapper}>
                  {media.uri.endsWith('.jpg') || media.uri.endsWith('.png') ? (
                    <>
                      <Image
                        source={{uri: media.uri}}
                        style={styles.selectedImages}
                      />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(media.uri)}>
                        <Icon name="close" size={20} color="white" />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Video
                        source={{uri: media.uri}}
                        style={styles.videoPreview}
                        resizeMode="cover"
                        repeat={false}
                        paused={true}
                        controls
                        hideForward={true}
                        focusable={false}
                        controlsStyles={{
                          hidePlayPause: false,
                          hideForward: true,
                          hideRewind: true,
                          hideDuration: false,
                        }}
                      />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(media.uri)}>
                        <Icon name="close" size={20} color="white" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              ))}
            </ScrollView>
          </ScrollView>
        </KeyboardAwareScrollView>

        {/* Action Buttons */}
        {!isKeyboardOpen &&
          postStore &&
          postStore.media &&
          postStore.media.length < 3 && (
            <View style={styles.actionContainer}>
              <View style={styles.bottom}>
                {/* Allow adding images if no video is selected */}
                {!postStore.isVideoSelected && postStore.media.length < 3 && (
                  <>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={selectImage}>
                      <Icon name="image" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => handleCameraPermission('photo')}>
                      <Icon name="camera" size={20} color="#fff" />
                    </TouchableOpacity>
                  </>
                )}

                {/* Allow adding a video only if there are no images */}
                {postStore.media.length === 0 && !postStore.isVideoSelected && (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleCameraPermission('video')}>
                    <Icon name="videocam" size={20} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        {/* Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={['25%']}
          handleComponent={null}
          backgroundStyle={styles.bottomSheetBackground}>
          <BottomSheetView style={styles.bottomSheetContainer}>
            {items.map((item, index) => (
              <Pressable
                key={index}
                style={styles.item}
                onPress={() => {
                  handleItemSelect();
                  setDeadline({label: item.label, value: item.value});
                }}>
                <Text style={styles.itemText}>{item.label}</Text>
              </Pressable>
            ))}
          </BottomSheetView>
        </BottomSheet>
        {/* {discardPost && (
          <Modal animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.discardContainer}>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.discardText}>
                    Are you sure you want to discard this post?
                  </Text>
                  <View style={styles.actionsContainer}>
                    <Pressable
                      style={styles.discardButton}
                      onPress={() => setDiscardPost(false)}>
                      <Text style={styles.discardButtonText}>No</Text>
                    </Pressable>
                    <Pressable
                      style={styles.discardButton}
                      onPress={() => {
                        console.log('yesssssssssssssss');
                        dispatch(setDiscardMedia());
                        setDiscardPost(false);
                      }}>
                      <Text style={styles.discardButtonText}>Yes</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        )} */}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(2),
    marginVertical: responsiveHeight(1),
  },
  postTagsLabel: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveHeight(0.5),
  },
  timelineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  postButton: {
    backgroundColor: '#38BDF8',
    paddingVertical: responsiveHeight(0.5),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: responsiveWidth(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledPostbutton: {
    backgroundColor: '#0891B2',
    paddingVertical: responsiveHeight(0.5),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: responsiveWidth(8),
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  postButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  bottomSheetBackground: {
    backgroundColor: 'black',
  },
  bottomSheetContainer: {
    flex: 1,
    padding: responsiveWidth(5),
  },
  item: {
    paddingVertical: responsiveHeight(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  itemText: {
    color: 'white',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Poppins-Medium',
  },
  textInput: {
    color: 'black',
    fontSize: responsiveFontSize(2),
  },
  scrollContainer: {
    flex: 1,
    marginVertical: 10,
    paddingHorizontal: responsiveWidth(2),
  },
  bottom: {
    // position: 'absolute',
    // bottom: 0,
    // left: Dimensions.get('window').width - 60,
    // height: responsiveHeight(8),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2),
    // backgroundColor: '#f2f2f2',
  },

  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  previewContainer: {
    alignItems: 'center',
  },
  actionButtons: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    //paddingVertical: responsiveHeight(2),
    //backgroundColor: 'rgba(0,0,0,0.5)',
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
  },
  selectedImages: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: responsiveWidth(2),
  },
  selectedImagesContainer: {
    height: Dimensions.get('window').width * 0.8,
    marginVertical: 'auto',
    paddingHorizontal: responsiveWidth(2),
  },
  postInput: {
    color: '#fff',
    fontSize: responsiveFontSize(2.5),
    paddingHorizontal: responsiveWidth(2),
  },
  postTagInput: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    paddingHorizontal: responsiveWidth(2),
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: responsiveHeight(1),
    borderRadius: 10,
  },
  tagInputContainer: {
    marginBottom: responsiveHeight(2),
  },
  tagChipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#38BDF8',
    borderRadius: 20,
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.5),
    marginRight: responsiveWidth(2),
  },
  tagChipText: {
    color: 'white',
    marginRight: responsiveWidth(1),
  },
  selectedImageWrapper: {
    position: 'relative',
    marginRight: responsiveWidth(2),
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
  videoPreview: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: WINDOW_WIDTH,
  },
  discardContainer: {
    position: 'absolute',
    top: WINDOW_HEIGHT * 0.3,
    height: responsiveHeight(15),
    width: WINDOW_WIDTH * 0.7,
    //backgroundColor: 'red',
    padding: 10,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discardText: {
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveHeight(2),
    textAlign: 'center',
    color: '#fff',
  },
  discardButton: {
    backgroundColor: '#000',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: 5,
    marginBottom: 10,
    width: '45%',
  },
  discardButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default Post;
