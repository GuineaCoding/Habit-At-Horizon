import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const EditNoteScreen = ({ route, navigation }) => {
  const { noteId, userId } = route.params;
  const [note, setNote] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],
    attachments: [],
  });

  useEffect(() => {
    const noteRef = firestore()
      .collection('users')
      .doc(userId)
      .collection('notes')
      .doc(noteId);

    const unsubscribe = noteRef.onSnapshot(doc => {
      if (doc.exists) {
        setNote({
          id: doc.id,
          title: doc.data().title,
          content: doc.data().content,
          category: doc.data().category,
          tags: doc.data().tags,
          attachments: doc.data().attachments || [],
        });
      } else {
        console.log('No such document!');
      }
    });

    return () => unsubscribe();
  }, [noteId, userId]);

  const handleSave = () => {
    const noteRef = firestore()
      .collection('users')
      .doc(userId)
      .collection('notes')
      .doc(noteId);

    noteRef.update({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags,
      attachments: note.attachments,
    })
    .then(() => {
      Alert.alert('Success', 'Note updated successfully');
      navigation.goBack();
    })
    .catch(error => {
      Alert.alert('Error', 'Note update failed: ' + error.message);
    });
  };

  const handleChange = (value, field) => {
    setNote(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={note.title}
        onChangeText={(text) => handleChange(text, 'title')}
      />

      <Text style={styles.label}>Content:</Text>
      <TextInput
        style={styles.input}
        value={note.content}
        onChangeText={(text) => handleChange(text, 'content')}
        multiline
      />

      <Text style={styles.label}>Category:</Text>
      <TextInput
        style={styles.input}
        value={note.category}
        onChangeText={(text) => handleChange(text, 'category')}
      />

      <Text style={styles.label}>Tags (comma-separated):</Text>
      <TextInput
        style={styles.input}
        value={note.tags.join(', ')}
        onChangeText={(text) => handleChange(text.split(',').map(tag => tag.trim()), 'tags')}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
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
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    fontSize: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default EditNoteScreen;
