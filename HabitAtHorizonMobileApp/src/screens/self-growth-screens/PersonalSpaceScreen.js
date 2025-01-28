import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PersonalSpaceScreen = () => {
  const navigation = useNavigation();

  const goToTaskManagement = () => {
    navigation.navigate('TaskListScreen');
  };

  const goToNoteManagement = () => {
    navigation.navigate('NoteManagement');
  };

  const goToGoalTracking = () => {
    navigation.navigate('GoalTracking');
  };

  const goToMotivationRewards = () => {
    navigation.navigate('MotivationRewards');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Space</Text>
      <TouchableOpacity style={styles.button} onPress={goToTaskManagement}>
        <Text style={styles.buttonText}>Task Management</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={goToNoteManagement}>
        <Text style={styles.buttonText}>Note Management</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={goToGoalTracking}>
        <Text style={styles.buttonText}>Goal Tracking</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={goToMotivationRewards}>
        <Text style={styles.buttonText}>Motivation & Rewards</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default PersonalSpaceScreen;