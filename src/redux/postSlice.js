import {createSlice} from '@reduxjs/toolkit';
import {addComment} from '../services/postService';

const initialState = {
  media: [],
  textPosts: [],
  imagePosts: [],
  videoPosts: [],
  allPosts: [],
  likedPosts: [],
  userLikedPosts: [],
  isVideoSelected: false,
  comments: [],
  selectedDistance: 'tenKm',
  nearbyTags: [],
  selectedTags: [],
  postStatus: '',
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPostStatus: (state, action) => {
      state.postStatus = action.payload;
    },
    addMedia: (state, action) => {
      state.media = [...action.payload, ...state.media];
      state.isVideoSelected = action.payload.find(
        media => media.type === 'video',
      )
        ? true
        : false;
    },
    removeMedia: (state, action) => {
      const mediaToRemove = state.media.find(
        media => media.uri === action.payload,
      );
      if (mediaToRemove?.type === 'video') {
        state.isVideoSelected = false;
      }
      state.media = state.media.filter(media => media.uri !== action.payload);
    },
    setTextPosts: (state, action) => {
      if (action.payload.isRefreshing) {
        state.textPosts = [...action.payload.data];
      } else {
        state.textPosts = [...state.textPosts, ...action.payload.data];
      }
      const userLikedPosts = action.payload.data.filter(
        data => data.isUserLiked,
      );
      if (action.payload.isRefreshing) {
        state.likedPosts = userLikedPosts;
      } else {
        state.likedPosts = [...userLikedPosts];
      }
    },
    setImagePosts: (state, action) => {
      if (action.payload.isRefreshing) {
        state.imagePosts = [...action.payload.data];
      } else {
        state.imagePosts = [...state.imagePosts, ...action.payload.data];
      }
      const userLikedPosts = action.payload.data.filter(
        data => data.isUserLiked,
      );
      if (action.payload.isRefreshing) {
        state.likedPosts = userLikedPosts;
      } else {
        state.likedPosts = [...userLikedPosts];
      }
    },
    setVideoPosts: (state, action) => {
      if (action.payload.isRefreshing) {
        state.videoPosts = [...action.payload.data];
      } else {
        state.videoPosts = [...state.videoPosts, ...action.payload.data];
      }
      const userLikedPosts = action.payload.data.filter(
        data => data.isUserLiked,
      );
      if (action.payload.isRefreshing) {
        state.likedPosts = userLikedPosts;
      } else {
        state.likedPosts = [...userLikedPosts];
      }
    },
    setAllPosts: (state, action) => {
      state.allPosts = [...action.payload, ...state.allPosts];
    },
    setIsVideoSelected: (state, action) => {
      state.isVideoSelected = action.payload;
    },
    setLikedPosts: (state, action) => {
      const checkedLikedPosts = state.likedPosts.find(
        post => post._id === action.payload._id,
      );

      if (checkedLikedPosts) {
        state.likedPosts = state.likedPosts.filter(
          post => post._id !== action.payload._id,
        );
      } else {
        state.likedPosts = [action.payload, ...state.likedPosts];
      }
    },
    setComments: (state, action) => {
      state.comments = {
        ...state.comments,
        [action.payload.postId]: [...action.payload.comments],
      };
    },
    addUserComment: (state, action) => {
      const getPostComments = state.comments[action.payload.postId];
      let updateComments = [];
      if (!getPostComments) {
        updateComments = [action.payload.comment];
      } else {
        updateComments = [action.payload.comment, ...getPostComments];
      }
      state.comments = {
        ...state.comments,
        [action.payload.postId]: updateComments,
      };
    },
    setNearbyTags: (state, action) => {
      state.nearbyTags = action.payload;
      state.selectedTags = action.payload;
    },
    setSelectedDistance: (state, action) => {
      state.selectedDistance = action.payload;
    },
    setSelectedTags: (state, action) => {
      const checkTagInSelectedTags = state.selectedTags.includes(
        action.payload.tag,
      );
      if (checkTagInSelectedTags) {
        state.selectedTags = state.selectedTags.filter(
          tag => tag !== action.payload.tag,
        );
      } else {
        state.selectedTags = [...state.selectedTags, action.payload.tag];
      }
    },
    setDiscardMedia: (state, action) => {
      state.media = [];
      state.isVideoSelected = false;
    },
  },
});

export const {
  addMedia,
  removeMedia,
  setTextPosts,
  setImagePosts,
  setVideoPosts,
  setPostStatus,
  setIsVideoSelected,
  setLikedPosts,
  setComments,
  addUserComment,
  setNearbyTags,
  setSelectedDistance,
  setSelectedTags,
  setDiscardMedia,
} = postSlice.actions;

export default postSlice.reducer;
