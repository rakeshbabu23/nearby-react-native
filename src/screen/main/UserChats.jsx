import {StyleSheet, View, FlatList, Text} from 'react-native';
import React, {useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import ChatItem from '../../components/main/chats/ChatItem.Component';
import {getChats} from '../../services/userService';
import {setChats} from '../../redux/chatSlice';
import {Colors} from '../../constants/Colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useFocusEffect} from '@react-navigation/native';
import EmptyList from '../../components/general/EmptyList';

const UserChats = ({screenName}) => {
  const {chats} = useSelector(state => state.chat); // Get chats from Redux store
  const dispatch = useDispatch(); // Access Redux dispatch function
  const fetchChats = useCallback(async () => {
    const response = await getChats();
    const {data} = response.data;
    dispatch(setChats(data)); // Correctly dispatching to Redux
  }, [dispatch]);
  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, [fetchChats]),
  );

  const EmptyChats = () => {
    return (
      <View
        style={{
          flex: 1,
          height: responsiveHeight(80),
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: responsiveFontSize(2),
            color: '#fff',
            fontFamily: 'Poppins-Regular',
          }}>
          Looks quiet here—send a message and brighten the space!
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.appContainer.bg,
        paddingRight: 10,
      }}>
      <Text style={styles.chatsHeading}>Your chats</Text>
      <FlatList
        data={chats}
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => (
          <ChatItem
            name={item.receiverDetails.name}
            profileImage={item.receiverDetails.profileImage}
            lastMessage={item.lastMessage}
            time={item.createdAt}
            unreadCount={item.unreadCount || 0}
            screenName={screenName}
            item={item}
          />
        )}
        ListEmptyComponent={EmptyChats}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        bounces={false}
        nestedScrollEnabled={true}
        onTouchStart={e => e.stopPropagation()}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default UserChats;

const styles = StyleSheet.create({
  flatListContainer: {
    paddingTop: 10,
  },
  chatsHeading: {
    fontSize: responsiveFontSize(3),
    fontFamily: 'Poppins-SemiBold',
    paddingHorizontal: responsiveWidth(2),
    marginVertical: responsiveHeight(1),
    color: '#fff',
  },
});
