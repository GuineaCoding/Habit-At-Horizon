// src/screens/Welcomecreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper'; 
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>Welcome Warrior</Text>
      <Text style={styles.text}>Welcome to the app! If you need to log in again, click below.</Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Login')}
        buttonColor="#6D9773"
        style={{ marginBottom: 10 }}
      >
        Go to Login
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('SignUp')} 
        buttonColor="#B46617"
        style={{ marginBottom: 10 }}
      >
        Sign Up
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('AboutScreen')} 
        buttonColor="#FFBA00"
      >
        About
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Home')} 
        buttonColor="#FFBA00"
      >
        Home
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C3B2E',
  },
  textHeader: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  }
});

export default WelcomeScreen;
