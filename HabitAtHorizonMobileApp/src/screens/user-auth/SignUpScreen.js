import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Button, TextInput, Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
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
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
      includeBase64: false,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        showError('Image picker error');
      } else if (response.assets[0].fileSize > 1000000) {
        showError('Image must be less than 1MB');
      } else {
        setProfileImage(response.assets[0]);
      }
    });
  };

  const handleSignup = async () => {
    if (!email || !name || !username || !password || !confirmPassword) {
      showError('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    try {
      setUploading(true);
      
      const usernameCheck = await firestore()
        .collection('users')
        .where('username', '==', username)
        .get();

      if (!usernameCheck.empty) {
        showError('Username is already taken');
        return;
      }

      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      
      let imageUrl = '';
      if (profileImage) {
        const reference = storage().ref(`profile_images/${userCredential.user.uid}`);
        await reference.putFile(profileImage.uri);
        imageUrl = await reference.getDownloadURL();
      }

      await firestore().collection('users').doc(userCredential.user.uid).set({
        email,
        name,
        username,
        profileImage: imageUrl,
        createdAt: firestore.FieldValue.serverTimestamp()
      });

      navigation.replace('Home');
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        showError('Email already in use');
      } else if (error.code === 'auth/invalid-email') {
        showError('Invalid email address');
      } else {
        showError('Signup failed. Please try again');
      }
    } finally {
      setUploading(false);
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

          <TouchableOpacity onPress={selectImage} style={signupStyles.uploadButton}>
            {profileImage ? (
              <Image source={{ uri: profileImage.uri }} style={signupStyles.profileImage} />
            ) : (
              <View style={signupStyles.uploadPlaceholder}>
                <Icon name="camera" size={30} color="#0C3B2E" />
                <Text style={signupStyles.uploadText}>Add Profile Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={signupStyles.input}
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

          <TextInput
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={signupStyles.input}
            placeholder="Enter your name"
            left={
              <TextInput.Icon 
                icon={() => <Icon name="account" size={24} color="#FFBA00" />}
              />
            }
            theme={inputTheme}
          />

          <TextInput
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={signupStyles.input}
            placeholder="Enter your username"
            autoCapitalize="none"
            left={
              <TextInput.Icon 
                icon={() => <Icon name="account-circle" size={24} color="#FFBA00" />}
              />
            }
            theme={inputTheme}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={signupStyles.input}
            secureTextEntry={!isPasswordVisible}
            placeholder="Enter your password"
            left={
              <TextInput.Icon 
                icon={() => <Icon name="lock" size={24} color="#FFBA00" />}
              />
            }
            right={
              <TextInput.Icon
                icon={() => (
                  <Icon 
                    name={isPasswordVisible ? 'eye-off' : 'eye'} 
                    size={24} 
                    color="#FFBA00" 
                  />
                )}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              />
            }
            theme={inputTheme}
          />

          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            style={signupStyles.input}
            secureTextEntry={!isConfirmPasswordVisible}
            placeholder="Confirm your password"
            left={
              <TextInput.Icon 
                icon={() => <Icon name="lock" size={24} color="#FFBA00" />}
              />
            }
            right={
              <TextInput.Icon
                icon={() => (
                  <Icon 
                    name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} 
                    size={24} 
                    color="#FFBA00" 
                  />
                )}
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              />
            }
            theme={inputTheme}
          />

          <Button
            mode="contained"
            onPress={handleSignup}
            style={signupStyles.button}
            labelStyle={signupStyles.buttonText}
            buttonColor="#FFBA00"
            loading={uploading}
            disabled={uploading}
          >
            {uploading ? 'Signing Up...' : 'Signup'}
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