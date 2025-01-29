import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const NoteListScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'current', title: 'Current' },
    { key: 'archived', title: 'Archived' },
    { key: 'tags', title: 'Tags' }, 
  ]);
  const [notes, setNotes] = useState([]); 
  const [archivedNotes, setArchivedNotes] = useState([]);  
  const [tags, setTags] = useState([]); / 
  const [filteredNotes, setFilteredNotes] = useState([]);  
  const [selectedTag, setSelectedTag] = useState(null);  
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        fetchNotes(user.uid, false);  
        fetchNotes(user.uid, true) 
      } else {
        Alert.alert('Error', 'User not logged in.');
        navigation.goBack();
      }
    });
    return subscriber;  
  }, []);

  const fetchNotes = (userId, isArchived) => {
    console.log(`Fetching notes for user ${userId} with isArchived status ${isArchived}`);
    firestore()
      .collection('users')
      .doc(userId)
      .collection('notes')
      .where('isArchived', '==', isArchived)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          if (snapshot.empty) {
            console.log('No notes found');
            isArchived ? setArchivedNotes([]) : setNotes([]);
          } else {
            const fetchedNotes = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            console.log(`Fetched ${fetchedNotes.length} notes`);
            isArchived ? setArchivedNotes(fetchedNotes) : setNotes(fetchedNotes);

           
            const allTags = fetchedNotes.flatMap((note) => note.tags || []);
            const uniqueTags = [...new Set(allTags)]; 
            setTags(uniqueTags);
          }
        },
        (error) => {
          console.error('Failed to fetch notes: ', error);
          Alert.alert('Error', 'Failed to fetch notes');
        }
      );
  };

  const handleTagPress = (tag) => {
    setSelectedTag(tag);  
    const filtered = notes.filter((note) => note.tags && note.tags.includes(tag));
    setFilteredNotes(filtered);  
  };

  const renderNoteItem = ({ item, isArchived }) => {
    const noteColor = item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'yellow' : 'green';
    return (
      <View style={[styles.noteItem, { borderLeftColor: noteColor, borderLeftWidth: 5 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('NoteViewScreen', { noteId: item.id, userId })}>
          <Text style={styles.noteTitle}>{item.title}</Text>
          <Text style={styles.noteFolder}>Folder: {item.folder}</Text>
          <Text style={styles.noteTags}>Tags: {item.tags?.join(', ') || 'No tags'}</Text>
        </TouchableOpacity>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleArchiveNote(item.id, !isArchived)}
          >
            <Text style={styles.buttonText}>{isArchived ? 'Unarchive' : 'Archive'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => handleDeleteNote(item.id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const CurrentNotes = () => (
    <FlatList
      data={filteredNotes.length > 0 ? filteredNotes : notes}
      renderItem={(item) => renderNoteItem({ ...item, isArchived: false })}
      keyExtractor={(item) => item.id}
    />
  );

  const ArchivedNotes = () => (
    <FlatList
      data={archivedNotes}
      renderItem={(item) => renderNoteItem({ ...item, isArchived: true })}
      keyExtractor={(item) => item.id}
    />
  );

  const TagsTab = () => (
    <FlatList
      ListHeaderComponent={
        <View style={styles.tagsContainer}>
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagItem,
                selectedTag === tag && styles.selectedTagItem, 
              ]}
              onPress={() => handleTagPress(tag)}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      }
      data={selectedTag ? filteredNotes : []}
      renderItem={(item) => renderNoteItem({ ...item, isArchived: false })}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Select a tag to view related notes.</Text>
        </View>
      }
    />
  );

  const handleArchiveNote = (noteId, isArchived) => {
    firestore()
      .collection('users')
      .doc(userId)
      .collection('notes')
      .doc(noteId)
      .update({ isArchived })
      .then(() => {
        Alert.alert('Success', `Note has been ${isArchived ? 'archived' : 'unarchived'}.`);
        fetchNotes(userId, false); 
        fetchNotes(userId, true); 
      })
      .catch((error) => Alert.alert('Error', error.message));
  };

  const handleDeleteNote = (noteId) => {
    firestore()
      .collection('users')
      .doc(userId)
      .collection('notes')
      .doc(noteId)
      .delete()
      .then(() => {
        Alert.alert('Success', 'Note deleted successfully');
        fetchNotes(userId, false); 
        fetchNotes(userId, true); 
      })
      .catch((error) => Alert.alert('Error', error.message));
  };

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          current: CurrentNotes,
          archived: ArchivedNotes,
          tags: TagsTab, 
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: '100%' }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={{ backgroundColor: '#6200EE' }}
            labelStyle={{ color: 'white' }}
          />
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateNoteScreen', { userId })}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noteItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  noteFolder: {
    fontSize: 14,
    color: '#666',
  },
  noteTags: {
    fontSize: 14,
    color: '#666',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  tagItem: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  selectedTagItem: {
    backgroundColor: '#6200EE',
  },
  tagText: {
    fontSize: 16,
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default NoteListScreen;