import api from './api';

const userInfo = () => {
  return api.get('/user/');
};
const userCurrentLocationInfo = data => {
  return api.get(`/user/current-location?lat=${data.lat}&long=${data.long}`);
};

const updateUser = data => {
  return api.patch('/user/', data);
};
const nearbyPeople = data => {
  return api.get(`/user/nearby?maxDistance=${data}`);
};

const myPosts = (postType, page) => {
  return api.get(`/user/posts?page=${page}&postType=${postType}`);
};

const getNearbyTags = data => {
  return api.get(`/user/tags?maxDistance=${data}`);
};

const getChats = () => {
  return api.get('/messages/chats');
};

const logout = () => {
  return api.post('/user/logout');
};

export {
  userInfo,
  updateUser,
  nearbyPeople,
  userCurrentLocationInfo,
  myPosts,
  getNearbyTags,
  logout,
  getChats,
};
