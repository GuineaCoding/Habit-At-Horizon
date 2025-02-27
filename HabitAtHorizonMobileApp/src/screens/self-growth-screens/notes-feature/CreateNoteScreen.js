import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import CustomAppBar from '../../../components/CustomAppBar'; 

const CreateNoteScreen = ({ navigation, route }) => {
  const { userId } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Work');
  const [tags, setTags] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleAddNote = async () => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('notes')
        .add({
          title,
          content,
          category,
          tags: tags.split(',').map((tag) => tag.trim()),
          attachments,
          isPinned: false,
          isArchived: false,
          createdAt: firestore.Timestamp.fromDate(new Date()),
          updatedAt: firestore.Timestamp.fromDate(new Date()),
        });
      Alert.alert('Success', 'Note added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding note: ', error);
      Alert.alert('Error', 'Failed to add note.');
    }
  };

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Create New Note" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Title Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            placeholder="Enter note title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        {/* Content Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Content *</Text>
          <TextInput
            placeholder="Enter note content"
            value={content}
            onChangeText={setContent}
            style={[styles.input, styles.bioInput]}
            placeholderTextColor="#999"
            multiline
          />
        </View>

        {/* Category Picker */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Work" value="Work" />
              <Picker.Item label="Personal" value="Personal" />
              <Picker.Item label="Ideas" value="Ideas" />
            </Picker>
          </View>
        </View>

        {/* Tags Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tags (comma-separated)</Text>
          <TextInput
            placeholder="e.g., #Study, #Ideas"
            value={tags}
            onChangeText={setTags}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.button} onPress={handleAddNote}>
          <Text style={styles.buttonText}>Add Note</Text>
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
    height: 150,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#6D9773',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
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
});

export default CreateNoteScreen;