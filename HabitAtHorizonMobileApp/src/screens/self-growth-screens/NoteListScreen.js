import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const NoteListScreen = ({ navigation, route }) => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userId, setUserId] = useState(null);


  useEffect(() => {
    if (route.params?.userId) {
      setUserId(route.params.userId);
    } else {
      const user = auth().currentUser;
      if (user) {
        setUserId(user.uid);
      } else {
        Alert.alert('Error', 'User not logged in.');
        navigation.goBack(); 
      }
    }
  }, [route.params]);

  useEffect(() => {
    if (!userId) return; 

    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .collection('notes')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const notesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesData);
      });

    return () => unsubscribe();
  }, [userId]);

  const handleNotePress = (note) => {
    navigation.navigate('NoteDetailsScreen', { note, userId });
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderNoteItem = ({ item }) => (
    <TouchableOpacity style={styles.noteItem} onPress={() => handleNotePress(item)}>
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteFolder}>Folder: {item.folder}</Text>
      <Text style={styles.noteTags}>Tags: {item.tags.join(', ')}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search notes..."
      />
      <FlatList
        data={filteredNotes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateNoteScreen', { userId })}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  noteItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteFolder: {
    fontSize: 14,
    color: '#666',
  },
  noteTags: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6200EE',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 30,
    color: 'white',
  },
});

export default NoteListScreen;