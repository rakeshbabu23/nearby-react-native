import {Dimensions, Text,View} from 'react-native'
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import store from "./src/store";
import AppNavigator from "./src/navigators/AppNavigator";
import toastConfig from "./src/components/general/Toast";
import Toast from 'react-native-toast-message';
import { responsiveFontSize } from "react-native-responsive-dimensions";
import io from 'socket.io-client';
import { useEffect,useState, useMemo } from 'react';
import NetInfo from '@react-native-community/netinfo';


const useSocket = url => {
  return useMemo(() => io(url), [url]);
};


export default function Page() {
  const socket = useSocket('http://3.111.55.237:3000');
  const [isConnected, setIsConnected] = useState(true);
   useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);


  return (
    
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <Toast config={toastConfig} visibilityTime={3000} position='bottom'/>
      {!isConnected&&<View style={{backgroundColor:'#DC2626',width:Dimensions.get('window').width}} >
        <Text style={{fontSize:responsiveFontSize(2),fontFamily:'Poppins-Regular',color:'#fff',textAlign:'center'}}>You're offline. Turn on mobile data to enjoy all features</Text>
      </View>}
      
    </Provider>
  );
}
