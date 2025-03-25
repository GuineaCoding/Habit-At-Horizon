import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { passwordResetStyles } from './styles';

const PasswordResetScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const inputTheme = {
    colors: {
      primary: '#0C3B2E',
      background: '#FFFFFF',
      text: '#000000',
      placeholder: '#6D9773',
      accent: '#FFBA00',
    },
    roundness: 8,
  };

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      alert('Password reset instructions sent to your email.');
      navigation.navigate('Login');
    } catch (error) {
      setError(error.message);
      console.error('Failed to send reset instructions:', error);
    }
  };

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={passwordResetStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={passwordResetStyles.keyboardAvoidingView}
      >
        <View style={passwordResetStyles.content}>
          <Icon name="lock-reset" size={60} color="#FFBA00" style={passwordResetStyles.icon} />
          <Text style={passwordResetStyles.header}>Reset Your Password</Text>
          <Text style={passwordResetStyles.text}>Enter your email address to receive reset instructions.</Text>
          {error ? <Text style={passwordResetStyles.error}>{error}</Text> : null}

          <TextInput
            label="Email address"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={passwordResetStyles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            left={
              <TextInput.Icon 
                icon={() => <Icon name="email" size={24} color="#FFBA00" />}
              />
            }
            theme={inputTheme}
          />

          <Button
            mode="contained"
            onPress={handlePasswordReset}
            style={passwordResetStyles.button}
            labelStyle={passwordResetStyles.buttonText}
            buttonColor="#FFBA00"
          >
            Send Reset Instructions
          </Button>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={passwordResetStyles.backButton}
          >
            <Text style={passwordResetStyles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default PasswordResetScreen;