import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const PersonalSpaceScreen = () => {
  const navigation = useNavigation();

  const goToTaskManagement = () => {
    navigation.navigate('TaskListScreen');
  };

  const goToNoteList = () => {
    const user = auth().currentUser;  
    if (user) {
      navigation.navigate('NoteListScreen', { userId: user.uid });
    } else {
      alert('User not logged in.');
    }
  };

  const goToGoalTracking = () => {
    navigation.navigate('MainGoalScreen');
  };

  const goToMotivationRewards = () => {
    navigation.navigate('MotivationRewards');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Space</Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#6D9773' }]} onPress={goToTaskManagement}>
        <Text style={styles.buttonText}>Task Management</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#B46617' }]} onPress={goToNoteList}>
        <Text style={styles.buttonText}>Note Management</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#FFBA00' }]} onPress={goToGoalTracking}>
        <Text style={styles.buttonText}>Goal Tracking</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#6D9773' }]} onPress={goToMotivationRewards}>
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
    backgroundColor: '#0C3B2E', 
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF', 
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 18,
  },
});

export default PersonalSpaceScreen;