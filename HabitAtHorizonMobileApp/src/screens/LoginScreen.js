// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const focusedColor = '#FFC0CB'; 

  const handleLogin = () => {
    console.log('Login attempt with:', email, password);
    navigation.navigate('Home'); 
  };
  const naviegateToPassowrdResetScreen = () => {
    navigation.navigate('PasswordResetScreen'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login to Habit-at-Horizon</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        theme={{ colors: { text: 'white', placeholder: 'white', primary: focusedColor, underlineColor: 'transparent', background: '#FFFFFF' } }}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
        secureTextEntry
        theme={{ colors: { text: 'white', placeholder: 'white', primary: focusedColor, underlineColor: 'transparent', background: '#FFFFFF' } }}
        placeholder="Enter your password"
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        buttonColor="#6D9773"
        style={styles.button}
      >
        Login
      </Button>
      <Button
        mode="contained"
        onPress={() => {
          setEmail('');
          setPassword('');
          naviegateToPassowrdResetScreen()
        }}
        buttonColor="#B46617"
        style={styles.button}
      >
        Reset Password
      </Button>

      <Text style={styles.text}>
        Hey, if you're here, you've already made the first step towards a better you.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#0C3B2E',
  },
  header: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF', 
    marginBottom: 10,
    color: 'white', 
  },
  button: {
    marginVertical: 10,
  },
  text: {
    marginTop: 30,
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  }
});

export default LoginScreen;
