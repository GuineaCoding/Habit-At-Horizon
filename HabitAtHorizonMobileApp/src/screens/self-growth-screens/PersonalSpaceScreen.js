import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import CustomAppBar from '../../components/CustomAppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { personalSpaceScreenStyle as styles } from './styles';

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

  const goToProgressScreen = () => {
    const user = auth().currentUser;
    if (user) {
      console.log('Navigating to ProgressScreen with userId:', user.uid);
      navigation.navigate('ProgressScreen', { userId: user.uid });
    } else {
      alert('User not logged in.');
    }
  };

  const goToMenteeProfileCreationStartScreen = () => {
    navigation.navigate('MenteeProfileCreationStartScreen');
  };

  const goToMenteeListScreen = () => {
    navigation.navigate('MenteeListScreen');
  };

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Personal Space" showBackButton={true} />
      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={goToTaskManagement}>
          <Icon name="format-list-checks" size={24} color="#0C3B2E" style={styles.icon} />
          <Text style={styles.buttonText}>Task Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToNoteList}>
          <Icon name="note-text" size={24} color="#0C3B2E" style={styles.icon} />
          <Text style={styles.buttonText}>Note Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToGoalTracking}>
          <Icon name="flag-checkered" size={24} color="#0C3B2E" style={styles.icon} />
          <Text style={styles.buttonText}>Goal Tracking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToProgressScreen}>
          <Icon name="trophy" size={24} color="#0C3B2E" style={styles.icon} />
          <Text style={styles.buttonText}>Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToMenteeProfileCreationStartScreen}>
          <Icon name="account" size={24} color="#0C3B2E" style={styles.icon} />
          <Text style={styles.buttonText}>My Mentee Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToMenteeListScreen}>
          <Icon name="account-group" size={24} color="#0C3B2E" style={styles.icon} />
          <Text style={styles.buttonText}>Mentee List</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default PersonalSpaceScreen;