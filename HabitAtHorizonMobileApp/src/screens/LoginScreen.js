// src/screens/LoginScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';

const LoginScreen = () => (
  <View style={styles.container}>
    <Text style={styles.textHeader}>Login In</Text>
    <CustomButton title="Login" onPress={() => {}} color="#6D9773" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C3B2E', 
  },
  textHeader: {
    color: '#FFFFFF', 
    fontSize: 20,
    marginBottom: 20,
  },
});

export default LoginScreen;
