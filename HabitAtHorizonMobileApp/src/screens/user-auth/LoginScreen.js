import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import { loginStyles } from './styles';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await auth().signInWithEmailAndPassword(email.trim(), password);
      // Successful login - navigation handled by auth state change
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = (error) => {
    switch (error.code) {
      case 'auth/user-not-found':
        setError('No account found with this email');
        break;
      case 'auth/wrong-password':
        setError('Incorrect password');
        break;
      case 'auth/invalid-email':
        setError('Invalid email format');
        break;
      case 'auth/too-many-requests':
        setError('Account temporarily locked. Try again later');
        break;
      case 'auth/network-request-failed':
        setError('Network error. Please check your connection');
        break;
      default:
        setError('Login failed. Please try again');
    }
  };

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={loginStyles.container}>
      <KeyboardAvoidingView
        behavior="padding"
        style={loginStyles.keyboardAvoidingView}
      >
        <View style={loginStyles.content}>
          <Text style={loginStyles.header}>Login to Your Account</Text>

          {error ? <Text style={loginStyles.error}>{error}</Text> : null}

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={loginStyles.input}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            left={<TextInput.Icon name="email" />}
            theme={{ 
              colors: { 
                primary: '#0C3B2E', 
                background: '#FFFFFF',
                placeholder: '#6D9773'
              } 
            }}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={loginStyles.input}
            secureTextEntry={!isPasswordVisible}
            placeholder="••••••••"
            autoCapitalize="none"
            left={<TextInput.Icon name="lock" />}
            right={
              <TextInput.Icon
                name={isPasswordVisible ? 'eye-off' : 'eye'}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              />
            }
            theme={{ 
              colors: { 
                primary: '#0C3B2E', 
                background: '#FFFFFF',
                placeholder: '#6D9773'
              } 
            }}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            style={loginStyles.button}
            labelStyle={loginStyles.buttonText}
            buttonColor="#FFBA00"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          <TouchableOpacity
            onPress={() => navigation.navigate('PasswordResetScreen')}
            style={loginStyles.resetPasswordButton}
          >
            <Text style={loginStyles.resetPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={loginStyles.footer}>
            <Text style={loginStyles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={loginStyles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default LoginScreen;