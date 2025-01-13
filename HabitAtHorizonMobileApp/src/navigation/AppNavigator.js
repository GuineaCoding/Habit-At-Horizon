// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/user-auth/LoginScreen';
import SignupScreen from '../screens/user-auth/SignUpScreen';
import PasswordResetScreen from '../screens/user-auth/PasswordResetScreen';
import AboutScreen from '../screens/AboutScren'

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="WelcomeScreen">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
      <Stack.Screen name="PasswordResetScreen" component={PasswordResetScreen} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
