import React from 'react';
import {View, Text, Dimensions} from 'react-native';

// Color palette
const COLORS = {
  errorBackground: '#FEF3F2',
  errorBorder: '#D92D20',
  errorText: '#D92D20',
  successBackground: '#ECFDF3',
  successBorder: '#12B76A',
  successText: '#067647',
  deleteBackground: '#FEF3F2',
  deleteBorder: '#D92D20',
  deleteText: '#D92D20',
  white: '#FFFFFF',
};

// Shared toast styles
const baseToastStyle = {
  position: 'absolute',
  left: '5%',
  right: '5%',
  bottom: 100,
  height: 52,
  padding: 10,
  borderRadius: 8,
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
};

const baseTextStyle = {
  fontSize: 12,
  fontWeight: '600',
};

const toastConfig = {
  error: ({text1, text2}) => (
    <View
      style={{
        ...baseToastStyle,
        backgroundColor: COLORS.errorBackground,
        borderColor: COLORS.errorBorder,
        borderWidth: 1,
        top: -Dimensions.get('window').height + 50,
      }}>
      {text1 && (
        <Text style={{...baseTextStyle, color: COLORS.errorText}}>{text1}</Text>
      )}
      {text2 && (
        <Text style={{color: COLORS.errorText, marginTop: 4}}>{text2}</Text>
      )}
    </View>
  ),

  success: ({text1, text2}) => (
    <View
      style={{
        ...baseToastStyle,
        backgroundColor: COLORS.successBackground,
        borderColor: COLORS.successBorder,
        borderWidth: 1,
        top: -Dimensions.get('window').height + 50,
      }}>
      {text1 && (
        <Text style={{...baseTextStyle, color: COLORS.successText}}>
          {text1}
        </Text>
      )}
      {text2 && (
        <Text style={{color: COLORS.successText, marginTop: 4}}>{text2}</Text>
      )}
    </View>
  ),

  delete: ({text1, text2}) => (
    <View
      style={{
        ...baseToastStyle,
        backgroundColor: COLORS.deleteBackground,
        borderColor: COLORS.deleteBorder,
        borderWidth: 1,
        bottom: -50,
      }}>
      {text1 && (
        <Text style={{...baseTextStyle, color: COLORS.deleteText}}>
          {text1}
        </Text>
      )}
      {text2 && (
        <Text style={{color: COLORS.deleteText, marginTop: 4}}>{text2}</Text>
      )}
    </View>
  ),
};

export default toastConfig;
