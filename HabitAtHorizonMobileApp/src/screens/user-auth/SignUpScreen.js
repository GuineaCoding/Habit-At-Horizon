import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput, Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { signupStyles } from './styles'; 

const SignupScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

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
      navigation.replace('Home');
    } catch (error) {
      console.error('Failed to sign up and navigate: ', error);
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
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={signupStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={signupStyles.keyboardAvoidingView}
      >
        <View style={signupStyles.content}>
          <Icon name="account-plus" size={60} color="#FFBA00" style={signupStyles.icon} />
          <Text style={signupStyles.header}>Signup to Habit-at-Horizon</Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={signupStyles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon name="email" color="#0C3B2E" />}
            theme={{ colors: { primary: '#0C3B2E', background: '#FFFFFF' } }}
          />

          <TextInput
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={signupStyles.input}
            placeholder="Enter your name"
            left={<TextInput.Icon name="account" color="#0C3B2E" />}
            theme={{ colors: { primary: '#0C3B2E', background: '#FFFFFF' } }}
          />

          <TextInput
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={signupStyles.input}
            placeholder="Enter your username"
            autoCapitalize="none"
            left={<TextInput.Icon name="account-circle" color="#0C3B2E" />}
            theme={{ colors: { primary: '#0C3B2E', background: '#FFFFFF' } }}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={signupStyles.input}
            secureTextEntry={!isPasswordVisible}
            placeholder="Enter your password"
            left={<TextInput.Icon name="lock" color="#0C3B2E" />}
            right={
              <TextInput.Icon
                name={isPasswordVisible ? 'eye-off' : 'eye'}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                color="#0C3B2E"
              />
            }
            theme={{ colors: { primary: '#0C3B2E', background: '#FFFFFF' } }}
          />

          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            style={signupStyles.input}
            secureTextEntry={!isConfirmPasswordVisible}
            placeholder="Confirm your password"
            left={<TextInput.Icon name="lock" color="#0C3B2E" />}
            right={
              <TextInput.Icon
                name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                color="#0C3B2E"
              />
            }
            theme={{ colors: { primary: '#0C3B2E', background: '#FFFFFF' } }}
          />

          <Button
            mode="contained"
            onPress={handleSignup}
            style={signupStyles.button}
            labelStyle={signupStyles.buttonText}
            buttonColor="#FFBA00"
          >
            Signup
          </Button>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={signupStyles.backButton}
          >
            <Text style={signupStyles.backButtonText}>Already have an account? Login</Text>
          </TouchableOpacity>

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
            style={signupStyles.snackbar}
          >
            {error}
          </Snackbar>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default SignupScreen;