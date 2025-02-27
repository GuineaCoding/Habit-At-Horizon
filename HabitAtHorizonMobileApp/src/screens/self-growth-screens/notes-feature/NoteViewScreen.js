import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import CustomAppBar from '../../../components/CustomAppBar'; 

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
      <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
        <CustomAppBar title="View Note" showBackButton={true} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading note...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="View Note" showBackButton={true} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Title Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Title</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{note.title}</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content</Text>
          <View style={styles.contentContainer}>
            <Text style={styles.content}>{note.content}</Text>
          </View>
        </View>

        {/* Category Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <Text style={styles.sectionContent}>{note.category}</Text>
        </View>

        {/* Tags Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <Text style={styles.sectionContent}>
            {note.tags ? note.tags.join(', ') : 'No tags'}
          </Text>
        </View>

        {/* Attachments Section */}
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

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#6D9773' }]}
          onPress={handleEditNote}
        >
          <Text style={styles.buttonText}>Edit Note</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#B46617' }]}
          onPress={handleDeleteNote}
        >
          <Text style={styles.buttonText}>Delete Note</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFBA00',
    marginBottom: 10,
  },
  titleContainer: {
    borderRadius: 10,
    padding: 15
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contentContainer: {
    padding: 15,
    borderColor: '#6D9773',
  },
  content: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  sectionContent: {
    fontSize: 16,
    color: '#FFFFFF',
    padding: 10,
    
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