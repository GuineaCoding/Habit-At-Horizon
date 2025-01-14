// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from '../context/AuthContext';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/user-auth/LoginScreen';
import SignupScreen from '../screens/user-auth/SignUpScreen';
import PasswordResetScreen from '../screens/user-auth/PasswordResetScreen';
import AboutScreen from '../screens/AboutScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <InnerAppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

const InnerAppNavigator = () => {
  const { currentUser } = useAuth(); 

  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      {currentUser ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignupScreen} />
          <Stack.Screen name="PasswordResetScreen" component={PasswordResetScreen} />
          <Stack.Screen name="AboutScreen" component={AboutScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
