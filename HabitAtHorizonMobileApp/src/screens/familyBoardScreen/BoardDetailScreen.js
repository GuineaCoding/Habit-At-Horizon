import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import CustomAppBar from '../../components/CustomAppBar';

const BoardDetailScreen = ({ navigation, route }) => {
  const { boardId } = route.params;
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [email, setEmail] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskReward, setTaskReward] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = auth().currentUser?.uid;

  // Fetch board and tasks
  useEffect(() => {
    const unsubscribeBoard = firestore()
      .collection('familyBoards')
      .doc(boardId)
      .onSnapshot(
        doc => {
          if (doc.exists) {
            setBoard(doc.data());
          } else {
            Alert.alert('Error', 'Board not found');
            navigation.goBack();
          }
        },
        error => {
          console.error('Error fetching board:', error);
          navigation.goBack();
        }
      );

    const unsubscribeTasks = firestore()
      .collection('tasks')
      .where('boardId', '==', boardId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          const tasksData = [];
          if (snapshot) {
            snapshot.forEach(doc => {
              tasksData.push({ id: doc.id, ...doc.data() });
            });
          }
          setTasks(tasksData);
          setLoading(false);
        },
        error => {
          console.error('Error fetching tasks:', error);
          setLoading(false);
        }
      );

    return () => {
      unsubscribeBoard();
      unsubscribeTasks();
    };
  }, [boardId, navigation]);

  const inviteMember = async () => {
    if (!email.trim()) return;

    try {
      const usersRef = firestore().collection('users');
      const snapshot = await usersRef.where('email', '==', email.trim()).get();
      
      if (snapshot.empty) {
        Alert.alert('Error', 'User not found');
        return;
      }

      const userDoc = snapshot.docs[0];
      await firestore()
        .collection('familyBoards')
        .doc(boardId)
        .update({
          [`members.${userDoc.id}`]: 'member'
        });

      setEmail('');
      setShowInviteModal(false);
      Alert.alert('Success', 'Member invited successfully');
    } catch (error) {
      console.error('Error inviting member:', error);
      Alert.alert('Error', 'Failed to invite member');
    }
  };

  const createTask = async () => {
    if (!taskTitle.trim()) return;

    try {
      await firestore().collection('tasks').add({
        boardId,
        title: taskTitle,
        reward: taskReward || null,
        status: 'pending',
        createdBy: userId,
        createdAt: firestore.FieldValue.serverTimestamp()
      });

      setTaskTitle('');
      setTaskReward('');
      setShowTaskModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'Failed to create task');
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      await firestore()
        .collection('tasks')
        .doc(taskId)
        .update({
          status: currentStatus === 'completed' ? 'pending' : 'completed'
        });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading || !board) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFBA00" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar 
        title={board.name} 
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.taskCard,
              item.status === 'completed' && styles.completedTask
            ]}
            onPress={() => toggleTaskStatus(item.id, item.status)}
          >
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              {item.reward && (
                <Text style={styles.taskReward}>${item.reward}</Text>
              )}
            </View>
            <Text style={styles.taskStatus}>
              Status: {item.status} • Created by: {item.createdBy === userId ? 'You' : 'Member'}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet. Add your first task!</Text>
        }
      />

      {/* Invite Member Modal */}
      <Modal visible={showInviteModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invite Member</Text>
            <TextInput
              style={styles.input}
              placeholder="Member email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowInviteModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={inviteMember}
              >
                <Text style={styles.buttonText}>Invite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Task Modal */}
      <Modal visible={showTaskModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Task title*"
              value={taskTitle}
              onChangeText={setTaskTitle}
              autoFocus
            />
            <TextInput
              style={styles.input}
              placeholder="Reward amount (optional)"
              value={taskReward}
              onChangeText={setTaskReward}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowTaskModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={createTask}
              >
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Action Buttons Container */}
      <View style={styles.actionButtonsContainer}>
        {/* Invite Member Button - Only shown for admins */}
        {board.members?.[userId] === 'admin' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.inviteButton]}
            onPress={() => setShowInviteModal(true)}
          >
            <Icon name="account-plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Add Task Button */}
        <TouchableOpacity
          style={[styles.actionButton, styles.addTaskButton]}
          onPress={() => setShowTaskModal(true)}
        >
          <Icon name="plus" size={24} color="#0C3B2E" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFBA00',
  },
  completedTask: {
    opacity: 0.6,
    borderColor: '#6D9773',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    flex: 1,
  },
  taskReward: {
    fontSize: 16,
    color: '#FFBA00',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  taskStatus: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  emptyText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1A4A3C',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFBA00',
  },
  modalTitle: {
    color: '#FFBA00',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#6D9773',
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#FFBA00',
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0C3B2E',
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginBottom: 16,
  },
  inviteButton: {
    backgroundColor: '#6D9773',
  },
  addTaskButton: {
    backgroundColor: '#FFBA00',
  },
});

export default BoardDetailScreen;