import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import CustomAppBar from '../../../components/CustomAppBar';
import { createNoteStyles } from './styles';

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
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={createNoteStyles.container}>
      <CustomAppBar title="Create New Note" showBackButton={true} />

      <ScrollView contentContainerStyle={createNoteStyles.content}>
        {/* Title Field */}
        <View style={createNoteStyles.inputContainer}>
          <Text style={createNoteStyles.label}>Title *</Text>
          <TextInput
            placeholder="Enter note title"
            value={title}
            onChangeText={setTitle}
            style={createNoteStyles.input}
            placeholderTextColor="#999"
          />
        </View>

        {/* Content Field */}
        <View style={createNoteStyles.inputContainer}>
          <Text style={createNoteStyles.label}>Content *</Text>
          <TextInput
            placeholder="Enter note content"
            value={content}
            onChangeText={setContent}
            style={[createNoteStyles.input, createNoteStyles.bioInput]}
            placeholderTextColor="#999"
            multiline
          />
        </View>

        <View style={createNoteStyles.inputContainer}>
          <Text style={createNoteStyles.label}>Category</Text>
          <View style={createNoteStyles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={createNoteStyles.picker}
            >
              <Picker.Item label="Work" value="Work" />
              <Picker.Item label="Personal" value="Personal" />
              <Picker.Item label="Ideas" value="Ideas" />
            </Picker>
          </View>
        </View>

        {/* Tags Field */}
        <View style={createNoteStyles.inputContainer}>
          <Text style={createNoteStyles.label}>Tags (comma-separated)</Text>
          <TextInput
            placeholder="e.g., #Study, #Ideas"
            value={tags}
            onChangeText={setTags}
            style={createNoteStyles.input}
            placeholderTextColor="#999"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={createNoteStyles.button} onPress={handleAddNote}>
          <Text style={createNoteStyles.buttonText}>Add Note</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default CreateNoteScreen;