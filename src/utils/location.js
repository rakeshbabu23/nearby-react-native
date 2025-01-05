import Geolocation from '@react-native-community/geolocation';

export const getLocation = async () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        resolve({latitude, longitude});
      },
      error => {
        console.error('Location Error:', error);
        reject(error);
      },
      {
        enableHighAccuracy: false, // Enable GPS accuracy
        timeout: 15000, // Timeout in milliseconds
      },
    );
  });
};
