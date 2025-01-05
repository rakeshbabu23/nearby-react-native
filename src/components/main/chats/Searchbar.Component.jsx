import {StyleSheet, Text, View, TextInput} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

// const Searchbar = ({ value, setFocused, additionalStyles, action }) => {
//   return (
//     <View>
//       <TextInput
//         value={value}
//         onChange={action}
//         onFocus={setFocused(true)}
//         onBlur={setFocused(false)}
//         numberOfLines={1}
//         multiline={false}
//         style={[styles.container]}
//       />
//     </View>
//   );
// };

// export default Searchbar;

// const styles = StyleSheet.create({
//   container: {
//     //flex: 1,
//     paddingHorizontal: responsiveWidth(4),
//     paddingVertical: responsiveHeight(5),
//     backgroundColor: "#fff",
//     color: "#000",
//     borderRadius: responsiveWidth(10),
//     fontSize: responsiveFontSize(2),
//     height: "100%",
//     borderWidth: 2,
//     borderColor: "#000",
//   },
//   inputFocused: {
//     borderWidth: 1,
//     borderColor: "#000",
//   },
// });
const Searchbar = ({value, action, additionalStyles, setFocused}) => {
  return (
    <View>
      <TextInput
        value={value}
        onChangeText={action} // Use prop directly
        numberOfLines={1}
        multiline={false}
        style={[styles.container, additionalStyles]}
        placeholder="Search..."
        placeholderTextColor="#888"
        // onFocus={() => setFocused(true)} // Handle focus state
        // onBlur={() => setFocused(false)} // Handle blur state
      />
    </View>
  );
};

export default Searchbar;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.5),
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: responsiveWidth(10),
    fontSize: responsiveFontSize(2),
    borderWidth: 1,
    borderColor: '#000',
  },
  inputFocused: {
    borderWidth: 1,
    borderColor: '#000',
  },
});
