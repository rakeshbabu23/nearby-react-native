import {useEffect, useState} from 'react';
import {getPostComments} from '../services/postService';
import {useDispatch} from 'react-redux';
import {setComments} from '../redux/postSlice';
import Toast from 'react-native-toast-message';

const useGetCommets = (postId, page = 1) => {
  const dispatch = useDispatch();
  const [commentsLoading, setCommentsLoading] = useState(false);
  const commentsForPosts = async () => {
    try {
      setCommentsLoading(true);
      const response = await getPostComments(postId, page);
      const {data} = response.data;
      dispatch(setComments({postId: postId, comments: data}));
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'unknown error',
      });
    } finally {
      setCommentsLoading(false);
    }
  };
  useEffect(() => {
    commentsForPosts();
  }, [postId, page]);
  return {commentsLoading};
};

export default useGetCommets;
