import CookieManager from '@react-native-cookies/cookies';
import axios from 'axios';
import {REACT_APP_API_URL} from '@env';

const api = axios.create({
  baseURL: REACT_APP_API_URL,
  //baseURL: 'http://192.168.29.39:3000/',
  withCredentials: true,
});

api.interceptors.request.use(
  async config => {
    try {
      if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      } else {
        config.headers['Content-Type'] = 'application/json';
      }
      config.withCredentials = true;
      const cookies = await CookieManager.get('http://3.111.55.237/');
      config.headers.Cookie = Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');

      return config;
    } catch (error) {
      console.error('Error retrieving cookies:', error);
      return config;
    }
  },
  error => Promise.reject(error),
);
api.interceptors.response.use(
  response => response, // Pass the response through without modification
  error => {
    // Log the error based on its type
    // if (error.response) {
    //   console.error('Error Response:', error.response);
    // } else if (error.request) {
    //   console.error('Error Request:', error.request);
    // } else {
    //   console.error('Error Message:', error.message);
    // }

    // Ensure the error propagates to the caller's catch block
    return Promise.reject(error);
  },
);

export default api;
