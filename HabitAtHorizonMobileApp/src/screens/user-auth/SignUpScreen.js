// src/screens/SignupScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    console.log('Signup attempt with:', email, name, username, password, confirmPassword);
    navigation.navigate('Login'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Signup to Habit-at-Horizon</Text>
      <TextInput
        label="Email address"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        placeholder="Enter your email"
        theme={{ colors: { text: 'white', placeholder: 'white', primary: '#FFC0CB', underlineColor: 'transparent', background: '#FFFFFF' } }}
      />
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
        placeholder="Enter your name"
        theme={{ colors: { text: 'white', placeholder: 'white', primary: '#FFC0CB', underlineColor: 'transparent', background: '#FFFFFF' } }}
      />
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={styles.input}
        placeholder="Enter your username"
        theme={{ colors: { text: 'white', placeholder: 'white', primary: '#FFC0CB', underlineColor: 'transparent', background: '#FFFFFF' } }}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
        secureTextEntry
        placeholder="Enter your password"
        theme={{ colors: { text: 'white', placeholder: 'white', primary: '#FFC0CB', underlineColor: 'transparent', background: '#FFFFFF' } }}
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        mode="outlined"
        style={styles.input}
        secureTextEntry
        placeholder="Confirm your password"
        theme={{ colors: { text: 'white', placeholder: 'white', primary: '#FFC0CB', underlineColor: 'transparent', background: '#FFFFFF' } }}
      />
      <Button
        mode="contained"
        onPress={handleSignup}
        buttonColor="#6D9773"
        style={styles.button}
      >
        Signup
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Login')}
        buttonColor="#FFBA00"
        style={styles.button}
      >
        Back to Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C3B2E',
  },
  header: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#FFFFFF', 
  },
  button: {
    marginVertical: 10,
  }
});

export default SignupScreen;
