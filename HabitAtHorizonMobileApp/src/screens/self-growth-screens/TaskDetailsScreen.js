import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

const TaskDetails = ({ navigation, route }) => {
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
      alert('Task updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating task: ', error);
      alert('Failed to update task.');
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
      alert('Task marked as complete!');
      navigation.goBack();
    } catch (error) {
      console.error('Error marking task as complete: ', error);
      alert('Failed to mark task as complete.');
    }
  };

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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter task description"
        multiline
      />

      <Text style={styles.label}>Due Date</Text>
      <Button title="Select Due Date" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Priority</Text>
      <Picker
        selectedValue={priority}
        onValueChange={(itemValue) => setPriority(itemValue)}>
        <Picker.Item label="Low" value="Low" />
        <Picker.Item label="Medium" value="Medium" />
        <Picker.Item label="High" value="High" />
        <Picker.Item label="Urgent" value="Urgent" />
      </Picker>

      <Text style={styles.label}>Category</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}>
        <Picker.Item label="Work" value="Work" />
        <Picker.Item label="Personal" value="Personal" />
        <Picker.Item label="Study" value="Study" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Text style={styles.label}>Recurrence</Text>
      <Picker
        selectedValue={recurrence}
        onValueChange={(itemValue) => setRecurrence(itemValue)}>
        <Picker.Item label="None" value="None" />
        <Picker.Item label="Daily" value="Daily" />
        <Picker.Item label="Weekly" value="Weekly" />
        <Picker.Item label="Monthly" value="Monthly" />
      </Picker>

      <Text style={styles.label}>Status</Text>
      <Picker
        selectedValue={status}
        onValueChange={(itemValue) => setStatus(itemValue)}>
        <Picker.Item label="In Progress" value="In Progress" />
        <Picker.Item label="Completed" value="Completed" />
      </Picker>

      <Button title="Update Task" onPress={handleUpdateTask} />
      <Button title="Mark as Complete" onPress={handleMarkComplete} />
      <Button title="Delete Task" onPress={handleDeleteTask} color="red" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default TaskDetails;