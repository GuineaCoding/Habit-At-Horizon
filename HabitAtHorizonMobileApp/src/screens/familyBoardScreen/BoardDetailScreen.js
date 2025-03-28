import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, Modal, TextInput, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import CustomAppBar from '../../components/CustomAppBar';
import { BoardDetailScreenStyle as styles } from './FamilyBoardStyle';

const initialLayout = { width: Dimensions.get('window').width };

const BoardDetailScreen = ({ navigation, route }) => {
  const { boardId } = route.params;
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [email, setEmail] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskReward, setTaskReward] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = auth().currentUser?.uid;

  // Tab view state
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'tasks', title: 'Tasks' },
    { key: 'completed', title: 'Completed' },
    { key: 'members', title: 'Members' },
  ]);

  // Fetch board and tasks data
  useEffect(() => {
    const unsubscribeBoard = firestore()
      .collection('familyBoards')
      .doc(boardId)
      .onSnapshot(doc => {
        if (doc.exists) {
          const data = doc.data();
          const membersData = data.membersData || {};
          const pendingMembers = data.pendingMembers || {};
          
          if (Object.keys(membersData).length === 0 && data.members) {
            Object.keys(data.members).forEach(memberId => {
              membersData[memberId] = { username: `User ${memberId.slice(0, 4)}` };
            });
          }
          setBoard({ ...data, membersData, pendingMembers });
        }
      });

    const unsubscribeTasks = firestore()
      .collection('tasks')
      .where('boardId', '==', boardId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const tasksData = [];
        snapshot.forEach(doc => {
          tasksData.push({ 
            id: doc.id, 
            ...doc.data(),
            notes: doc.data().notes || []
          });
        });
        setTasks(tasksData);
        setLoading(false);
      });

    return () => {
      unsubscribeBoard();
      unsubscribeTasks();
    };
  }, [boardId]);

  // Create a new task
  const createTask = async () => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Task title is required');
      return;
    }

    try {
      await firestore().collection('tasks').add({
        boardId,
        title: taskTitle,
        description: taskDescription,
        reward: taskReward,
        status: 'pending',
        createdBy: userId,
        createdAt: firestore.FieldValue.serverTimestamp(),
        notes: [],
        completedBy: null,
        completedAt: null
      });

      setTaskTitle('');
      setTaskDescription('');
      setTaskReward('');
      setShowTaskModal(false);
      Alert.alert('Success', 'Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'Failed to create task');
    }
  };

  // Invite a new member to the board
  const inviteMember = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }
  
    try {
      const usersRef = firestore().collection('users');
      const snapshot = await usersRef.where('email', '==', email.trim()).get();
      
      if (snapshot.empty) {
        Alert.alert('Error', 'No user found with this email');
        return;
      }
  
      const userDoc = snapshot.docs[0];
      const invitedUserId = userDoc.id;
      const invitedUserName = userDoc.data().username || `User ${invitedUserId.slice(0, 4)}`;
      const currentUserName = auth().currentUser?.displayName || 'A user';
  
      if (board.members && board.members[invitedUserId]) {
        Alert.alert('Error', 'This user is already a member');
        return;
      }
  
      if (board.pendingMembers && board.pendingMembers[invitedUserId]) {
        Alert.alert('Error', 'Invitation already sent to this user');
        return;
      }
  
      await firestore()
        .collection('familyBoards')
        .doc(boardId)
        .update({
          [`pendingMembers.${invitedUserId}`]: true,
          [`membersData.${invitedUserId}`]: {
            email: userDoc.data().email,
            username: invitedUserName
          }
        });
  
      await firestore().collection('notifications').add({
        userId: invitedUserId,
        type: 'board_invitation',
        title: 'New Family Board Invitation',
        message: `${currentUserName} invited you to join "${board.name}" family board`,
        boardId: boardId,
        seen: false,
        timestamp: firestore.FieldValue.serverTimestamp(),
        senderId: userId,
        senderName: currentUserName
      });
  
      setEmail('');
      setShowInviteModal(false);
      Alert.alert('Success', 'Invitation sent successfully');
    } catch (error) {
      console.error('Error sending invitation:', error);
      Alert.alert('Error', 'Failed to send invitation');
    }
  };

  // Toggle task completion status
  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      
      await firestore()
        .collection('tasks')
        .doc(taskId)
        .update({
          status: newStatus,
          completedBy: newStatus === 'completed' ? userId : null,
          completedAt: newStatus === 'completed' ? firestore.FieldValue.serverTimestamp() : null
        });

      Alert.alert('Success', `Task marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      await firestore().collection('tasks').doc(taskId).delete();
      Alert.alert('Success', 'Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('Error', 'Failed to delete task');
    }
  };

  // Remove a member from the board
  const removeMember = async (memberId) => {
    try {
      await firestore()
        .collection('familyBoards')
        .doc(boardId)
        .update({
          [`members.${memberId}`]: firestore.FieldValue.delete(),
          [`membersData.${memberId}`]: firestore.FieldValue.delete(),
          [`pendingMembers.${memberId}`]: firestore.FieldValue.delete()
        });
      
      Alert.alert('Success', 'Member removed successfully');
    } catch (error) {
      console.error('Error removing member:', error);
      Alert.alert('Error', 'Failed to remove member');
    }
  };

  // Cancel a pending invitation
  const cancelInvitation = async (pendingUserId) => {
    try {
      await firestore()
        .collection('familyBoards')
        .doc(boardId)
        .update({
          [`pendingMembers.${pendingUserId}`]: firestore.FieldValue.delete(),
          [`membersData.${pendingUserId}`]: firestore.FieldValue.delete()
        });
      
      Alert.alert('Success', 'Invitation cancelled');
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      Alert.alert('Error', 'Failed to cancel invitation');
    }
  };

  // Navigate to task view screen
  const handleTaskPress = (task) => {
    navigation.navigate('TaskViewScreen', { 
      taskId: task.id,
      boardId,
      boardName: board.name 
    });
  };

  // Tab Components
  const TasksTab = () => (
    <View style={styles.tabContainer}>
      <FlatList
        data={tasks.filter(task => task.status === 'pending')}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem 
            task={item} 
            board={board} 
            userId={userId}
            onPress={() => handleTaskPress(item)}
            onToggleStatus={() => toggleTaskStatus(item.id, item.status)}
            onDelete={() => deleteTask(item.id)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No ongoing tasks</Text>
        }
      />
    </View>
  );

  const CompletedTasksTab = () => (
    <View style={styles.tabContainer}>
      <FlatList
        data={tasks.filter(task => task.status === 'completed')}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem 
            task={item} 
            board={board} 
            userId={userId}
            onPress={() => handleTaskPress(item)}
            onToggleStatus={() => toggleTaskStatus(item.id, item.status)}
            onDelete={() => deleteTask(item.id)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No completed tasks</Text>
        }
      />
    </View>
  );

  const MembersTab = () => (
    <View style={styles.tabContainer}>
      <FlatList
        data={Object.entries(board?.membersData || {})}
        keyExtractor={([memberId]) => memberId}
        renderItem={({ item: [memberId, memberData] }) => (
          <View style={[
            styles.memberItem,
            board?.pendingMembers?.[memberId] && styles.pendingMemberItem
          ]}>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>
                {memberData.username}
                {board?.members?.[memberId] === 'admin' && ' (Admin)'}
                {board?.pendingMembers?.[memberId] && ' (Pending)'}
              </Text>
              <Text style={styles.memberEmail}>{memberData.email}</Text>
            </View>
            {board?.members?.[userId] === 'admin' && memberId !== userId && (
              <TouchableOpacity 
                style={styles.removeMemberButton}
                onPress={() => {
                  if (board?.pendingMembers?.[memberId]) {
                    cancelInvitation(memberId);
                  } else {
                    removeMember(memberId);
                  }
                }}
              >
                <Icon 
                  name={board?.pendingMembers?.[memberId] ? "close" : "account-remove"} 
                  size={24} 
                  color="#FF0000" 
                />
              </TouchableOpacity>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No members found</Text>
        }
      />
    </View>
  );

  const renderScene = SceneMap({
    tasks: TasksTab,
    completed: CompletedTasksTab,
    members: MembersTab,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor="#FFBA00"
      inactiveColor="#FFFFFF"
    />
  );

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

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        initialLayout={initialLayout}
      />

      {/* Create Task Modal */}
      <Modal visible={showTaskModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Task title*"
              placeholderTextColor="#ffffff"
              value={taskTitle}
              onChangeText={setTaskTitle}
              autoFocus
            />
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Description"
              placeholderTextColor="#ffffff"
              value={taskDescription}
              onChangeText={setTaskDescription}
              multiline
              numberOfLines={4}
            />
            <TextInput
              style={styles.input}
              placeholder="Reward (optional)"
              placeholderTextColor="#ffffff"
              value={taskReward}
              onChangeText={setTaskReward}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowTaskModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.createButton, !taskTitle.trim() && styles.disabledButton]}
                onPress={createTask}
                disabled={!taskTitle.trim()}
              >
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Invite Member Modal */}
      <Modal visible={showInviteModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invite Member</Text>
            <TextInput
              style={styles.input}
              placeholder="Member email"
              placeholderTextColor="#ffffff"
              value={email}
              onChangeText={setEmail}
              autoFocus
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowInviteModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.createButton, !email.trim() && styles.disabledButton]}
                onPress={inviteMember}
                disabled={!email.trim()}
              >
                <Text style={styles.buttonText}>Invite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        {index === 2 && board.members?.[userId] === 'admin' && (
          <TouchableOpacity
            style={[styles.fab, styles.inviteFab]}
            onPress={() => setShowInviteModal(true)}
          >
            <Icon name="account-plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        {(index === 0 || index === 1) && (
          <TouchableOpacity
            style={[styles.fab, styles.taskFab]}
            onPress={() => setShowTaskModal(true)}
          >
            <Icon name="plus" size={24} color="#0C3B2E" />
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

// TaskItem component
const TaskItem = ({ task, board, userId, onPress, onToggleStatus, onDelete }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.taskCard,
        task.status === 'completed' && styles.completedTask
      ]}
      onPress={onPress}
    >
      <View style={styles.taskHeader}>
        <View style={styles.taskTitleContainer}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          {task.reward && (
            <Text style={styles.taskReward}>Reward: {task.reward}</Text>
          )}
        </View>
        <View style={styles.taskActions}>
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={(e) => {
              e.stopPropagation();
              onToggleStatus();
            }}
          >
            <Icon 
              name={task.status === 'completed' ? 'check-circle' : 'checkbox-blank-circle-outline'} 
              size={24} 
              color={task.status === 'completed' ? '#4CAF50' : '#FFBA00'} 
            />
          </TouchableOpacity>
          {task.createdBy === userId && (
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Icon name="delete" size={20} color="#FF0000" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {task.description && (
        <Text style={styles.taskDescription}>{task.description}</Text>
      )}
    </TouchableOpacity>
  );
};

export default BoardDetailScreen;