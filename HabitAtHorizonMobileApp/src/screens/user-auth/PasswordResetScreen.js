import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
    <LinearGradient
      colors={['#0C3B2E', '#6D9773']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <Icon name="lock-reset" size={60} color="#FFBA00" style={styles.icon} />
          <Text style={styles.header}>Reset Your Password</Text>
          <Text style={styles.text}>Enter your email address to receive reset instructions.</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TextInput
            label="Email address"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon name="email" color="#0C3B2E" />}
            theme={{ colors: { primary: '#0C3B2E', background: '#FFFFFF' } }}
          />

          <Button
            mode="contained"
            onPress={handlePasswordReset}
            style={styles.button}
            labelStyle={styles.buttonText}
            buttonColor="#FFBA00"
          >
            Send Reset Instructions
          </Button>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  button: {
    width: '100%',
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
  backButton: {
    marginTop: 15,
  },
  backButtonText: {
    color: '#FFBA00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  error: {
    color: '#FF0000',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default PasswordResetScreen;