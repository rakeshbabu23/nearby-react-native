import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import PostsAll from '../../screen/main/Home/PostsAll';
import PostsPhotos from '../../screen/main/Home/PostsPhotos';
import PostsTexts from '../../screen/main/Home/PostsTexts';
import PostsVideos from '../../screen/main/Home/PostsVideos';
const HomeTopBar = () => {
  const Tabs = createMaterialTopTabNavigator();
  return (
    <Tabs.Navigator
      initialRouteName="AllPosts"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'white',
          width: 300,
          elevation: 0,
        },
        tabBarIndicatorStyle: {
          backgroundColor: 'black',
          height: 5,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        },
      }}>
      <Tabs.Screen
        name="AllPosts"
        component={PostsAll}
        options={{
          title: 'All',
        }}
      />
      <Tabs.Screen
        name="PostsPhotos"
        component={PostsPhotos}
        options={{
          title: 'Images',
        }}
      />
      <Tabs.Screen
        name="PostsTexts"
        component={PostsTexts}
        options={{
          title: 'Texts',
        }}
      />
      <Tabs.Screen
        name="PostsVideos"
        component={PostsVideos}
        options={{
          title: 'Videos',
        }}
      />
    </Tabs.Navigator>
  );
};

export default HomeTopBar;

const styles = StyleSheet.create({});
