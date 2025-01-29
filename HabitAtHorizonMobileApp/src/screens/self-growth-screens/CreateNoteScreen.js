import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const CreateNoteScreen = ({ navigation, route }) => {
  const { userId } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folder, setFolder] = useState('Work');
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
          folder,
          tags: tags.split(',').map((tag) => tag.trim()),
          attachments,
          isPinned: false,
          isArchived: false,
          createdAt: firestore.Timestamp.fromDate(new Date()),
          updatedAt: firestore.Timestamp.fromDate(new Date()),
        });
      alert('Note added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding note: ', error);
      alert('Failed to add note.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter note title"
      />

      <Text style={styles.label}>Content</Text>
      <TextInput
        style={[styles.input, { height: 150 }]}
        value={content}
        onChangeText={setContent}
        placeholder="Enter note content"
        multiline
      />

      <Text style={styles.label}>Folder</Text>
      <Picker
        selectedValue={folder}
        onValueChange={(itemValue) => setFolder(itemValue)}>
        <Picker.Item label="Work" value="Work" />
        <Picker.Item label="Personal" value="Personal" />
        <Picker.Item label="Ideas" value="Ideas" />
      </Picker>

      <Text style={styles.label}>Tags (comma-separated)</Text>
      <TextInput
        style={styles.input}
        value={tags}
        onChangeText={setTags}
        placeholder="e.g., #Study, #Ideas"
      />

      <Button title="Add Note" onPress={handleAddNote} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default CreateNoteScreen;