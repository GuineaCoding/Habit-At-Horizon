import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <Icon name="shield-sword" size={100} color="#FFBA00" style={styles.icon} />
      <Text style={styles.textHeader}>Welcome Warrior</Text>
      <Text style={styles.text}>Welcome to the app! If you need to log in again, click below.</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          buttonColor="#FFBA00"
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Go to Login
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('SignUp')}
          buttonColor="#FFBA00"
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

      <Text style={styles.footerText}>Built by Andrian B</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 20,
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
  footerText: {
    position: 'absolute',
    bottom: 20,
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default WelcomeScreen;