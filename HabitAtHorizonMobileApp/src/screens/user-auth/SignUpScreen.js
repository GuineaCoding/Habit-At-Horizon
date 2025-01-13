import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput, Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    const usernameCheck = await firestore()
      .collection('users')
      .where('username', '==', username)
      .get();

    if (!usernameCheck.empty) {
      showError('Username is already taken');
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      await firestore().collection('users').doc(userCredential.user.uid).set({
        email,
        name,
        username,
      });
      console.log('User account created & signed in! Navigating to home screen...');
      navigation.navigate('Home');
    } catch (error) {
      console.error("Failed to sign up and navigate: ", error);
      if (error.code === 'auth/email-already-in-use') {
        showError('That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        showError('That email address is invalid!');
      } else {
        showError(error.message);
      }
    }
  };

  const showError = (message) => {
    setError(message);
    setVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Signup to Habit-at-Horizon</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        placeholder="Enter your email"
      />
      <TextInput
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
        placeholder="Enter your name"
      />
      <TextInput
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={styles.input}
        placeholder="Enter your username"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
        secureTextEntry
        placeholder="Enter your password"
      />
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        mode="outlined"
        style={styles.input}
        secureTextEntry
        placeholder="Confirm your password"
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
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={5000}
        action={{
          label: 'OK',
          onPress: () => {
            setVisible(false);
          },
        }}
      >
        {error}
      </Snackbar>
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
