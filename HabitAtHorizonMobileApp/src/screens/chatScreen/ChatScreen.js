import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import CustomAppBar from '../../components/CustomAppBar';

const ChatScreen = ({ route, navigation }) => {
  const { chatId, participantInfo } = route.params || { chatId: '', participantInfo: null };
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState(null);
  const userId = auth().currentUser.uid;

  // Fetch recipient info if not passed in params
  useEffect(() => {
    if (participantInfo) {
      setRecipient(participantInfo);
    } else if (chatId) {
      const fetchRecipientInfo = async () => {
        try {
          const chatDoc = await firestore().collection('chats').doc(chatId).get();
          const participantIds = chatDoc.data()?.participantIds || [];
          const recipientId = participantIds.find(id => id !== userId);
          
          if (recipientId) {
            const recipientDoc = await firestore().collection('users').doc(recipientId).get();
            setRecipient({
              id: recipientId,
              username: recipientDoc.data()?.username || 'Unknown User',
              roles: recipientDoc.data()?.roles || []
            });
          }
        } catch (error) {
          console.error('Error fetching recipient info:', error);
        }
      };
      
      fetchRecipientInfo();
    }
  }, [chatId, userId, participantInfo]);

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

  const markMessagesAsSeen = async (chatId, userId) => {
    const messagesRef = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .where('seen', '==', false)
      .where('senderId', '!=', userId);

    const snapshot = await messagesRef.get();
    const batch = firestore().batch();

    snapshot.forEach((doc) => {
      batch.update(doc.ref, { seen: true });
    });

    await batch.commit();
  };

  useEffect(() => {
    if (chatId) {
      const unsubscribe = fetchMessages(chatId, setMessages);
      markMessagesAsSeen(chatId, userId);
      return unsubscribe;
    }
  }, [chatId, userId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await sendMessage(chatId, userId, newMessage);
        setNewMessage(''); 
      } catch (error) {
        console.error('Error sending message:', error);
      }
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
  
    const chatDoc = await chatRef.get();
    const participantIds = chatDoc.data()?.participantIds || [];
    const recipientId = participantIds.find((id) => id !== senderId);
  
    if (recipientId) {
      const senderDoc = await firestore().collection('users').doc(senderId).get();
      const senderUsername = senderDoc.data()?.username || 'Unknown User';
  
      await firestore().collection('notifications').add({
        userId: recipientId,
        type: 'message',
        message: `You received a new message from ${senderUsername}`,
        timestamp: firestore.Timestamp.now(),
        seen: false,
      });
    }
  };

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar 
        title={recipient?.username || 'Chat'} 
        subtitle={recipient?.roles?.includes('mentee') ? 'Mentee' : 'Mentor'}
        showBackButton={true} 
        onBackPress={() => navigation.goBack()} 
      />
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
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    padding: 10,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1A4A3C',
    borderTopWidth: 1,
    borderTopColor: '#6D9773',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#FFBA00',
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen;