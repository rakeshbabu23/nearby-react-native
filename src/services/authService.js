import api from './api';

const completeAuthentication = data => {
  return api.post('/auth/create', data);
};

const userLogin = data => {
  return api.post('/auth/login', data);
};
const sendOtp = data => {
  return api.post('/auth/send-otp', data);
};
const verifyOtp = data => {
  return api.post('/auth/verify-otp', data);
};

export {completeAuthentication, userLogin, sendOtp, verifyOtp};
