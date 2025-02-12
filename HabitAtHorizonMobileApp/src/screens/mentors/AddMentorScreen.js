import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const AddMentorForm = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const handleAddMentor = async () => {
    try {
      await firestore().collection('mentors').add({
        name,
        username,
        bio,
        expertise,
        profileImage,
      });
      alert('Mentor added successfully!');
    } catch (error) {
      console.error('Error adding mentor:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        style={styles.input}
      />
      <TextInput
        placeholder="Expertise"
        value={expertise}
        onChangeText={setExpertise}
        style={styles.input}
      />
      <TextInput
        placeholder="Profile Image URL"
        value={profileImage}
        onChangeText={setProfileImage}
        style={styles.input}
      />
      <Button title="Add Mentor" onPress={handleAddMentor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
});

export default AddMentorForm;