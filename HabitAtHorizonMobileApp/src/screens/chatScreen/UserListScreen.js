import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Button, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomAppBar from '../../components/CustomAppBar'; 

const UserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [searchResults, setSearchResults] = useState([]); 
  const userId = auth().currentUser.uid;

  const fetchUsers = async () => {
    const usersRef = firestore()
      .collection('users')
      .where('visibleToOthers', '==', true);

    const snapshot = await usersRef.get();
    const users = [];
    snapshot.forEach((doc) => {
      if (doc.id !== userId) {
        users.push({ id: doc.id, ...doc.data() });
      }
    });
    setUsers(users);
  };

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
        if (doc.id !== userId) {
          results.push({ id: doc.id, ...doc.data() });
        }
      });
      setSearchResults(results); 
    }
  };

  const addUserToList = (user) => {
    if (!users.some((u) => u.id === user.id)) {
      setUsers((prevUsers) => [...prevUsers, user]); 
    }
  };

  const startChat = async (otherUserId) => {
    const chatsRef = firestore().collection('chats');
    const query = chatsRef
      .where('participantIds', 'array-contains', userId)
      .where('participantIds', 'array-contains', otherUserId);

    const snapshot = await query.get();

    if (snapshot.empty) {
      const newChatRef = await chatsRef.add({
        participantIds: [userId, otherUserId],
        lastMessage: '',
        lastMessageTimestamp: firestore.Timestamp.now(),
        lastMessageSenderId: '',
      });
      navigation.navigate('ChatScreen', { chatId: newChatRef.id });
    } else {
      navigation.navigate('ChatScreen', { chatId: snapshot.docs[0].id });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="User List" showBackButton={true} />
      {/* Search Bar */}
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
      {/* Display Search Results */}
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
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userRole}>
                  {item.roles?.includes('mentee') ? 'Mentee' : 'Mentor'}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      {/* Display All Users */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => startChat(item.id)}
          >
            <Text style={styles.userName}>{item.name}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    color: '#000000',
  },
  searchResultsContainer: {
    padding: 10,
  },
  searchResultsTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#1A4A3C',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6D9773',
  },
  userName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 14,
    color: '#FFBA00',
  },
});

export default UserListScreen;