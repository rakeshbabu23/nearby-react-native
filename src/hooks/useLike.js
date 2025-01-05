import {useDispatch} from 'react-redux';
import {handleLike} from '../services/postService';
import {setLikedPosts} from '../redux/postSlice';
import Toast from 'react-native-toast-message';

const useLike = post => {
  const dispatch = useDispatch();
  const addOrUndoLikeApiCall = async () => {
    dispatch(setLikedPosts(post));
    try {
      await handleLike({postId: post._id});
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'unknown error',
      });
      dispatch(setLikedPosts({...post, loggedInUserLiked: true}));
      throw error;
    }
  };
  return {addOrUndoLikeApiCall};
};

export default useLike;
