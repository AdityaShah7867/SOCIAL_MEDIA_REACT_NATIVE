import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen.js';
import { getItem } from '../utils/asyncStorage.js';
import Navbar from '../Components/Navbar.jsx';
import Bottombar from '../Components/Bottombar.jsx';
import Friends from '../screens/Friends.jsx';
import Post from '../screens/Post.jsx';
import Updates from '../screens/Updates.jsx';
import Profile from '../screens/Profile.jsx';
import Login from '../screens/Login.jsx';
import Chat from '../screens/Chat.jsx';
import Community from '../screens/Community.jsx';
const Stack = createNativeStackNavigator();




export default function AppNavigation() {
 
    return (
      <NavigationContainer>
        
        <Navbar/>
        
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
          <Stack.Screen name="Friends" options={{headerShown: false}} component={Friends} />
          <Stack.Screen name="Post" options={{headerShown: false}} component={Post} />
          <Stack.Screen name="Updates" options={{headerShown: false}} component={Updates} />
          <Stack.Screen name="Profile" options={{headerShown: false}} component={Profile} />
          <Stack.Screen name="Login" options={{headerShown: false}} component={Login} />
          <Stack.Screen name="Chat" options={{headerShown: false}} component={Chat} />
          <Stack.Screen name="Community" options={{headerShown: false}} component={Community} />

        </Stack.Navigator>

        <Bottombar/>

      </NavigationContainer>
    )
  }


