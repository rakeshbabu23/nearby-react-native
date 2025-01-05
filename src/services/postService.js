import api from './api';

const createPost = data => {
  return api.post('/post/create', data);
};

const getPosts = (type, page, selectedDistance, tags) => {
  const updatedTags = tags.filter(t => t);

  return api.get(
    `post?postType=${type}&page=${page}&maxDistance=${selectedDistance}&tags=${JSON.stringify(
      updatedTags,
    )}`,
  );
};

const handleLike = data => {
  return api.post(`like/`, data);
};

const addComment = data => {
  return api.post(`comment/`, data);
};

const getPostComments = data => {
  return api.get(`comment/${data}`);
};

export {createPost, getPosts, handleLike, addComment, getPostComments};
