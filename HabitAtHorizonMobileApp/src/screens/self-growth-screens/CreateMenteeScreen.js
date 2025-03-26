import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
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
            setProfileImage(userData.profileImage || ''); // Automatically get profile image
            setGoals(userData.menteeData?.goals?.join(', ') || '');
            setSkills(userData.menteeData?.skills?.join(', ') || '');
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
          profileImage, // Automatically saved from registration
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
      <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Create/Edit Mentee Profile" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <LinearGradient
              colors={['#0C3B2E', '#6D9773']}
              style={styles.profileCircle}
            >
              <Text style={styles.profileLetter}>
                {username ? username.charAt(0).toUpperCase() : 'M'}
              </Text>
            </LinearGradient>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.username}>@{username}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About Me *</Text>
          <TextInput
            placeholder="Tell us about yourself..."
            value={bio}
            onChangeText={setBio}
            style={styles.bioInput}
            placeholderTextColor="#999"
            multiline
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Goals</Text>
          <TextInput
            placeholder="e.g., Learn Python, Improve Leadership"
            value={goals}
            onChangeText={setGoals}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <TextInput
            placeholder="e.g., Coding, Public Speaking"
            value={skills}
            onChangeText={setSkills}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Availability</Text>
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

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Social Media</Text>
          <TextInput
            placeholder="LinkedIn profile URL"
            value={linkedIn}
            onChangeText={setLinkedIn}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TextInput
            placeholder="Twitter username"
            value={twitter}
            onChangeText={setTwitter}
            style={[styles.input, { marginTop: 10 }]}
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
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    borderWidth: 3,
    borderColor: '#FFBA00',
    resizeMode: 'cover',
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 3,
    borderColor: '#FFBA00',
  },
  profileLetter: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  username: {
    fontSize: 16,
    color: '#FFBA00',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFBA00',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#6D9773',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#6D9773',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    color: '#000000',
    height: 100,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    marginTop: 8,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#FFBA00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
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
    marginTop: 20,
  },
});

export default CreateMenteeProfile;