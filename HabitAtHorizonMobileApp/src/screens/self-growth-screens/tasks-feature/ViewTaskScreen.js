import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import CustomAppBar from '../../../components/CustomAppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { viewTaskScreenStyle as styles } from './styles';

const ViewTaskScreen = ({ navigation, route }) => {
  const { task, userId } = route.params;
  const [subtasks, setSubtasks] = useState(task.subtasks || []);

  const confirmDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: handleDeleteTask }
      ]
    );
  };

  const handleDeleteTask = async () => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('tasks')
        .doc(task.id)
        .delete();
      Alert.alert('Success', 'Task deleted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting task: ', error);
      Alert.alert('Error', 'Failed to delete task.');
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
      Alert.alert('Success', 'Task marked as completed!');
      navigation.goBack();
    } catch (error) {
      console.error('Error marking task as complete: ', error);
      Alert.alert('Error', 'Failed to mark task as complete.');
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
        <Icon 
          name={item.completed ? "checkbox-marked" : "checkbox-blank-outline"} 
          size={24} 
          color={item.completed ? "#FFBA00" : "#FFFFFF"} 
          style={styles.subtaskIcon}
        />
        <Text style={[styles.subtaskText, item.completed && styles.completedSubtask]}>
          {item.text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar
        title="Task Details"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.description}>{task.description}</Text>

          <View style={styles.detailRow}>
            <Icon name="calendar" size={20} color="#FFBA00" style={styles.detailIcon} />
            <View>
              <Text style={styles.sectionTitle}>Due Date</Text>
              <Text style={styles.sectionValue}>{task.dueDate.toDate().toLocaleDateString()}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="priority-high" size={20} color="#FFBA00" style={styles.detailIcon} />
            <View>
              <Text style={styles.sectionTitle}>Priority</Text>
              <Text style={styles.sectionValue}>{task.priority}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="tag" size={20} color="#FFBA00" style={styles.detailIcon} />
            <View>
              <Text style={styles.sectionTitle}>Category</Text>
              <Text style={styles.sectionValue}>{task.category}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="repeat" size={20} color="#FFBA00" style={styles.detailIcon} />
            <View>
              <Text style={styles.sectionTitle}>Recurrence</Text>
              <Text style={styles.sectionValue}>{task.recurrence}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="checkbox-marked-circle-outline" size={20} color="#FFBA00" style={styles.detailIcon} />
            <View>
              <Text style={styles.sectionTitle}>Status</Text>
              <Text style={[styles.sectionValue, { color: task.status === 'Completed' ? '#FFBA00' : '#FFFFFF' }]}>
                {task.status}
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Subtasks</Text>
          <FlatList
            data={subtasks}
            renderItem={renderSubtaskItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No subtasks added</Text>
            }
          />
        </View>

        <TouchableOpacity 
          style={styles.completeButton} 
          onPress={handleMarkComplete}
          disabled={task.status === 'Completed'}
        >
          <Icon name="check-circle" size={24} color="#0C3B2E" style={styles.buttonIcon} />
          <Text style={styles.completeButtonText}>
            {task.status === 'Completed' ? 'Task Completed' : 'Mark as Completed'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
          <Icon name="delete" size={24} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.deleteButtonText}>Delete Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default ViewTaskScreen;