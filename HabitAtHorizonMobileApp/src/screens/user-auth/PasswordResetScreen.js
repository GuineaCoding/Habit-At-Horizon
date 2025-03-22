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

  const handlePasswordReset = async () => {
    try {
      await auth().sendPasswordResetEmail(email);
      console.log('Reset instructions sent to:', email);
      alert('Reset instructions sent to your email.');
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
            left={<TextInput.Icon name="email" color="#0C3B2E" />}
            theme={{ colors: { primary: '#0C3B2E', background: '#FFFFFF' } }}
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