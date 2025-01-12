// src/screens/PasswordResetScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const PasswordResetScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handlePasswordReset = () => {
    console.log('Password reset request for:', email);
    navigation.navigate('Login'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reset Your Password</Text>
      <Text style={styles.text}>Enter your email address to receive reset instructions.</Text>
      <TextInput
        label="Email address"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        placeholder="Enter your email"
        theme={{ colors: { text: 'white', placeholder: 'white', primary: '#FFC0CB', underlineColor: 'transparent', background: '#FFFFFF' } }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button
        mode="contained"
        onPress={handlePasswordReset}
        buttonColor="#6D9773"
        style={styles.button}
      >
        Send Reset Instructions
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        buttonColor="#FFFFFF"
        style={styles.textButton}
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
  text: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginVertical: 10,
  },
  textButton: {
    marginTop: 10,
  }
});

export default PasswordResetScreen;
