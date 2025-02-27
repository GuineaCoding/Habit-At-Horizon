import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const UserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const userId = auth().currentUser.uid;

  const fetchUsers = async () => {
    const usersRef = firestore().collection('users');
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
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => startChat(item.id)}
          >
            <Text style={styles.userName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    fontSize: 16,
    color: '#000',
  },
});

export default UserListScreen;