// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignUpScreen';
import PasswordResetScreen from '../screens/PasswordResetScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
      <Stack.Screen name="PasswordResetScreen" component={PasswordResetScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
