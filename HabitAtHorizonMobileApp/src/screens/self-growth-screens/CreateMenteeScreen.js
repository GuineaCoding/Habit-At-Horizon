import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomAppBar from '../../components/CustomAppBar';

const CreateMenteeProfile = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [goals, setGoals] = useState('');
  const [skills, setSkills] = useState('');
  const [availability, setAvailability] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [twitter, setTwitter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const userId = auth().currentUser?.uid;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userId) {
        try {
          const userDoc = await firestore().collection('users').doc(userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setName(userData.name || '');
            setUsername(userData.username || '');
            setBio(userData.bio || '');
            setGoals(userData.menteeData?.goals?.join(', ') || '');
            setSkills(userData.menteeData?.skills?.join(', ') || '');
            setAvailability(userData.menteeData?.availability?.join(', ') || '');
            setProfileImage(userData.profileImage || '');
            setLinkedIn(userData.menteeData?.linkedIn || '');
            setTwitter(userData.menteeData?.twitter || '');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleSaveMentee = async () => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to create or update a mentee profile.');
      return;
    }

    if (!name || !username || !bio) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }

    try {
      const menteeData = {
        goals: goals.split(',').map(goal => goal.trim()), 
        skills: skills.split(',').map(skill => skill.trim()), 
        availability: availability.split(',').map(avail => avail.trim()), 
        linkedIn,
        twitter,
      };

      await firestore().collection('users').doc(userId).set(
        {
          name,
          username,
          bio,
          profileImage,
          roles: ['mentee'], 
          menteeData, 
        },
        { merge: true } 
      );

      Alert.alert('Success', 'Mentee profile saved successfully!');
    } catch (error) {
      console.error('Error saving mentee profile:', error);
      Alert.alert('Error', 'Failed to save mentee profile.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomAppBar
        title="Create/Edit Mentee Profile"
        showBackButton={true}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Name Field (Read-only) */}
        <View style={styles.readOnlyField}>
          <Text style={styles.readOnlyLabel}>Name</Text>
          <Text style={styles.readOnlyText}>{name}</Text>
        </View>

        {/* Username Field (Read-only) */}
        <View style={styles.readOnlyField}>
          <Text style={styles.readOnlyLabel}>Username</Text>
          <Text style={styles.readOnlyText}>{username}</Text>
        </View>

        {/* Editable Fields */}
        <TextInput
          placeholder="Bio *"
          value={bio}
          onChangeText={setBio}
          style={styles.input}
          placeholderTextColor="#999"
          multiline
        />
        <TextInput
          placeholder="Goals (comma-separated, e.g., Learn Python, Improve Leadership)"
          value={goals}
          onChangeText={setGoals}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Skills (comma-separated, e.g., Coding, Public Speaking)"
          value={skills}
          onChangeText={setSkills}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Availability (comma-separated, e.g., Weekdays, Evenings)"
          value={availability}
          onChangeText={setAvailability}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Profile Image URL"
          value={profileImage}
          onChangeText={setProfileImage}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="LinkedIn Profile URL"
          value={linkedIn}
          onChangeText={setLinkedIn}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Twitter Profile URL"
          value={twitter}
          onChangeText={setTwitter}
          style={styles.input}
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#6D9773' }]}
          onPress={handleSaveMentee}
        >
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C3B2E',
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  readOnlyField: {
    marginBottom: 15,
  },
  readOnlyLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  readOnlyText: {
    fontSize: 16,
    color: '#FFFFFF',
    padding: 12,
    backgroundColor: '#6D9773',
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#6D9773',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default CreateMenteeProfile;