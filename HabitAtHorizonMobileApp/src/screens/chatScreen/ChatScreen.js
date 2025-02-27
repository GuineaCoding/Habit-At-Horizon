import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ChatScreen = ({ route }) => {
  const { chatId } = route.params || { chatId: '' }; 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const userId = auth().currentUser.uid;

  // Fetch messages in real-time
  const fetchMessages = (chatId, setMessages) => {
    const messagesRef = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp', 'asc');

    return messagesRef.onSnapshot((snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messages);
    });
  };

  // Mark messages as seen
  const markMessagesAsSeen = async (chatId, userId) => {
    const messagesRef = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .where('seen', '==', false)
      .where('senderId', '!=', userId);

    const snapshot = await messagesRef.get();
    snapshot.forEach((doc) => {
      doc.ref.update({ seen: true });
    });
  };

  useEffect(() => {
    console.log('Route Params:', route.params); // Debugging
    if (chatId) {
      const unsubscribe = fetchMessages(chatId, setMessages);
      markMessagesAsSeen(chatId, userId);
      return unsubscribe;
    }
  }, [chatId, userId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await sendMessage(chatId, userId, newMessage);
      setNewMessage('');
    }
  };

  const sendMessage = async (chatId, senderId, text) => {
    const chatRef = firestore().collection('chats').doc(chatId);
    const messagesRef = chatRef.collection('messages');

    await messagesRef.add({
      senderId,
      text,
      timestamp: firestore.Timestamp.now(),
      seen: false,
    });

    await chatRef.update({
      lastMessage: text,
      lastMessageTimestamp: firestore.Timestamp.now(),
      lastMessageSenderId: senderId,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={item.senderId === userId ? styles.sentMessage : styles.receivedMessage}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {item.timestamp?.toDate().toLocaleTimeString()}
            </Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#0C3B2E',
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ChatScreen;