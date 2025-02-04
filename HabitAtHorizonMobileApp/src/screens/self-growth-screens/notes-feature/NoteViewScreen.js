import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const NoteViewScreen = ({ route, navigation }) => {
  const { noteId, userId } = route.params;
  const [note, setNote] = useState(null);

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
          ...doc.data(),
        });
      } else {
        console.log('No such document!');
      }
    }, err => {
      console.error('Error fetching note:', err);
    });

    return () => unsubscribe();
  }, [noteId, userId]);

  const handleEditNote = () => {
    navigation.navigate('EditNoteScreen', { noteId, userId });
  };

  const handleDeleteNote = () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Delete", onPress: () => {
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
            .catch(error => {
              Alert.alert('Error deleting note', error.message);
            });
          }
        }
      ]
    );
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading note...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.content}>{note.content}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Folder</Text>
        <Text style={styles.sectionContent}>{note.folder}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tags</Text>
        <Text style={styles.sectionContent}>{note.tags ? note.tags.join(', ') : 'No tags'}</Text>
      </View>

      {note.attachments && note.attachments.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attachments</Text>
          {note.attachments.map((attachment, index) => (
            <Text key={index} style={styles.sectionContent}>
              {attachment}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity style={[styles.button, { backgroundColor: '#6D9773' }]} onPress={handleEditNote}>
        <Text style={styles.buttonText}>Edit Note</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#B46617' }]} onPress={handleDeleteNote}>
        <Text style={styles.buttonText}>Delete Note</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0C3B2E',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFBA00',
  },
  sectionContent: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  button: {
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NoteViewScreen;