import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Keyboard,
  ActivityIndicator,
  Pressable,
  TextInput,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import ChatHeader from '../../components/main/chats/ChatHeader';
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Colors} from '../../constants/Colors';
import useSocket from '../../hooks/useSocket';
import {useSelector} from 'react-redux';
import {REACT_APP_API_URL} from '@env';

const {width: screenWidth} = Dimensions.get('window');

function getRoomName(userId1, userId2) {
  return [userId1, userId2].sort().join('_');
}
function ChatBottom({textInputRef, newMessage, setNewMessage, action}) {
  return (
    <View style={styles.inputArea}>
      <View style={styles.keyboardArea}>
        <TextInput
          ref={textInputRef}
          value={newMessage}
          onChangeText={setNewMessage} // Use prop directly
          multiline={true}
          style={[styles.textInputcontainer]}
          placeholder="Message"
          placeholderTextColor="#888"
        />
      </View>
      <Pressable style={styles.micContainer} onPress={action}>
        <Ionicons name="send" size={24} color="black" />
      </Pressable>
    </View>
  );
}

const ChatScreen = ({route}) => {
  const socket = useSocket(REACT_APP_API_URL);
  const {
    receiverId = null,
    receiverName,
    profileImage,
    chatId = null,
  } = route.params;
  const {userId} = useSelector(state => state.user);
  const roomName = getRoomName(userId, receiverId);
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadMoreMessages, setLoadMoreMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [page, setPage] = useState(1);
  const textInputRef = useRef(null);
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardShown(true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardShown(false);
    });
  }, []);
  const fetchOlderMessages = (
    senderId,
    receiverId,
    chatId,
    pageToFetch = 1,
  ) => {
    socket.emit('get_older_messages', {
      senderId,
      receiverId,
      chatId,
      pageToFetch,
    });
  };
  const fetchRecentMessages = (
    senderId,
    receiverId,
    chatId,
    pageToFetch = 1,
  ) => {
    socket.emit('fetch_recent_messages', {
      senderId,
      receiverId,
      chatId,
      pageToFetch,
    });
  };
  useEffect(() => {
    socket.emit('join_room', {
      senderId: userId,
      receiverId,
    });
    socket.emit('register_user', {userId});
    socket.emit('user_online_status', {roomName, userId, receiverId});
    socket.on('user_in_room', data => {
      if (
        data.roomName === getRoomName(userId, receiverId) &&
        receiverId === data.receiverId
      ) {
        if (data.isPresent) {
          setIsUserOnline(true);
        } else {
          setIsUserOnline(false);
        }
      }
    });

    fetchRecentMessages(userId, receiverId, chatId);

    socket.on('recent_messages', data => {
      setMessages([...data.messages]);
      setLoadMoreMessages(false);
      if (data.messages.length < 10) {
        setHasMoreMessages(false);
      } else {
        setHasMoreMessages(true);
      }
    });
    socket.on('older_messages', data => {
      setMessages(prevMessages => [...prevMessages, ...data.messages]);
      setLoadMoreMessages(false);
      if (data.messages.length < 10) {
        setHasMoreMessages(false);
      } else {
        setHasMoreMessages(true);
      }
    });
    socket.on('new_message', data => {
      setMessages(prevMessages => [data, ...prevMessages]);
    });
    return () => {
      socket.emit('leave_room', {roomName});
      socket.disconnect();
    };
  }, []);
  const sendMessage = () => {
    textInputRef.current.focus();
    socket.emit('send_message', {
      senderId: userId,
      receiverId,
      chatId,
      text: newMessage,
    });
    setNewMessage('');
  };

  const showLoader = () => {
    if (!hasMoreMessages) {
      return (
        <View style={{paddingVertical: responsiveHeight(1.5)}}>
          <Text
            style={{
              textAlign: 'center',
              color: '#fff',
              marginTop: responsiveHeight(1.5),
            }}>
            You have reached end
          </Text>
        </View>
      );
    } else if (messagesLoading) {
      return (
        <View style={{paddingVertical: responsiveHeight(1.5)}}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    }
  };
  const loadMore = () => {
    if (!loadMoreMessages && hasMoreMessages) {
      setLoadMoreMessages(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchOlderMessages(userId, receiverId, chatId, nextPage);
    }
  };

  return (
    <View style={styles.container}>
      <ChatHeader
        receiverName={receiverName}
        isUserOnline={isUserOnline}
        profileImage={profileImage}
      />

      <>
        <FlatList
          data={messages}
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => (
            <View
              style={[
                styles.messageContainer,
                {
                  alignSelf:
                    item.senderId === userId ? 'flex-end' : 'flex-start',
                },
              ]}>
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.timeText}>
                {new Date(item.createdAt).toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
              </Text>
            </View>
          )}
          inverted={true}
          ListFooterComponent={showLoader}
          onEndReachedThreshold={0.5}
          onEndReached={loadMore}
        />
      </>

      <ChatBottom
        textInputRef={textInputRef}
        newMessage={newMessage}
        setNewMessage={val => setNewMessage(val)}
        action={sendMessage}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: Colors.appContainer.bg,
  },
  bottom: {
    width: screenWidth,
  },
  inputArea: {
    width: '100%',
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: responsiveHeight(6),
    maxHeight: 100,
    //  backgroundColor: "red",
  },
  keyboardArea: {
    width: '85%',
    borderRadius: 10,
    height: 'auto',
  },
  input: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.5),
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: responsiveWidth(10),
    fontSize: responsiveFontSize(2),
  },
  micContainer: {
    width: responsiveWidth(13),
    height: responsiveWidth(13),
    borderRadius: responsiveWidth(13) / 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  messageContainer: {
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(1),
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: responsiveHeight(1),
    maxWidth: '80%',
  },
  messageText: {
    color: '#000',
    fontSize: responsiveFontSize(2),
  },
  textInputcontainer: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.5),
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: responsiveWidth(10),
    fontSize: responsiveFontSize(2),
    borderWidth: 1,
    borderColor: '#000',
  },
  timeText: {
    color: '#888', // A lighter color for distinction
    fontSize: responsiveFontSize(1), // Slightly smaller font size
    marginTop: responsiveHeight(0.5), // Space between message and time
    alignSelf: 'flex-end', // Align time to the bottom-right of the message
  },
});
