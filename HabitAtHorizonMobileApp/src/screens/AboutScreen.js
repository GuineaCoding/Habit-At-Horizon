// src/screens/AboutScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.header}>About Habit-at-Horizon</Text>
          <Text style={styles.text}>
            Habit-at-Horizon is designed to help you maintain your daily habits and achieve your long-term goals
            with ease and efficiency. Join us on a journey to transform your aspirations into reality.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#0C3B2E',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
  },
  header: {
    fontSize: 22,
    color: '#0C3B2E',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  }
});

export default AboutScreen;
