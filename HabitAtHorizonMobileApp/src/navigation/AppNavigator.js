import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/user-auth/LoginScreen';
import SignupScreen from '../screens/user-auth/SignUpScreen';
import PasswordResetScreen from '../screens/user-auth/PasswordResetScreen';
import AboutScreen from '../screens/AboutScreen';
import HomeScreen from '../screens/HomeScreen';
import MentorshipScreen from '../screens/MentorshipScreen';
import BoardsScreen from '../screens/BoardsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const navigationRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        navigationRef.current?.navigate('Home');
      } else {
        navigationRef.current?.navigate('Welcome');
      }
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignupScreen} />
        <Stack.Screen name="PasswordResetScreen" component={PasswordResetScreen} />
        <Stack.Screen name="AboutScreen" component={AboutScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MentorshipScreen" component={MentorshipScreen} />
        <Stack.Screen 
          name="BoardsScreen" 
          component={BoardsScreen} 
          options={{ headerShown: true, title: 'Boards' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
