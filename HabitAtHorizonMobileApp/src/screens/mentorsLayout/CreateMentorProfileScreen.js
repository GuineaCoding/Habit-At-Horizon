import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomAppBar from '../../components/CustomAppBar';
import LinearGradient from 'react-native-linear-gradient';

const AddMentorForm = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [tags, setTags] = useState('');
  const [availability, setAvailability] = useState('');
  const [languages, setLanguages] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [twitter, setTwitter] = useState('');
  const [mentorId, setMentorId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const userId = auth().currentUser?.uid;

  useEffect(() => {
    const fetchUserAndMentorProfile = async () => {
      if (userId) {

        const userSnapshot = await firestore()
          .collection('users')
          .doc(userId)
          .get();

        if (userSnapshot.exists) {
          const userData = userSnapshot.data();
          setName(userData.name || '');
          setUsername(userData.username || '');
        }

        const mentorSnapshot = await firestore()
          .collection('mentors')
          .where('userId', '==', userId)
          .get();

        if (!mentorSnapshot.empty) {
          const mentorData = mentorSnapshot.docs[0].data();
          const mentorDocId = mentorSnapshot.docs[0].id;
          setBio(mentorData.bio || '');
          setExpertise(mentorData.expertise || '');
          setProfileImage(mentorData.profileImage || '');
          setTags(mentorData.tags?.join(', ') || ''); 
          setAvailability(mentorData.availability?.join(', ') || ''); 
          setLanguages(mentorData.languages?.join(', ') || ''); 
          setExperienceLevel(mentorData.experienceLevel || '');
          setLinkedIn(mentorData.linkedIn || '');
          setTwitter(mentorData.twitter || '');
          setMentorId(mentorDocId);
        }
        setIsLoading(false);
      }
    };

    fetchUserAndMentorProfile();
  }, [userId]);

  const handleSaveMentor = async () => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to create or update a mentor profile.');
      return;
    }

    try {
      const mentorData = {
        name,
        username,
        bio,
        expertise,
        profileImage,
        tags: tags.split(',').map(tag => tag.trim()), 
        availability: availability.split(',').map(avail => avail.trim()),
        languages: languages.split(',').map(lang => lang.trim()), 
        experienceLevel,
        linkedIn,
        twitter,
        userId,
      };

      if (mentorId) {
        await firestore().collection('mentors').doc(mentorId).update(mentorData);
        Alert.alert('Success', 'Mentor profile updated successfully!');
      } else {
        await firestore().collection('mentors').add(mentorData);
        Alert.alert('Success', 'Mentor profile created successfully!');
      }
    } catch (error) {
      console.error('Error saving mentor:', error);
      Alert.alert('Error', 'Failed to save mentor profile.');
    }
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Create Mentor Profile" showBackButton={true} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            style={styles.disabledInput}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            style={styles.disabledInput}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            placeholder="Enter your bio"
            value={bio}
            onChangeText={setBio}
            style={styles.input}
            placeholderTextColor="#999"
            multiline
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Expertise</Text>
          <TextInput
            placeholder="e.g., Software Development, Leadership"
            value={expertise}
            onChangeText={setExpertise}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tags</Text>
          <TextInput
            placeholder="e.g., Career, Coding, Leadership"
            value={tags}
            onChangeText={setTags}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Availability</Text>
          <TextInput
            placeholder="e.g., Weekdays, Evenings"
            value={availability}
            onChangeText={setAvailability}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Languages</Text>
          <TextInput
            placeholder="e.g., English, Spanish"
            value={languages}
            onChangeText={setLanguages}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Experience Level</Text>
          <TextInput
            placeholder="e.g., Beginner, Intermediate, Expert"
            value={experienceLevel}
            onChangeText={setExperienceLevel}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>LinkedIn Profile URL</Text>
          <TextInput
            placeholder="Enter your LinkedIn URL"
            value={linkedIn}
            onChangeText={setLinkedIn}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Twitter Profile URL</Text>
          <TextInput
            placeholder="Enter your Twitter URL"
            value={twitter}
            onChangeText={setTwitter}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Profile Image URL</Text>
          <TextInput
            placeholder="Enter your profile image URL"
            value={profileImage}
            onChangeText={setProfileImage}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSaveMentor}
        >
          <Text style={styles.buttonText}>
            {mentorId ? 'Update Mentor Profile' : 'Create Mentor Profile'}
          </Text>
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
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#FFBA00',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#6D9773',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  disabledInput: {
    borderWidth: 1,
    borderColor: '#6D9773',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#E0E0E0',
    color: '#000000',
  },
  button: {
    backgroundColor: '#FFBA00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#0C3B2E',
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AddMentorForm;