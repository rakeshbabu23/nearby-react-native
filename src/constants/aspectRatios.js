import {Dimensions} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');

export const getAspectRatioHeight = ratio => {
  const ratioMap = {
    '1:1': screenWidth,
    '4:5': screenWidth * (5 / 4),
    4.5: screenWidth * (4.5 / 4),
    1.1: screenWidth * (1.1 / 4),
    '1.91:1': screenWidth / 1.9,
    '9:16': screenWidth * (16 / 9),
  };
  return ratioMap[ratio] || screenWidth;
};
