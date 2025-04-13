import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import CustomAppBar from '../../../components/CustomAppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { noteListScreenStyle as styles } from './styles';
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
  const [refreshKey, setRefreshKey] = useState(0);

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

  const fetchAllTags = (userId) => {
    firestore()
      .collection('users')
      .doc(userId)
      .collection('notes')
      .get()
      .then((querySnapshot) => {
        const allTags = [];
        querySnapshot.forEach((doc) => {
          const noteTags = doc.data().tags || [];
          allTags.push(...noteTags);
        });
        const uniqueTags = [...new Set(allTags)];
        setTags(uniqueTags);
      })
      .catch((error) => {
        console.error('Error fetching tags:', error);
      });
  };

  const fetchNotes = (userId, isArchived) => {
    const unsubscribe = firestore()
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
              createdAt: doc.data().createdAt?.toDate(),
            }));
            isArchived ? setArchivedNotes(fetchedNotes) : setNotes(fetchedNotes);
            
            fetchAllTags(userId);
          }
          setRefreshKey(prev => prev + 1);
        },
        (error) => {
          console.error('Failed to fetch notes: ', error);
          Alert.alert('Error', 'Failed to fetch notes');
        }
      );

    return unsubscribe;
  };

  const handleTagPress = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag);
    const filtered = [...notes, ...archivedNotes].filter((note) => note.tags && note.tags.includes(tag));
    setFilteredNotes(filtered);
  };

  const renderNoteItem = ({ item, isArchived }) => {
    const priorityColor = {
      high: '#FF6B6B',
      medium: '#FFBA00',
      low: '#6D9773'
    }[item.priority] || '#34C759';

    const createdAtDate = item.createdAt?.toDate 
      ? item.createdAt.toDate() 
      : item.createdAt instanceof Date 
        ? item.createdAt 
        : null;
    
    const formattedDate = createdAtDate 
      ? createdAtDate.toLocaleDateString() 
      : 'No date';

    return (
      <View style={styles.noteCard}>
        <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />
        
        <TouchableOpacity 
          style={styles.noteContent}
          onPress={() => navigation.navigate('NoteViewScreen', { noteId: item.id, userId })}
        >
          <Text style={styles.noteTitle}>{item.title}</Text>
          <Text style={styles.notePreview} numberOfLines={2}>
            {item.content?.substring(0, 100)}{item.content?.length > 100 ? '...' : ''}
          </Text>
          
          <View style={styles.noteMeta}>
            <View style={styles.metaItem}>
              <Icon name="tag" size={16} color="#6D9773" />
              <Text style={styles.metaText}>{item.category || 'Uncategorized'}</Text>
            </View>
            
            {item.tags?.length > 0 && (
              <View style={styles.metaItem}>
                <Icon name="tag-multiple" size={16} color="#6D9773" />
                <Text style={styles.metaText} numberOfLines={1}>
                  {item.tags.join(', ')}
                </Text>
              </View>
            )}
            
            <View style={styles.metaItem}>
              <Icon name="calendar" size={16} color="#6D9773" />
              <Text style={styles.metaText}>
                {formattedDate}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.noteActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.archiveButton]}
            onPress={() => handleArchiveNote(item.id, !isArchived)}
          >
            <Icon
              name={isArchived ? 'archive-arrow-up' : 'archive-arrow-down'}
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteNote(item.id)}
          >
            <Icon name="delete" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const CurrentNotes = () => (
    <FlatList
      data={notes}
      renderItem={(item) => renderNoteItem({ ...item, isArchived: false })}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      extraData={refreshKey}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Icon name="note-text-outline" size={50} color="#6D9773" />
          <Text style={styles.emptyText}>No current notes. Create one!</Text>
        </View>
      }
    />
  );

  const ArchivedNotes = () => (
    <FlatList
      data={archivedNotes}
      renderItem={(item) => renderNoteItem({ ...item, isArchived: true })}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      extraData={refreshKey}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Icon name="archive" size={50} color="#6D9773" />
          <Text style={styles.emptyText}>No archived notes</Text>
        </View>
      }
    />
  );

  const TagsTab = () => (
    <View style={styles.tagsContainer}>
      <FlatList
        data={tags}
        numColumns={4}
        keyExtractor={(item) => item}
        extraData={refreshKey}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.tagItem,
              selectedTag === item && styles.selectedTagItem
            ]}
            onPress={() => handleTagPress(item)}
          >
            <Text 
              style={styles.tagText} 
              numberOfLines={1} 
              ellipsizeMode="tail"
            >
              {item.length > 10 ? `${item.substring(0, 8)}...` : item}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="tag-off" size={50} color="#6D9773" />
            <Text style={styles.emptyText}>No tags created yet</Text>
          </View>
        }
        contentContainerStyle={styles.tagsListContainer}
      />
      
      {/* Show filtered notes when a tag is selected */}
      {selectedTag && (
        <View style={styles.filteredNotesContainer}>
          <Text style={styles.filteredNotesTitle}>Notes with tag: {selectedTag}</Text>
          <FlatList
            data={filteredNotes}
            renderItem={(item) => renderNoteItem({ ...item, isArchived: item.item.isArchived })}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.filteredNotesListContainer}
            extraData={refreshKey}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="note-text-outline" size={50} color="#6D9773" />
                <Text style={styles.emptyText}>No notes with this tag</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );

  const handleArchiveNote = (noteId, isArchived) => {
    firestore()
      .collection('users')
      .doc(userId)
      .collection('notes')
      .doc(noteId)
      .update({ isArchived })
      .then(() => {
        Alert.alert('Success', `Note ${isArchived ? 'archived' : 'unarchived'}`);
        fetchNotes(userId, false);
        fetchNotes(userId, true);
      })
      .catch((error) => Alert.alert('Error', error.message));
  };

  const handleDeleteNote = (noteId) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            firestore()
              .collection('users')
              .doc(userId)
              .collection('notes')
              .doc(noteId)
              .delete()
              .then(() => {
                Alert.alert('Success', 'Note deleted');
                fetchNotes(userId, false);
                fetchNotes(userId, true);
                if (selectedTag) {
                  setSelectedTag(null);
                }
              })
              .catch((error) => Alert.alert('Error', error.message));
          }
        }
      ]
    );
  };

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar
        title="My Notes"
        showBackButton={true}
        rightActions={[
          {
            icon: 'magnify',
            onPress: () => navigation.navigate('SearchNotesScreen'),
            color: '#FFBA00'
          }
        ]}
      />

      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          current: CurrentNotes,
          archived: ArchivedNotes,
          tags: TagsTab,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#FFBA00' }}
            style={{ backgroundColor: '#0C3B2E' }}
            labelStyle={{
              color: '#FFFFFF',
              fontWeight: 'bold',
              textTransform: 'none',
            }}
          />
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateNoteScreen', { userId })}
      >
        <Icon name="plus" size={30} color="#0C3B2E" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default NoteListScreen;