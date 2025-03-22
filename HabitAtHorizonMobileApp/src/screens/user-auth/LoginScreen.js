import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
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

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      setError('Failed to sign in. Please check your credentials and try again.');
    }
  };

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={loginStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={loginStyles.keyboardAvoidingView}
      >
        <View style={loginStyles.content}>
          <Text style={loginStyles.header}>Login to Habit-at-Horizon</Text>
          {error ? <Text style={loginStyles.error}>{error}</Text> : null}

          <TextInput
            label="Email address"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={loginStyles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            left={<TextInput.Icon name="email" color="#0C3B2E" />}
            theme={{ colors: { primary: '#0C3B2E', background: '#FFFFFF' } }}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={loginStyles.input}
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

          <Button
            mode="contained"
            onPress={handleLogin}
            style={loginStyles.button}
            labelStyle={loginStyles.buttonText}
            buttonColor="#FFBA00"
          >
            Login
          </Button>

          <TouchableOpacity
            onPress={() => navigation.navigate('PasswordResetScreen')}
            style={loginStyles.resetPasswordButton}
          >
            <Text style={loginStyles.resetPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={loginStyles.footer}>
            <Text style={loginStyles.footerText}>Don't have an account?</Text>
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