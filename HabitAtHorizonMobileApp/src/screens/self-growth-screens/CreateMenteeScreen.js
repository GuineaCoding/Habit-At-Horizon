import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Checkbox } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomAppBar from '../../components/CustomAppBar';

const CreateMenteeProfile = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [goals, setGoals] = useState('');
  const [skills, setSkills] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [twitter, setTwitter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [availability, setAvailability] = useState({
    weekdays: false,
    weekends: false,
    mornings: false,
    evenings: false,
  });

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
            setProfileImage(userData.profileImage || '');
            setLinkedIn(userData.menteeData?.linkedIn || '');
            setTwitter(userData.menteeData?.twitter || '');

            if (userData.menteeData?.availability) {
              const availabilityState = {
                weekdays: userData.menteeData.availability.includes('Weekdays'),
                weekends: userData.menteeData.availability.includes('Weekends'),
                mornings: userData.menteeData.availability.includes('Mornings'),
                evenings: userData.menteeData.availability.includes('Evenings'),
              };
              setAvailability(availabilityState);
            }
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
      const availabilityArray = [];
      if (availability.weekdays) availabilityArray.push('Weekdays');
      if (availability.weekends) availabilityArray.push('Weekends');
      if (availability.mornings) availabilityArray.push('Mornings');
      if (availability.evenings) availabilityArray.push('Evenings');
  
      const menteeData = {
        goals: goals.split(',').map(goal => goal.trim()),
        skills: skills.split(',').map(skill => skill.trim()),
        availability: availabilityArray,
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
          visibleToOthers: true,
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
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Create/Edit Mentee Profile" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.readOnlyField}>
          <Text style={styles.readOnlyLabel}>Name</Text>
          <Text style={styles.readOnlyText}>{name}</Text>
        </View>

        <View style={styles.readOnlyField}>
          <Text style={styles.readOnlyLabel}>Username</Text>
          <Text style={styles.readOnlyText}>{username}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bio *</Text>
          <TextInput
            placeholder="Tell us about yourself..."
            value={bio}
            onChangeText={setBio}
            style={[styles.input, styles.bioInput]}
            placeholderTextColor="#999"
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Goals</Text>
          <TextInput
            placeholder="e.g., Learn Python, Improve Leadership"
            value={goals}
            onChangeText={setGoals}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Skills</Text>
          <TextInput
            placeholder="e.g., Coding, Public Speaking"
            value={skills}
            onChangeText={setSkills}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Availability</Text>
          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxItem}>
              <Checkbox
                status={availability.weekdays ? 'checked' : 'unchecked'}
                onPress={() => setAvailability({ ...availability, weekdays: !availability.weekdays })}
                color="#FFBA00"
              />
              <Text style={styles.checkboxText}>Weekdays</Text>
            </View>
            <View style={styles.checkboxItem}>
              <Checkbox
                status={availability.weekends ? 'checked' : 'unchecked'}
                onPress={() => setAvailability({ ...availability, weekends: !availability.weekends })}
                color="#FFBA00"
              />
              <Text style={styles.checkboxText}>Weekends</Text>
            </View>
            <View style={styles.checkboxItem}>
              <Checkbox
                status={availability.mornings ? 'checked' : 'unchecked'}
                onPress={() => setAvailability({ ...availability, mornings: !availability.mornings })}
                color="#FFBA00"
              />
              <Text style={styles.checkboxText}>Mornings</Text>
            </View>
            <View style={styles.checkboxItem}>
              <Checkbox
                status={availability.evenings ? 'checked' : 'unchecked'}
                onPress={() => setAvailability({ ...availability, evenings: !availability.evenings })}
                color="#FFBA00"
              />
              <Text style={styles.checkboxText}>Evenings</Text>
            </View>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Profile Image URL</Text>
          <TextInput
            placeholder="Enter a URL for your profile image"
            value={profileImage}
            onChangeText={setProfileImage}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>LinkedIn Profile URL</Text>
          <TextInput
            placeholder="Enter your LinkedIn profile URL"
            value={linkedIn}
            onChangeText={setLinkedIn}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Twitter Profile URL</Text>
          <TextInput
            placeholder="Enter your Twitter profile URL"
            value={twitter}
            onChangeText={setTwitter}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSaveMentee}
        >
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#6D9773',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    marginTop: 10,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#FFBA00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0C3B2E',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default CreateMenteeProfile;