import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import CustomAppBar from '../../../components/CustomAppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NoteViewScreen = ({ route, navigation }) => {
  const { noteId, userId } = route.params;
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
          Alert.alert('Error', 'Note not found');
          navigation.goBack();
        }
        setIsLoading(false);
      },
      (err) => {
        console.error('Error fetching note:', err);
        Alert.alert('Error', 'Failed to load note');
        setIsLoading(false);
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
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore()
                .collection('users')
                .doc(userId)
                .collection('notes')
                .doc(noteId)
                .delete();
              Alert.alert('Success', 'Note deleted successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
        <CustomAppBar title="View Note" showBackButton={true} />
        <View style={styles.loadingContainer}>
          <Icon name="loading" size={30} color="#FFBA00" />
          <Text style={styles.loadingText}>Loading note...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!note) {
    return (
      <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
        <CustomAppBar title="View Note" showBackButton={true} />
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={30} color="#FFBA00" />
          <Text style={styles.errorText}>Note not found</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar 
        title="View Note" 
        showBackButton={true}
        rightActions={[
          {
            icon: 'pencil',
            onPress: handleEditNote,
            color: '#FFBA00'
          },
          {
            icon: 'delete',
            onPress: handleDeleteNote,
            color: '#FFBA00'
          }
        ]}
      />
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Note Card */}
        <View style={styles.noteCard}>
          {/* Title Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="format-title" size={20} color="#FFBA00" />
              <Text style={styles.sectionTitle}>Title</Text>
            </View>
            <Text style={styles.title}>{note.title}</Text>
          </View>

          {/* Content Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="text" size={20} color="#FFBA00" />
              <Text style={styles.sectionTitle}>Content</Text>
            </View>
            <Text style={styles.content}>{note.content}</Text>
          </View>

          {/* Metadata Section */}
          <View style={styles.metaContainer}>
            {/* Category */}
            <View style={styles.metaItem}>
              <View style={styles.sectionHeader}>
                <Icon name="tag" size={18} color="#FFBA00" />
                <Text style={styles.metaTitle}>Category</Text>
              </View>
              <Text style={styles.metaContent}>{note.category || 'Uncategorized'}</Text>
            </View>

            {/* Tags */}
            <View style={styles.metaItem}>
              <View style={styles.sectionHeader}>
                <Icon name="tag-multiple" size={18} color="#FFBA00" />
                <Text style={styles.metaTitle}>Tags</Text>
              </View>
              <View style={styles.tagsContainer}>
                {note.tags && note.tags.length > 0 ? (
                  note.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.metaContent}>No tags</Text>
                )}
              </View>
            </View>

            {/* Created Date */}
            <View style={styles.metaItem}>
              <View style={styles.sectionHeader}>
                <Icon name="calendar" size={18} color="#FFBA00" />
                <Text style={styles.metaTitle}>Created</Text>
              </View>
              <Text style={styles.metaContent}>
                {note.createdAt?.toDate().toLocaleString() || 'Unknown date'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={handleEditNote}
          >
            <Icon name="pencil" size={20} color="#0C3B2E" />
            <Text style={styles.buttonText}>Edit Note</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDeleteNote}
          >
            <Icon name="delete" size={20} color="#FFFFFF" />
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Delete Note</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  noteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0C3B2E',
    marginLeft: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0C3B2E',
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  metaContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 15,
  },
  metaItem: {
    marginBottom: 15,
  },
  metaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0C3B2E',
    marginLeft: 8,
  },
  metaContent: {
    fontSize: 14,
    color: '#555',
    marginLeft: 28,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 28,
  },
  tag: {
    backgroundColor: '#E0F2F1',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#00796B',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#FFBA00',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
};

export default NoteViewScreen;