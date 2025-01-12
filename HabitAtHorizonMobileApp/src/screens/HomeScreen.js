// Example for LoginScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';

const LoginScreen = () => (
  <View style={styles.container}>
    <Text>Login Data Screen</Text>
    <CustomButton title="Login" onPress={() => {}} color="#6D9773" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
