import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomAppBar from '../../components/CustomAppBar'; // Ensure this component exists

const UserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const userId = auth().currentUser.uid;

  // Fetch users with visibleToOthers: true
  const fetchUsers = async () => {
    const usersRef = firestore()
      .collection('users')
      .where('visibleToOthers', '==', true); // Only fetch visible users

    const snapshot = await usersRef.get();
    const users = [];
    snapshot.forEach((doc) => {
      if (doc.id !== userId) { 
        users.push({ id: doc.id, ...doc.data() });
      }
    });
    setUsers(users);
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