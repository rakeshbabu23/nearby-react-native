import {StyleSheet, View, FlatList} from 'react-native';
import React from 'react';

import ChatItem from '../../components/main/chats/ChatItem.Component';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {Colors} from '../../constants/Colors';

const Chats = ({userData, screenName}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.appContainer.bg,
        paddingRight: 10,
      }}>
      <FlatList
        data={userData}
        keyExtractor={item => item.name}
        renderItem={({item}) => (
          <ChatItem
            name={item.receiverDetails.name}
            profileImage={item.receiverDetails.profileImage}
            lastMessage={''}
            time={item.createdAt}
            unreadCount={item.unreadCount || 0}
            screenName={screenName}
            item={item}
          />
        )}
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        bounces={false}
        nestedScrollEnabled={true}
        onTouchStart={e => e.stopPropagation()}
        // contentContainerStyle={styles.flatListContainer}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default Chats;

const styles = StyleSheet.create({
  flatListContainer: {
    paddingTop: responsiveHeight(1),
  },
  inputFocused: {
    borderWidth: 1,
    borderColor: '#000',
  },
});
