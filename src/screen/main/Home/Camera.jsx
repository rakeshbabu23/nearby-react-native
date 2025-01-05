// import React, {useState, useRef} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Image,
//   Linking,
//   Alert,
//   Dimensions,
//   SafeAreaView,
//   StatusBar,
// } from 'react-native';
// import {Camera, useCameraDevice} from 'react-native-vision-camera';
// import {useCameraPermission} from 'react-native-vision-camera';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import {responsiveHeight} from 'react-native-responsive-dimensions';

// const {width, height} = Dimensions.get('window');

// const CameraScreen = ({route}) => {
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [isCameraActive, setIsCameraActive] = useState(false);
//   const [cameraType, setCameraType] = useState('back');
//   const [flashMode, setFlashMode] = useState('off');
//   const cameraRef = useRef(null);
//   const {hasPermission, requestPermission} = useCameraPermission();
//   const device = useCameraDevice(cameraType);

//   const takePhoto = async () => {
//     try {
//       if (cameraRef.current) {
//         const photo = await cameraRef.current.takePhoto({
//           qualityPrioritization: 'quality',
//           flash: flashMode,
//         });
//         setCapturedImage(photo.path);
//         setIsCameraActive(false);
//       }
//     } catch (error) {
//       console.error('Photo capture error:', error);
//     }
//   };

//   const toggleFlashMode = () => {
//     const flashModes = ['off', 'on', 'auto'];
//     const currentIndex = flashModes.indexOf(flashMode);
//     const nextIndex = (currentIndex + 1) % flashModes.length;
//     setFlashMode(flashModes[nextIndex]);
//   };

//   const toggleCameraType = () => {
//     setCameraType(cameraType === 'back' ? 'front' : 'back');
//   };

//   const handlePermission = async () => {
//     if (!hasPermission) {
//       const status = await requestPermission();
//       if (!status) {
//         Alert.alert('Permission Required', 'Camera access is needed', [
//           {
//             text: 'Open Settings',
//             onPress: () => Linking.openSettings(),
//           },
//         ]);
//         return;
//       }
//     }
//     setIsCameraActive(true);
//   };

//   const resetCapture = () => {
//     setCapturedImage(null);
//     setIsCameraActive(true);
//   };

//   if (!device)
//     return <Text style={styles.errorText}>No camera device found</Text>;

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />
//       <LinearGradient colors={['#1A1A2E', '#16213E']} style={styles.gradient}>
//         {!capturedImage && !isCameraActive && (
//           <View style={styles.landingContainer}>
//             <TouchableOpacity
//               style={styles.primaryButton}
//               onPress={handlePermission}>
//               <Icon name="camera" size={24} color="white" />
//               <Text style={styles.buttonText}>Open Camera</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {isCameraActive && hasPermission && (
//           <>
//             <Camera
//               ref={cameraRef}
//               style={styles.camera}
//               device={device}
//               isActive={true}
//               photo={true}
//             />
//             <View style={styles.controlsOverlay}>
//               <TouchableOpacity
//                 style={styles.iconButton}
//                 onPress={toggleCameraType}>
//                 <Icon name="camera-reverse" size={30} color="white" />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.iconButton}
//                 onPress={toggleFlashMode}>
//                 <Icon
//                   name={
//                     flashMode === 'off'
//                       ? 'flash-off'
//                       : flashMode === 'on'
//                       ? 'flash'
//                       : 'flash-outline'
//                   }
//                   size={30}
//                   color="white"
//                 />
//               </TouchableOpacity>
//             </View>
//             <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
//               <View style={styles.captureButtonInner} />
//             </TouchableOpacity>
//           </>
//         )}

//         {capturedImage && (
//           <View style={styles.previewContainer}>
//             <Image
//               source={{uri: `file://${capturedImage}`}}
//               style={styles.image}
//             />
//             <View style={styles.actionButtons}>
//               <TouchableOpacity
//                 style={styles.secondaryButton}
//                 onPress={resetCapture}>
//                 <Icon name="refresh" size={24} color="white" />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.secondaryButton}
//                 onPress={() => {
//                   /* Next screen or upload */
//                 }}>
//                 <Icon name="checkmark-outline" size={24} color="white" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       </LinearGradient>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1A1A2E',
//   },
//   gradient: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   landingContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: height * 0.8,
//   },
//   camera: {
//     height: height * 0.7,
//     width: width,
//   },
//   captureButton: {
//     position: 'absolute',
//     bottom: 30,
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 5,
//     borderColor: 'rgba(255,255,255,0.5)',
//   },
//   captureButtonInner: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: 'white',
//     borderWidth: 2,
//     borderColor: '#1A1A2E',
//   },
//   primaryButton: {
//     flexDirection: 'row',
//     backgroundColor: '#0F3460',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 20,
//   },
//   secondaryButton: {
//     flexDirection: 'row',
//     backgroundColor: '#533483',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginHorizontal: 10,
//   },
//   buttonText: {
//     color: 'white',
//     marginLeft: 10,
//     fontWeight: 'bold',
//   },
//   image: {
//     width: width,
//     height: height * 0.7,
//     resizeMode: 'cover',
//   },
//   previewContainer: {
//     alignItems: 'center',
//   },
//   actionButtons: {
//     marginTop: responsiveHeight(2),
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: 'white',
//     textAlign: 'center',
//     marginTop: 50,
//   },
//   controlsOverlay: {
//     flexDirection: 'row',
//     gap: 20,
//     position: 'absolute',
//     top: 20,
//     right: 20,
//   },
//   iconButton: {
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     borderRadius: 30,
//     padding: 10,
//     marginBottom: 10,
//   },
// });

// export default CameraScreen;

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Camera = () => {
  return (
    <View>
      <Text>Camera</Text>
    </View>
  )
}

export default Camera

const styles = StyleSheet.create({})