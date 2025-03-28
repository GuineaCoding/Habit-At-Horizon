import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, TextInput, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import CustomAppBar from '../../components/CustomAppBar';
import { taskViewStyles as styles } from './FamilyBoardStyle';

const TaskViewScreen = ({ navigation, route }) => {
  const { taskId, boardId, boardName } = route.params;
  const [task, setTask] = useState(null);
  const [board, setBoard] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = auth().currentUser?.uid;

  // Fetch task and board data when screen loads
  useEffect(() => {
    // Get task data from Firestore
    const unsubscribeTask = firestore()
      .collection('tasks')
      .doc(taskId)
      .onSnapshot(doc => {
        if (doc.exists) {
          setTask({
            id: doc.id,
            ...doc.data(),
            notes: doc.data().notes || [] // Make sure notes array exists
          });
          setLoading(false);
        }
      });

    // Get board data from Firestore
    const unsubscribeBoard = firestore()
      .collection('familyBoards')
      .doc(boardId)
      .onSnapshot(doc => {
        if (doc.exists) {
          setBoard(doc.data());
        }
      });

    // Clean up listeners when component unmounts
    return () => {
      unsubscribeTask();
      unsubscribeBoard();
    };
  }, [taskId, boardId]);

  // Toggle task between completed and pending status
  const toggleTaskStatus = async () => {
    try {
      await firestore()
        .collection('tasks')
        .doc(taskId)
        .update({
          status: task.status === 'completed' ? 'pending' : 'completed',
          completedBy: task.status === 'completed' ? null : userId,
          completedAt: task.status === 'completed' ? null : firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Add a new note to the task
  const addNote = async () => {
    if (!newNote.trim()) return; // Don't add empty notes
    
    try {
      const timestamp = new Date(); 
      await firestore()
        .collection('tasks')
        .doc(taskId)
        .update({
          notes: firestore.FieldValue.arrayUnion({
            text: newNote,
            createdAt: timestamp,
            createdBy: userId
          })
        });
      setNewNote(''); // Clear input after adding
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Delete the current task
  const deleteTask = async () => {
    try {
      await firestore().collection('tasks').doc(taskId).delete();
      navigation.goBack(); // Go back after deleting
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Show loading spinner while data is being fetched
  if (loading || !task || !board) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFBA00" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar 
        title={task.title}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Task details card */}
        <View style={[
          styles.taskCard,
          task.status === 'completed' && styles.completedTask
        ]}>
          {/* Task header with title and reward */}
          <View style={styles.taskHeader}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            {task.reward && (
              <Text style={styles.taskReward}>Reward: {task.reward}</Text>
            )}
          </View>
          
          {/* Task description */}
          {task.description && (
            <Text style={styles.taskDescription}>{task.description}</Text>
          )}

          {/* Task metadata (creator, dates) */}
          <View style={styles.taskMeta}>
            <Text style={styles.taskMetaText}>
              Created by: {task.createdBy === userId ? 'You' : board.membersData?.[task.createdBy]?.username || 'Member'}
            </Text>
            <Text style={styles.taskMetaText}>
              Created: {task.createdAt?.toDate().toLocaleString()}
            </Text>
            {task.status === 'completed' && (
              <>
                <Text style={styles.taskMetaText}>
                  Completed by: {task.completedBy === userId ? 'You' : board.membersData?.[task.completedBy]?.username || 'Member'}
                </Text>
                <Text style={styles.taskMetaText}>
                  Completed: {task.completedAt?.toDate().toLocaleString()}
                </Text>
              </>
            )}
          </View>

          {/* Notes section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            {/* List of notes */}
            {task.notes.length > 0 ? (
              task.notes.map((note, index) => (
                <View key={index} style={styles.noteContainer}>
                  <Text style={styles.noteText}>{note.text}</Text>
                  <Text style={styles.noteInfo}>
                    - {note.createdBy === userId ? 'You' : board.membersData?.[note.createdBy]?.username || 'Member'} • 
                    {note.createdAt?.toDate?.()?.toLocaleString() || 'Just now'}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyNotesText}>No notes yet</Text>
            )}

            {/* Add note input */}
            <View style={styles.noteInputContainer}>
              <TextInput
                style={styles.noteInput}
                placeholder="Add a note..."
                placeholderTextColor="#999"
                value={newNote}
                onChangeText={setNewNote}
                onSubmitEditing={addNote}
                multiline
              />
              <TouchableOpacity 
                style={styles.addNoteButton}
                onPress={addNote}
                disabled={!newNote.trim()}
              >
                <Icon name="send" size={20} color={newNote.trim() ? "#FFBA00" : "#999"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action buttons at bottom */}
      <View style={styles.actionButtons}>
        {/* Delete button (only shown to task creator) */}
        {task.createdBy === userId && (
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={deleteTask}
          >
            <Icon name="delete" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        {/* Toggle status button */}
        <TouchableOpacity 
          style={styles.statusButton}
          onPress={toggleTaskStatus}
        >
          <Text style={styles.statusButtonText}>
            {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default TaskViewScreen;