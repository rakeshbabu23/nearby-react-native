// import {
//   StatusBar,
//   StyleSheet,
//   View,
//   Dimensions,
//   TouchableOpacity,
//   Pressable,
// } from "react-native";
// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// import Chats from "../../screens/main/Chats";
// import HomFeed from "../../screens/main/HomFeed";
// import Nearby from "../../screens/main/Nearby";
// import Post from "../../screens/main/Post";
// import Profile from "../../screens/main/Profile";
// import HomeSvg from "../../components/svgs/HomeSvg";
// import MessageSvg from "../../components/svgs/MessageSvg";
// import ProfileSvg from "../../components/svgs/ProfileSvg";
// import SearchLocationSvg from "../../components/svgs/SearchLocationSvg";
// import PlusSvg from "../../components/svgs/PlusSvg";

// function CustomButton({ children, props }) {
//   console.log("CustomButton", props);
//   return (
//     <Pressable
//       style={{
//         flex: 1,
//         marginRight: 2,
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <View>{children}</View>
//     </Pressable>
//   );
// }
// const MainNavigator = () => {
//   const windowWidth = Dimensions.get("window").width;
//   const Tab = createBottomTabNavigator();
//   return (
//     <>
//       <StatusBar barStyle="dark-content" />
//       <Tab.Navigator
//         screenOptions={({ route }) => ({
//           headerShown: false,
//           // tabBarIcon: ({ focused, color, size }) => {
//           //   let iconName;

//           //   if (route.name === "HomFeed") {
//           //     iconName = focused ? "home" : "home-outline";
//           //   } else if (route.name === "Chats") {
//           //     iconName = focused ? "chatbubble" : "chatbubble-outline";
//           //   } else if (route.name === "Nearby") {
//           //     iconName = focused ? "location" : "location-outline";
//           //   } else if (route.name === "Post") {
//           //     iconName = focused ? "add-circle" : "add-circle-outline";
//           //   } else if (route.name === "Profile") {
//           //     iconName = focused ? "person" : "person-outline";
//           //   }

//           //   return <Ionicons name={iconName} size={size} color={color} />;
//           // },
//           tabBarShowLabel: false,
//           tabBarStyle: styles.tabBar,
//         })}
//         initialRouteName="HomFeed"
//       >
//         <Tab.Screen
//           name="HomFeed"
//           component={HomFeed}
//           options={{
//             tabBarButton: (props) => {
//               return (
//                 <CustomButton props={props}>
//                   <HomeSvg />
//                 </CustomButton>
//               );
//             },
//           }}
//         />
//         <Tab.Screen
//           name="Nearby"
//           component={Nearby}
//           options={{
//             tabBarButton: (props) => {
//               return (
//                 <CustomButton props={props}>
//                   <SearchLocationSvg />
//                 </CustomButton>
//               );
//             },
//           }}
//         />

//         <Tab.Screen
//           name="Post"
//           component={Post}
//           options={{
//             tabBarButton: (props) => {
//               return (
//                 <CustomButton props={props}>
//                   <PlusSvg />
//                 </CustomButton>
//               );
//             },
//           }}
//         />
//         <Tab.Screen
//           name="Chats"
//           component={Chats}
//           options={{
//             tabBarButton: (props) => {
//               return (
//                 <CustomButton props={props}>
//                   <MessageSvg />
//                 </CustomButton>
//               );
//             },
//           }}
//         />
//         <Tab.Screen
//           name="Profile"
//           component={Profile}
//           options={{
//             tabBarButton: (props) => {
//               return (
//                 <CustomButton props={props}>
//                   <ProfileSvg />
//                 </CustomButton>
//               );
//             },
//           }}
//         />
//       </Tab.Navigator>
//     </>
//   );
// };

// export default MainNavigator;

// const styles = StyleSheet.create({
//   tabBar: {
//     height: 60,
//     position: "absolute",
//     marginLeft: 10,
//     marginRight: 10,
//     backgroundColor: "#fff",
//     elevation: 0,
//     borderTopWidth: 0,
//     width: "auto",
//   },
//   postButton: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#FF6347",
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 5,
//     shadowColor: "#FF6347",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 2,
//   },
// });
import {
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Chats from '../../screen/main/Chats';
import HomFeed from '../../screen/main/HomFeed';
import Nearby from '../../screen/main/Nearby';
import Post from '../../screen/main/Post';
import Profile from '../../screen/main/Profile';
import HomeSvg from '../../components/svgs/HomeSvg';
import MessageSvg from '../../components/svgs/MessageSvg';
import ProfileSvg from '../../components/svgs/ProfileSvg';
import SearchLocationSvg from '../../components/svgs/SearchLocationSvg';
import PlusSvg from '../../components/svgs/PlusSvg';
import {Colors} from '../../constants/Colors';
import userChats from '../../screen/main/UserChats';
import UserChats from '../../screen/main/UserChats';
import useSocket from '../../hooks/useSocket';
import {useSelector} from 'react-redux';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

function CustomButton({children, props}) {
  //console.log(props);
  return (
    <Pressable
      onPress={props.onPress} // Make sure to handle press action
      style={{
        flex: 1,
        marginRight: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View>{children}</View>
    </Pressable>
  );
}

const MainNavigator = () => {
  const {userId} = useSelector(state => state.user);
  const socket = useSocket('http://3.111.55.237:3000');
  const windowWidth = Dimensions.get('window').width;
  const Tab = createBottomTabNavigator();
  const [status, setStatus] = useState('');
  const {postStatus} = useSelector(state => state.post);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.appContainer.bg}
      />
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarHideOnKeyboard: true,
        })}
        initialRouteName="HomFeed"
        //tabBarHideOnKeyboard={true}
      >
        <Tab.Screen
          name="HomFeed"
          component={HomFeed}
          options={{
            tabBarButtonTestID: 1,
            tabBarButton: props => {
              return (
                <CustomButton props={props}>
                  <HomeSvg focused={props.accessibilityState.selected} />
                </CustomButton>
              );
            },
          }}
        />
        <Tab.Screen
          name="Nearby"
          component={Nearby}
          options={{
            tabBarButtonTestID: 2,
            tabBarButton: props => {
              return (
                <CustomButton props={props}>
                  <SearchLocationSvg
                    focused={props.accessibilityState.selected}
                  />
                </CustomButton>
              );
            },
          }}
        />

        <Tab.Screen
          name="Post"
          component={Post}
          options={{
            tabBarStyle: {display: 'none'},
            tabBarButtonTestID: 3,
            tabBarButton: props => {
              return (
                <CustomButton props={props}>
                  <PlusSvg focused={props.accessibilityState.selected} />
                </CustomButton>
              );
            },
          }}
        />
        <Tab.Screen
          name="Chats"
          component={UserChats}
          options={{
            tabBarButtonTestID: 4,
            tabBarButton: props => {
              return (
                <CustomButton props={props}>
                  <MessageSvg focused={props.accessibilityState.selected} />
                </CustomButton>
              );
            },
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarButtonTestID: 5,
            tabBarButton: props => {
              return (
                <CustomButton props={props}>
                  <ProfileSvg focused={props.accessibilityState.selected} />
                </CustomButton>
              );
            },
          }}
        />
      </Tab.Navigator>
      {postStatus === 'loading' && (
        <View style={styles.postLoadingLoader}>
          <Text style={styles.postLoaderText}>Post uploding...</Text>
        </View>
      )}
    </>
  );
};

export default MainNavigator;

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    //position: "absolute",
    // marginLeft: 10,
    // marginRight: 10,
    backgroundColor: Colors.appContainer.bg,
    elevation: 0,
    width: 'auto',
    //borderRadius: 50,
    // borderTopWidth: 1,
    // borderColor: '#fff',

    // bottom: 10,
  },
  postButtonContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#005FAF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  postLoadingLoader: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    borderRadius: responsiveWidth(3),
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#fff',
  },
  postLoaderText: {
    fontSize: responsiveFontSize(2),
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
});
