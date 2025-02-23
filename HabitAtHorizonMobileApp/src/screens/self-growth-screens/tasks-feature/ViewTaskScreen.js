import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const ViewTaskScreen = ({ navigation, route }) => {
  const { task, userId } = route.params;
  const [subtasks, setSubtasks] = useState(task.subtasks || []);

  const handleDeleteTask = async () => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('tasks')
        .doc(task.id)
        .delete();
      alert('Task deleted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting task: ', error);
      alert('Failed to delete task.');
    }
  };

  const handleMarkComplete = async () => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('tasks')
        .doc(task.id)
        .update({
          status: 'Completed',
          updatedAt: firestore.Timestamp.fromDate(new Date()),
        });
      alert('Task marked as completed!');
      navigation.goBack();
    } catch (error) {
      console.error('Error marking task as complete: ', error);
      alert('Failed to mark task as complete.');
    }
  };

  const handleToggleSubtask = async (id) => {
    const updatedSubtasks = subtasks.map((subtask) =>
      subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
    );
    setSubtasks(updatedSubtasks);

    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('tasks')
        .doc(task.id)
        .update({
          subtasks: updatedSubtasks,
          updatedAt: firestore.Timestamp.fromDate(new Date()),
        });
    } catch (error) {
      console.error('Error updating subtasks: ', error);
      Alert.alert('Error', 'Failed to update subtasks.');
    }
  };

  const renderSubtaskItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleToggleSubtask(item.id)}>
      <View style={styles.subtaskItem}>
        <Text style={[styles.subtaskText, item.completed && styles.completedSubtask]}>
          {item.text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.description}>{task.description}</Text>

      <Text style={styles.sectionTitle}>Due Date</Text>
      <Text style={styles.sectionValue}>{task.dueDate.toDate().toLocaleDateString()}</Text>

      <Text style={styles.sectionTitle}>Priority</Text>
      <Text style={styles.sectionValue}>{task.priority}</Text>

      <Text style={styles.sectionTitle}>Category</Text>
      <Text style={styles.sectionValue}>{task.category}</Text>

      <Text style={styles.sectionTitle}>Recurrence</Text>
      <Text style={styles.sectionValue}>{task.recurrence}</Text>

      <Text style={styles.sectionTitle}>Status</Text>
      <Text style={styles.sectionValue}>{task.status}</Text>

      <Text style={styles.sectionTitle}>Subtasks</Text>
      <FlatList
        data={subtasks}
        renderItem={renderSubtaskItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No subtasks added.</Text>}
      />

      <TouchableOpacity style={styles.completeButton} onPress={handleMarkComplete}>
        <Text style={styles.completeButtonText}>Mark as Completed</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteTask}>
        <Text style={styles.deleteButtonText}>Delete Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0C3B2E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFBA00',
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#FFBA00',
  },
  sectionValue: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtaskItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#6D9773',
  },
  subtaskText: {
    fontSize: 16,
    color: '#FFFFFF', 
  },
  completedSubtask: {
    textDecorationLine: 'line-through',
    color: '#888', 
  },
  emptyText: {
    fontSize: 16,
    color: '#888', 
    textAlign: 'center',
    marginTop: 10,
  },
  completeButton: {
    backgroundColor: '#6D9773', 
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    color: '#FFFFFF', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#B46617', 
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ViewTaskScreen;