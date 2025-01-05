import {configureStore} from '@reduxjs/toolkit';

import userReducer from './redux/userSlice';
import postReducer from './redux/postSlice';
import chatReducer from './redux/chatSlice';
const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    chat: chatReducer,
  },
});

export default store;
