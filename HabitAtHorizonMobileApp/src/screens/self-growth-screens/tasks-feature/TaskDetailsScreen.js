import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomAppBar from '../../../components/CustomAppBar';

const TaskDetailsScreen = ({ navigation, route }) => {
  const { task, userId } = route.params; 
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate.toDate());
  const [priority, setPriority] = useState(task.priority);
  const [category, setCategory] = useState(task.category);
  const [subtasks, setSubtasks] = useState(task.subtasks);
  const [recurrence, setRecurrence] = useState(task.recurrence);
  const [status, setStatus] = useState(task.status);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleUpdateTask = async () => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('tasks')
        .doc(task.id)
        .update({
          title,
          description,
          dueDate: firestore.Timestamp.fromDate(dueDate),
          priority,
          category,
          subtasks,
          recurrence,
          status,
          updatedAt: firestore.Timestamp.fromDate(new Date()),
        });
      Alert.alert('Success', 'Task updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating task: ', error);
      Alert.alert('Error', 'Failed to update task.');
    }
  };

  const handleMarkComplete = async () => {
    try {
      if (!userId || !task.id) {
        throw new Error('User ID or Task ID is missing');
      }

      const taskRef = firestore()
        .collection('users')
        .doc(userId)
        .collection('tasks')
        .doc(task.id);

      const doc = await taskRef.get();
      if (!doc.exists) {
        Alert.alert('Error', 'Task not found. It may have been deleted.');
        navigation.goBack();
        return;
      }

      await taskRef.update({
        status: 'Completed',
        updatedAt: firestore.Timestamp.fromDate(new Date()),
      });

      Alert.alert('Success', 'Task marked as complete!');
      navigation.goBack();
    } catch (error) {
      console.error('Error marking task as complete: ', error);
      Alert.alert('Error', `Failed to mark task as complete: ${error.message}`);
    }
  };

  const handleDeleteTask = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: async () => {
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
        }},
      ]
    );
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Task Details" showBackButton={true} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Title Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <View style={styles.inputWrapper}>
            <Icon name="format-title" size={24} color="#FFBA00" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor="#6D9773"
            />
          </View>
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <View style={styles.inputWrapper}>
            <Icon name="text" size={24} color="#FFBA00" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter task description"
              placeholderTextColor="#6D9773"
              multiline
            />
          </View>
        </View>

        {/* Due Date Button */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Due Date</Text>
          <TouchableOpacity
            style={styles.yellowButton}
            onPress={() => setShowDatePicker(true)}>
            <Icon name="calendar" size={24} color="#0C3B2E" style={styles.buttonIcon} />
            <Text style={styles.yellowButtonText}>Select Due Date</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Priority Picker */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.inputWrapper}>
            <Icon name="priority-high" size={24} color="#FFBA00" style={styles.inputIcon} />
            <Picker
              selectedValue={priority}
              onValueChange={(itemValue) => setPriority(itemValue)}
              style={styles.picker}
              dropdownIconColor="#FFBA00">
              <Picker.Item label="Low" value="Low" />
              <Picker.Item label="Medium" value="Medium" />
              <Picker.Item label="High" value="High" />
              <Picker.Item label="Urgent" value="Urgent" />
            </Picker>
          </View>
        </View>

        {/* Category Picker */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.inputWrapper}>
            <Icon name="tag" size={24} color="#FFBA00" style={styles.inputIcon} />
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
              dropdownIconColor="#FFBA00">
              <Picker.Item label="Work" value="Work" />
              <Picker.Item label="Personal" value="Personal" />
              <Picker.Item label="Study" value="Study" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>

        {/* Recurrence Picker */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Recurrence</Text>
          <View style={styles.inputWrapper}>
            <Icon name="repeat" size={24} color="#FFBA00" style={styles.inputIcon} />
            <Picker
              selectedValue={recurrence}
              onValueChange={(itemValue) => setRecurrence(itemValue)}
              style={styles.picker}
              dropdownIconColor="#FFBA00">
              <Picker.Item label="None" value="None" />
              <Picker.Item label="Daily" value="Daily" />
              <Picker.Item label="Weekly" value="Weekly" />
              <Picker.Item label="Monthly" value="Monthly" />
            </Picker>
          </View>
        </View>

        {/* Status Picker */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.inputWrapper}>
            <Icon name="checkbox-marked-circle-outline" size={24} color="#FFBA00" style={styles.inputIcon} />
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue)}
              style={styles.picker}
              dropdownIconColor="#FFBA00">
              <Picker.Item label="In Progress" value="In Progress" />
              <Picker.Item label="Completed" value="Completed" />
            </Picker>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.yellowButton} onPress={handleMarkComplete}>
          <Icon name="check-circle" size={24} color="#0C3B2E" style={styles.buttonIcon} />
          <Text style={styles.yellowButtonText}>Mark as Complete</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateTask}>
          <Icon name="content-save" size={24} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.updateButtonText}>Update Task</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteTask}>
          <Icon name="delete" size={24} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.deleteButtonText}>Delete Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#6D9773',
  },
  input: {
    flex: 1,
    height: 50,
    color: '#000000',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#000000',
  },
  yellowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFBA00',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6D9773',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E74C3C',
    padding: 15,
    borderRadius: 8,
  },
  yellowButtonText: {
    color: '#0C3B2E',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 5,
  },
});

export default TaskDetailsScreen;