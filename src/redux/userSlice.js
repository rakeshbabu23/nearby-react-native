import {createSlice} from '@reduxjs/toolkit';
import {nearbyPeople} from '../services/userService';

const initialState = {
  name: '',
  email: '',
  password: '',
  isLoggedIn: false,
  profileImage: '',
  visibility: false,
  address: '',
  location: {latitude: null, longitude: null},
  locationDeny: null,
  userId: '',
  nearbyPeople: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.name = action.payload.fullName;
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    setLocation: (state, action) => {
      state.location = action.payload.location;
      state.locationDeny = action.payload.locationDeny;
    },
    setUserDeniedLocation: (state, action) => {
      state.locationDeny = true;
      state.location = {latitude: null, longitude: null};
    },
    setUserLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.userId = action.payload.userId;
    },
    setNearbyPeople: (state, action) => {
      state.nearbyPeople = action.payload;
    },
    setInformation: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profileImage = action.payload.profileImage;
      state.location = action.payload.location;
      state.address = action.payload.address;
      state.visibility = action.payload.visibility;
    },
    setLogout: (state, action) => {
      state.isLoggedIn = false;
      state.userId = '';
      state.nearbyPeople = [];
      state.name = '';
      state.email = '';
      state.password = '';
      state.profileImage = '';
      state.visibility = false;
      state.address = '';
      state.location = [];
    },
  },
});

export const {
  setUserData,
  setLocation,
  setUserDeniedLocation,
  setUserLoggedIn,
  setNearbyPeople,
  setInformation,
  setLogout,
} = userSlice.actions;

export default userSlice.reducer;
