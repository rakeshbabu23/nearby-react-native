import {useDispatch} from 'react-redux';
import {addComment} from '../services/postService';
import {addUserComment} from '../redux/postSlice';
import Toast from 'react-native-toast-message';

const useComment = (postId, content) => {
  const dispatch = useDispatch();
  const handleComment = async () => {
    try {
      const response = await addComment({postId, content});
      const {data} = response.data;
      dispatch(addUserComment({postId, comment: data}));
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'unknown error',
      });
      console.error('Error adding comment:', error);
      throw error;
    }
  };
  return handleComment;
};

export default useComment;
