import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
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
  const [newSubtask, setNewSubtask] = useState('');
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
        archived: false,
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

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { id: Date.now().toString(), text: newSubtask, completed: false }]);
      setNewSubtask('');
    }
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
  };

  const handleToggleSubtask = (id) => {
    setSubtasks(
      subtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
      )
    );
  };

  const renderSubtaskItem = ({ item }) => (
    <View style={styles.subtaskItem}>
      <TouchableOpacity onPress={() => handleToggleSubtask(item.id)}>
        <Text style={[styles.subtaskText, item.completed && styles.completedSubtask]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteSubtask(item.id)}>
        <Text style={styles.deleteSubtask}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter task description"
        placeholderTextColor="#888"
        multiline
      />

      <Text style={styles.label}>Due Date</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateButtonText}>Select Due Date</Text>
      </TouchableOpacity>
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
        onValueChange={(itemValue) => setPriority(itemValue)}
        style={styles.picker}
        dropdownIconColor="#FFFFFF">
        <Picker.Item label="Low" value="Low" />
        <Picker.Item label="Medium" value="Medium" />
        <Picker.Item label="High" value="High" />
        <Picker.Item label="Urgent" value="Urgent" />
      </Picker>

      <Text style={styles.label}>Category</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
        dropdownIconColor="#FFFFFF">
        <Picker.Item label="Work" value="Work" />
        <Picker.Item label="Personal" value="Personal" />
        <Picker.Item label="Study" value="Study" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Text style={styles.label}>Recurrence</Text>
      <Picker
        selectedValue={recurrence}
        onValueChange={(itemValue) => setRecurrence(itemValue)}
        style={styles.picker}
        dropdownIconColor="#FFFFFF">
        <Picker.Item label="None" value="None" />
        <Picker.Item label="Daily" value="Daily" />
        <Picker.Item label="Weekly" value="Weekly" />
        <Picker.Item label="Monthly" value="Monthly" />
      </Picker>

      <Text style={styles.label}>Subtasks</Text>
      <TextInput
        style={styles.input}
        value={newSubtask}
        onChangeText={setNewSubtask}
        placeholder="Enter a subtask"
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.addSubtaskButton} onPress={handleAddSubtask}>
        <Text style={styles.addSubtaskButtonText}>Add Subtask</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <TouchableOpacity style={styles.addTaskButton} onPress={handleAddTask}>
      <Text style={styles.addTaskButtonText}>Add Task</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={subtasks}
      renderItem={renderSubtaskItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0C3B2E',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    color: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#6D9773',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#1A4A3C',
    color: '#FFFFFF',
  },
  dateButton: {
    backgroundColor: '#6D9773',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  picker: {
    backgroundColor: '#1A4A3C',
    color: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
  },
  addSubtaskButton: {
    backgroundColor: '#B46617',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  addSubtaskButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  subtaskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  deleteSubtask: {
    color: '#FFBA00',
    fontSize: 14,
  },
  addTaskButton: {
    backgroundColor: '#6D9773',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addTaskButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateTask;