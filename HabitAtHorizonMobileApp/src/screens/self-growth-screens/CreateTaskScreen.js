import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateTask = ({ navigation, route }) => {
  const { userId } = route.params; 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Work');
  const [subtasks, setSubtasks] = useState([]);
  const [recurrence, setRecurrence] = useState('None');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddTask = async () => {
    try {
      await firestore().collection('users').doc(userId).collection('tasks').add({
        title,
        description,
        dueDate: firestore.Timestamp.fromDate(dueDate),
        priority,
        category,
        subtasks,
        recurrence,
        status: 'In Progress',
        createdAt: firestore.Timestamp.fromDate(new Date()),
        updatedAt: firestore.Timestamp.fromDate(new Date()),
      });
      alert('Task added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding task: ', error);
      alert('Failed to add task.');
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

      <Button title="Add Task" onPress={handleAddTask} />
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

export default CreateTask;