import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Chip = ({label, onPress, selected = false}) => {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.selectedChip]}
      onPress={onPress}>
      <Text style={[styles.text, selected && styles.selectedText]}>
        {label}
      </Text>
      {selected && <Ionicons name="checkmark-outline" size={18} color="#fff" />}
    </TouchableOpacity>
  );
};

export default Chip;

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#E0E0E0',
    borderRadius: responsiveWidth(12),
    paddingVertical: responsiveHeight(0.5),
    paddingHorizontal: responsiveWidth(4),
    alignSelf: 'flex-start',
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedChip: {
    backgroundColor: '#008FFF',
  },
  text: {
    color: '#000',
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
  },
  selectedText: {
    color: '#FFF',
  },
});
