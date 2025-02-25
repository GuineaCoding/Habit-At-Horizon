import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient'; // For gradient background
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // For icons

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
      setError("Failed to sign in. Please check your credentials and try again.");
    }
  };

  return (
    <LinearGradient
      colors={['#0C3B2E', '#6D9773']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
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
            left={<TextInput.Icon name="email" color="#0C3B2E" />}
            theme={{ colors: { primary: '#0C3B2E', background: '#FFFFFF' } }}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
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
            style={styles.button}
            labelStyle={styles.buttonText}
            buttonColor="#FFBA00"
          >
            Login
          </Button>

          <TouchableOpacity
            onPress={() => navigation.navigate('PasswordResetScreen')}
            style={styles.resetPasswordButton}
          >
            <Text style={styles.resetPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  button: {
    marginVertical: 10,
    borderRadius: 8,
    paddingVertical: 8,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0C3B2E',
  },
  resetPasswordButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  resetPasswordText: {
    color: '#FFBA00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  error: {
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  footerLink: {
    color: '#FFBA00',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default LoginScreen;