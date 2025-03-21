import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import CustomAppBar from '../../../components/CustomAppBar';
import { noteListStyles } from './styles';

const NoteListScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'current', title: 'Current' },
    { key: 'archived', title: 'Archived' },
    { key: 'tags', title: 'Tags' },
  ]);
  const [notes, setNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        fetchNotes(user.uid, false);
        fetchNotes(user.uid, true);
      } else {
        Alert.alert('Error', 'User not logged in.');
        navigation.goBack();
      }
    });
    return subscriber;
  }, []);

  const fetchNotes = (userId, isArchived) => {
    firestore()
      .collection('users')
      .doc(userId)
      .collection('notes')
      .where('isArchived', '==', isArchived)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          if (snapshot.empty) {
            isArchived ? setArchivedNotes([]) : setNotes([]);
          } else {
            const fetchedNotes = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
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
    const noteColor = item.priority === 'high' ? '#FF3B30' : item.priority === 'medium' ? '#FFCC00' : '#34C759';
    return (
      <View style={[noteListStyles.noteItem, { borderLeftColor: noteColor, borderLeftWidth: 5 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('NoteViewScreen', { noteId: item.id, userId })}>
          <Text style={noteListStyles.noteTitle}>{item.title}</Text>
          <Text style={noteListStyles.noteCategory}>Category: {item.category}</Text>
          <Text style={noteListStyles.noteTags}>Tags: {item.tags?.join(', ') || 'No tags'}</Text>
        </TouchableOpacity>
        <View style={noteListStyles.buttonsContainer}>
          <TouchableOpacity
            style={[noteListStyles.button, { backgroundColor: '#6D9773' }]}
            onPress={() => handleArchiveNote(item.id, !isArchived)}
          >
            <Text style={noteListStyles.buttonText}>{isArchived ? 'Unarchive' : 'Archive'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[noteListStyles.button, noteListStyles.deleteButton]}
            onPress={() => handleDeleteNote(item.id)}
          >
            <Text style={noteListStyles.buttonText}>Delete</Text>
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
      contentContainerStyle={noteListStyles.listContent}
    />
  );

  const ArchivedNotes = () => (
    <FlatList
      data={archivedNotes}
      renderItem={(item) => renderNoteItem({ ...item, isArchived: true })}
      keyExtractor={(item) => item.id}
      contentContainerStyle={noteListStyles.listContent}
    />
  );

  const TagsTab = () => (
    <FlatList
      ListHeaderComponent={
        <View style={noteListStyles.tagsContainer}>
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                noteListStyles.tagItem,
                selectedTag === tag && noteListStyles.selectedTagItem,
              ]}
              onPress={() => handleTagPress(tag)}
            >
              <Text style={noteListStyles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      }
      data={selectedTag ? filteredNotes : []}
      renderItem={(item) => renderNoteItem({ ...item, isArchived: false })}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View style={noteListStyles.emptyContainer}>
          <Text style={noteListStyles.emptyText}>Select a tag to view related notes.</Text>
        </View>
      }
      contentContainerStyle={noteListStyles.listContent}
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
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={noteListStyles.container}>
      <CustomAppBar title="Notes" showBackButton={true} />
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
            indicatorStyle={{ backgroundColor: '#FFBA00' }}
            style={{ backgroundColor: '#0C3B2E' }}
            labelStyle={{ color: 'white' }}
          />
        )}
      />
      <TouchableOpacity
        style={noteListStyles.addButton}
        onPress={() => navigation.navigate('CreateNoteScreen', { userId })}
      >
        <Text style={noteListStyles.addButtonText}>+</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default NoteListScreen;