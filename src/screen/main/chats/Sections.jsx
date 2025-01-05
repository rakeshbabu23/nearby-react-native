import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Colors} from '../../../constants/Colors';

const Sections = ({activeTab, setActiveTab}) => {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setActiveTab(0)}
        style={[
          {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: responsiveWidth(1),
            width: '50%',
          },
        ]}>
        <Text
          style={[
            activeTab === 0 ? styles.activeTabText : styles.inactiveTabText,
          ]}>
          People
        </Text>
      </Pressable>
      <Pressable
        onPress={() => setActiveTab(1)}
        style={[
          {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: responsiveWidth(1),
            width: '50%',
          },
        ]}>
        <Text
          style={[
            activeTab === 1 ? styles.activeTabText : styles.inactiveTabText,
          ]}>
          Chats
        </Text>
      </Pressable>
    </View>
  );
};

export default Sections;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: Colors.appContainer.bg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  heading: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'Poppins-SemiBold',
    color: '#fff',
    textAlign: 'center',
  },
  action: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderBottomWidth: responsiveHeight(0.5),
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  tint: {
    borderBottomWidth: responsiveHeight(0.5),
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  selected: {
    borderColor: '#fff',
  },
  unselected: {
    borderColor: Colors.appContainer.bg,
  },
  activeTabText: {
    color: '#fff',
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'Poppins-Medium',
    letterSpacing: 0,
  },
  inactiveTabText: {
    color: '#aaa',
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'Poppins-Medium',
    letterSpacing: 0,
  },
  activeTabIndicator: {
    borderBottomWidth: responsiveHeight(0.5),
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
  },
  inactiveTabIndicator: {
    borderBottomWidth: responsiveHeight(0.5),
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.appContainer.bg,
  },
});
