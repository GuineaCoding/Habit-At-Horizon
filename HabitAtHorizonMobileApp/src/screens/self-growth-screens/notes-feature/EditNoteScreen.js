import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import CustomAppBar from '../../../components/CustomAppBar';
import { editNoteStyles } from './styles'; 

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

    const unsubscribe = noteRef.onSnapshot((doc) => {
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

    noteRef
      .update({
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
      .catch((error) => {
        Alert.alert('Error', 'Note update failed: ' + error.message);
      });
  };

  const handleChange = (value, field) => {
    setNote((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={editNoteStyles.container}>
      <CustomAppBar title="Edit Note" showBackButton={true} />
      <ScrollView contentContainerStyle={editNoteStyles.contentContainer}>
        {/* Title Field */}
        <View style={editNoteStyles.inputContainer}>
          <Text style={editNoteStyles.label}>Title:</Text>
          <TextInput
            style={editNoteStyles.input}
            value={note.title}
            onChangeText={(text) => handleChange(text, 'title')}
            placeholder="Enter note title"
            placeholderTextColor="#999"
          />
        </View>

        {/* Content Field */}
        <View style={editNoteStyles.inputContainer}>
          <Text style={editNoteStyles.label}>Content:</Text>
          <TextInput
            style={[editNoteStyles.input, editNoteStyles.contentInput]}
            value={note.content}
            onChangeText={(text) => handleChange(text, 'content')}
            placeholder="Enter note content"
            placeholderTextColor="#999"
            multiline
          />
        </View>

        {/* Category Field */}
        <View style={editNoteStyles.inputContainer}>
          <Text style={editNoteStyles.label}>Category:</Text>
          <TextInput
            style={editNoteStyles.input}
            value={note.category}
            onChangeText={(text) => handleChange(text, 'category')}
            placeholder="Enter note category"
            placeholderTextColor="#999"
          />
        </View>

        {/* Tags Field */}
        <View style={editNoteStyles.inputContainer}>
          <Text style={editNoteStyles.label}>Tags (comma-separated):</Text>
          <TextInput
            style={editNoteStyles.input}
            value={note.tags.join(', ')}
            onChangeText={(text) => handleChange(text.split(',').map((tag) => tag.trim()), 'tags')}
            placeholder="e.g., #Study, #Ideas"
            placeholderTextColor="#999"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={editNoteStyles.button} onPress={handleSave}>
          <Text style={editNoteStyles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default EditNoteScreen;