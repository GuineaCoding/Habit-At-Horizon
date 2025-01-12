// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>Welcome Warrior</Text>
      <Text style={styles.text}>Welcome to the app! If you need to log in again, click below.</Text>
      <CustomButton
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
        color="#FF6347"
      />
      <CustomButton
        title="Sign Up"
        onPress={() => navigation.navigate('Login')}
        color="#FF6347"
      />
      <CustomButton
        title="About"
        onPress={() => navigation.navigate('Login')}
        color="#FF6347"
      />
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

export default HomeScreen;
