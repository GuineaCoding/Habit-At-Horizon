import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import CustomAppBar from '../../../components/CustomAppBar';
import { noteViewStyles } from './styles'; 

const NoteViewScreen = ({ route, navigation }) => {
  const { noteId, userId } = route.params;
  const [note, setNote] = useState(null);

  useEffect(() => {
    const noteRef = firestore()
      .collection('users')
      .doc(userId)
      .collection('notes')
      .doc(noteId);

    const unsubscribe = noteRef.onSnapshot(
      (doc) => {
        if (doc.exists) {
          setNote({
            id: doc.id,
            ...doc.data(),
          });
        } else {
          console.log('No such document!');
        }
      },
      (err) => {
        console.error('Error fetching note:', err);
      }
    );

    return () => unsubscribe();
  }, [noteId, userId]);

  const handleEditNote = () => {
    navigation.navigate('EditNoteScreen', { noteId, userId });
  };

  const handleDeleteNote = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            firestore()
              .collection('users')
              .doc(userId)
              .collection('notes')
              .doc(noteId)
              .delete()
              .then(() => {
                Alert.alert('Note deleted successfully');
                navigation.goBack();
              })
              .catch((error) => {
                Alert.alert('Error deleting note', error.message);
              });
          },
        },
      ]
    );
  };

  if (!note) {
    return (
      <LinearGradient colors={['#0C3B2E', '#6D9773']} style={noteViewStyles.container}>
        <CustomAppBar title="View Note" showBackButton={true} />
        <View style={noteViewStyles.loadingContainer}>
          <Text style={noteViewStyles.loadingText}>Loading note...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={noteViewStyles.container}>
      <CustomAppBar title="View Note" showBackButton={true} />
      <ScrollView contentContainerStyle={noteViewStyles.contentContainer}>
        {/* Title Section */}
        <View style={noteViewStyles.section}>
          <Text style={noteViewStyles.sectionTitle}>Title</Text>
          <View style={noteViewStyles.titleContainer}>
            <Text style={noteViewStyles.title}>{note.title}</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={noteViewStyles.section}>
          <Text style={noteViewStyles.sectionTitle}>Content</Text>
          <View style={noteViewStyles.contentContainer}>
            <Text style={noteViewStyles.content}>{note.content}</Text>
          </View>
        </View>

        {/* Category Section */}
        <View style={noteViewStyles.section}>
          <Text style={noteViewStyles.sectionTitle}>Category</Text>
          <Text style={noteViewStyles.sectionContent}>{note.category}</Text>
        </View>

        {/* Tags Section */}
        <View style={noteViewStyles.section}>
          <Text style={noteViewStyles.sectionTitle}>Tags</Text>
          <Text style={noteViewStyles.sectionContent}>
            {note.tags ? note.tags.join(', ') : 'No tags'}
          </Text>
        </View>

        {/* Attachments Section */}
        {note.attachments && note.attachments.length > 0 && (
          <View style={noteViewStyles.section}>
            <Text style={noteViewStyles.sectionTitle}>Attachments</Text>
            {note.attachments.map((attachment, index) => (
              <Text key={index} style={noteViewStyles.sectionContent}>
                {attachment}
              </Text>
            ))}
          </View>
        )}

        {/* Buttons */}
        <TouchableOpacity
          style={[noteViewStyles.button, { backgroundColor: '#6D9773' }]}
          onPress={handleEditNote}
        >
          <Text style={noteViewStyles.buttonText}>Edit Note</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[noteViewStyles.button, { backgroundColor: '#B46617' }]}
          onPress={handleDeleteNote}
        >
          <Text style={noteViewStyles.buttonText}>Delete Note</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default NoteViewScreen;