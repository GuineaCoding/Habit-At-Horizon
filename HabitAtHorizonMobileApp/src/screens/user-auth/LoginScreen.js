import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
  
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],  
      });
    } catch (error) {
      setError("Failed to sign in. Please check your credentials and try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login to Habit-at-Horizon</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        label="Email address"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
        secureTextEntry
        placeholder="Enter your password"
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
      >
        Login
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('PasswordResetScreen')}
        style={styles.button}
      >
        Reset Password
      </Button>
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
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginVertical: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  }
});

export default LoginScreen;
