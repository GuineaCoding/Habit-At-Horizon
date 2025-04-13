import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Button, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomAppBar from '../../components/CustomAppBar';

import { userListScreenStyle as styles } from './styles';

// Main screen for displaying a list of users with search functionality and the ability to add users and start chats
const UserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const userId = auth().currentUser.uid;

// Fetch users who are visible to others and merge them with the current user's added users
  const fetchUsers = async () => {
    try {
      const usersRef = firestore()
        .collection('users')
        .where('visibleToOthers', '==', true);

      const snapshot = await usersRef.get();
      const visibleUsers = [];
      snapshot.forEach((doc) => {
        if (doc.id !== userId) {
          visibleUsers.push({ id: doc.id, ...doc.data() });
        }
      });

      const currentUserRef = firestore().collection('users').doc(userId);
      const currentUserDoc = await currentUserRef.get();
      const addedUsers = currentUserDoc.data()?.addedUsers || [];

      const allUsers = [...visibleUsers, ...addedUsers];
      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Unable to fetch users. Please try again.');
    }
  };

  // search for users based on username 
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a username to search.');
      return;
    }

    const usersRef = firestore().collection('users');
    const querySnapshot = await usersRef
      .where('username', '>=', searchQuery.trim().toLowerCase())
      .where('username', '<=', searchQuery.trim().toLowerCase() + '\uf8ff')
      .get();

    if (querySnapshot.empty) {
      Alert.alert('No Results', 'No user found with that username.');
      setSearchResults([]);
    } else {
      const results = [];
      querySnapshot.forEach((doc) => {
        if (doc.id !== userId && !users.some((u) => u.id === doc.id)) {
          results.push({ id: doc.id, ...doc.data() });
        }
      });
      setSearchResults(results);
    }
  };
  
// Add a user to the current user's list of added users in Firestore
  const addUserToList = async (user) => {
    try {
      if (users.some((u) => u.id === user.id)) {
        return;
      }

      setUsers((prevUsers) => [...prevUsers, user]);

      const currentUserRef = firestore().collection('users').doc(userId);
      await currentUserRef.update({
        addedUsers: firestore.FieldValue.arrayUnion(user),
      });
    } catch (error) {
      console.error('Error adding user to list:', error);
      Alert.alert('Error', 'Unable to add user. Please try again.');
    }
  };

  const startChat = async (otherUser) => {
    console.log('Starting chat with user:', otherUser.id);

    try {
      const chatId = [userId, otherUser.id].sort().join('_');

      const chatRef = firestore().collection('chats').doc(chatId);

      const chatDoc = await chatRef.get();

      if (!chatDoc.exists) {
        console.log('Creating new chat...');
        await chatRef.set({
          participantIds: [userId, otherUser.id],
          lastMessage: '',
          lastMessageTimestamp: firestore.Timestamp.now(),
          lastMessageSenderId: '',
        });
      }

      navigation.navigate('ChatScreen', { 
        chatId,
        participantInfo: {
          id: otherUser.id,
          username: otherUser.username,
          roles: otherUser.roles
        }
      });
    } catch (error) {
      console.error('Error starting chat:', error);
      Alert.alert('Error', 'Unable to start chat. Please try again.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="User List" showBackButton={true} />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by username..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button title="Search" onPress={handleSearch} color="#FFBA00" />
      </View>
      
      {searchResults.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.searchResultsTitle}>Search Results:</Text>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.userItem}
                onPress={() => {
                  addUserToList(item);
                  setSearchResults([]);
                }}
              >
                <Text style={styles.userName}>{item.username}</Text>
                <Text style={styles.userRole}>
                  {item.roles?.includes('mentee') ? 'Mentee' : 'Mentor'}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => startChat(item)}
          >
            <Text style={styles.userName}>{item.username}</Text>
            <Text style={styles.userRole}>
              {item.roles?.includes('mentee') ? 'Mentee' : 'Mentor'}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </LinearGradient>
  );
};

export default UserListScreen;