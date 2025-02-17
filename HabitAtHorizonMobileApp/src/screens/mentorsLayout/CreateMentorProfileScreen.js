import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomAppBar from '../../components/CustomAppBar';

const AddMentorForm = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [mentorId, setMentorId] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 

  const userId = auth().currentUser?.uid;

  useEffect(() => {
    const fetchMentorProfile = async () => {
      if (userId) {
        const mentorSnapshot = await firestore()
          .collection('mentors')
          .where('userId', '==', userId)
          .get();

        if (!mentorSnapshot.empty) {
          const mentorData = mentorSnapshot.docs[0].data();
          const mentorDocId = mentorSnapshot.docs[0].id;
          setName(mentorData.name);
          setUsername(mentorData.username);
          setBio(mentorData.bio);
          setExpertise(mentorData.expertise);
          setProfileImage(mentorData.profileImage);
          setMentorId(mentorDocId); 
        }
        setIsLoading(false); 
      }
    };

    fetchMentorProfile();
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
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    <CustomAppBar title="Create Mentor Profile" showBackButton={false} />
      <View style={styles.content}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Bio"
          value={bio}
          onChangeText={setBio}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Expertise"
          value={expertise}
          onChangeText={setExpertise}
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
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#B46617' }]} 
          onPress={handleSaveMentor}
        >
          <Text style={styles.buttonText}>
            {mentorId ? 'Update Mentor Profile' : 'Create Mentor Profile'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C3B2E', 
  },
  topBar: {
    height: 60,
    backgroundColor: '#6D9773',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight, 
  },
  topBarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', 
  },
  content: {
    flex: 1,
    padding: 20,
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

export default AddMentorForm;