import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,Dimensions
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import CustomAppBar from '../components/CustomAppBar';
import LinearGradient from 'react-native-linear-gradient';

const MenteeLessonsActivityScreen = () => {
  const { userId, boardId } = useRoute().params;
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boardData, setBoardData] = useState(null);
  const [hasSubmissionAccess, setHasSubmissionAccess] = useState(false);
  const navigation = useNavigation();
  const currentUser = auth().currentUser;

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Get board data
        const boardDoc = await firestore()
          .collection('boards')
          .doc(boardId)
          .get();
        
        if (boardDoc.exists) {
          setBoardData(boardDoc.data());
          
          // Check if current user is board owner or the submission owner
          const isOwnerOrSubmitter = boardDoc.data().creator === currentUser?.uid || 
                                    userId === currentUser?.uid;
          
          setHasSubmissionAccess(isOwnerOrSubmitter);
          
          // Always show Chat tab, conditionally show submission tabs
          const availableRoutes = [
            { key: 'chat', title: 'Chat' }
          ];
          
          if (isOwnerOrSubmitter) {
            availableRoutes.unshift(
              { key: 'checked', title: 'Checked' },
              { key: 'unchecked', title: 'Unchecked' }
            );
          }
          
          setRoutes(availableRoutes);
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setHasSubmissionAccess(false);
        setRoutes([{ key: 'chat', title: 'Chat' }]);
      }
    };

    checkAccess();
  }, [userId, boardId, currentUser?.uid]);

  useEffect(() => {
    if (!hasSubmissionAccess) return;

    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const snapshot = await firestore()
          .collection('boards')
          .doc(boardId)
          .collection('members')
          .doc(userId)
          .collection('submissions')
          .get();

        if (!snapshot.empty) {
          const fetchedSubmissions = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              testName: data.testName,
              submittedAt: data.submittedAt,
              isTestCheckedByMentor: data.isTestCheckedByMentor,
            };
          });
          setSubmissions(fetchedSubmissions);
        } else {
          setSubmissions([]);
        }
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      }
      setLoading(false);
    };

    fetchSubmissions();
  }, [userId, boardId, hasSubmissionAccess]);

  const filteredSubmissions = (checked) =>
    submissions.filter((sub) => sub.isTestCheckedByMentor === checked);

  const renderScene = SceneMap({
    unchecked: () => (
      <SubmissionList
        submissions={filteredSubmissions(false)}
        navigation={navigation}
        userId={userId}
        boardId={boardId}
        hasAccess={hasSubmissionAccess}
      />
    ),
    checked: () => (
      <SubmissionList
        submissions={filteredSubmissions(true)}
        navigation={navigation}
        userId={userId}
        boardId={boardId}
        hasAccess={hasSubmissionAccess}
      />
    ),
    chat: () => <ChatTab userId={userId} boardId={boardId} />,
  });

  if (loading && hasSubmissionAccess) {
    return (
      <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
        <ActivityIndicator size="large" color="#FFBA00" />
        <Text style={styles.loadingText}>Loading submissions...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar
        title="Submissions"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={styles.tabBar}
            indicatorStyle={styles.tabIndicator}
            labelStyle={styles.tabLabel}
            activeColor="#FFBA00"
            inactiveColor="#FFFFFF"
          />
        )}
      />
    </LinearGradient>
  );
};

const SubmissionList = ({ submissions, navigation, userId, boardId, hasAccess }) => {
  if (!hasAccess) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Only the board owner or submission owner can view these submissions
        </Text>
      </View>
    );
  }

  if (submissions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {submissions.some((sub) => sub.isTestCheckedByMentor)
            ? 'No unchecked submissions.'
            : 'No checked submissions.'}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={submissions}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.submissionItem,
            item.isTestCheckedByMentor ? styles.checked : styles.unchecked,
          ]}
          onPress={() =>
            navigation.navigate('DetailedSubmissionView', {
              submissionId: item.id,
              userId: userId,
              boardId: boardId,
            })
          }
        >
          <Text style={styles.submissionTitle}>Test Name: {item.testName}</Text>
          <Text style={styles.submissionDate}>
            Submitted on: {item.submittedAt ? new Date(item.submittedAt.toDate()).toLocaleDateString() : 'N/A'}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

const ChatTab = ({ userId, boardId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const currentUser = auth().currentUser;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('boards')
      .doc(boardId)
      .collection('chat')
      .doc(userId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        async (snapshot) => {
          const fetchedMessages = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const messageData = doc.data();
              const userDoc = await firestore()
                .collection('users')
                .doc(messageData.senderId)
                .get();
              const username = userDoc.data()?.username || 'Unknown User';
              return {
                id: doc.id,
                ...messageData,
                username,
                isCurrentUser: messageData.senderId === currentUser?.uid,
              };
            })
          );
          setMessages(fetchedMessages);
        },
        (error) => {
          console.error('Error fetching messages:', error);
        }
      );

    return () => unsubscribe();
  }, [userId, boardId, currentUser?.uid]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!currentUser) return;

    const messageData = {
      text: newMessage,
      timestamp: firestore.FieldValue.serverTimestamp(),
      senderId: currentUser.uid,
    };

    try {
      await firestore()
        .collection('boards')
        .doc(boardId)
        .collection('chat')
        .doc(userId)
        .collection('messages')
        .add(messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  return (
    <View style={styles.chatContainer}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
        renderItem={({ item }) => (
          <View style={[
            styles.messageItem, 
            item.isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
          ]}>
            <Text style={styles.messageUsername}>{item.username}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>
              {item.timestamp?.toDate?.().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}
      />
      <View style={styles.chatInputContainer}>
        <TextInput
          style={styles.chatInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          onSubmitEditing={sendMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    color: '#FFBA00',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  tabBar: {
    backgroundColor: '#0C3B2E',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabIndicator: {
    backgroundColor: '#FFBA00',
    height: 3,
  },
  tabLabel: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContainer: {
    padding: 20,
  },
  submissionItem: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checked: {
    backgroundColor: '#6D9773',
  },
  unchecked: {
    backgroundColor: '#FFBA00',
  },
  submissionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  submissionDate: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#FFBA00',
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatList: {
    padding: 10,
  },
  messageItem: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    maxWidth: '80%',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFBA00',
    borderTopRightRadius: 0,
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    borderTopLeftRadius: 0,
  },
  messageUsername: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0C3B2E',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#0C3B2E',
  },
  messageTime: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#6D9773',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    color: '#0C3B2E',
    backgroundColor: '#F0F0F0',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#FFBA00',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#0C3B2E',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MenteeLessonsActivityScreen;