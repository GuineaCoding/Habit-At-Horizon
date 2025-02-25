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
      
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          buttonColor="#6D9773"
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Go to Login
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('SignUp')}
          buttonColor="#B46617"
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Sign Up
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AboutScreen')}
          buttonColor="#FFBA00"
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          About
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C3B2E',
    paddingHorizontal: 20,
  },
  textHeader: {
    color: '#FFBA00',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
  },
  button: {
    marginBottom: 15,
    borderRadius: 8,
    paddingVertical: 8,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0C3B2E',
  },
});

export default WelcomeScreen;