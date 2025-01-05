import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
let windowWidth;
const ImagePost = () => {
  windowWidth = Dimensions.get('window').width;
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../../assets/images/Rectangle-884.png')}
        resizeMethod="contain"
        style={styles.image}>
        <Text style={styles.author}>Rakesh</Text>
      </ImageBackground>
    </View>
  );
};

export default ImagePost;

const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(30),
    width: (Dimensions.get('window').width * 0.95) / 2,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  image: {
    flex: 1,
    width: (Dimensions.get('window').width * 0.95) / 2,
    marginBottom: responsiveHeight(1),
  },
  content: {
    fontSize: responsiveWidth(1.2),
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  author: {
    fontSize: responsiveWidth(5),
    color: '#000',
    fontFamily: 'Poppins-Medium',
  },
});
