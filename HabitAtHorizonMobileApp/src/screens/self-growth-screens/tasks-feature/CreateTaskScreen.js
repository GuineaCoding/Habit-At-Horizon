import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import CustomAppBar from '../../../components/CustomAppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createTaskScreen as styles } from './styles';

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

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Create New Task" showBackButton={true} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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

        {/* Subtask Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Subtasks</Text>
          <View style={styles.subtaskInputContainer}>
            <View style={[styles.inputWrapper, { flex: 1 }]}>
              <Icon name="format-list-checks" size={24} color="#FFBA00" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={newSubtask}
                onChangeText={setNewSubtask}
                placeholder="Enter a subtask"
                placeholderTextColor="#6D9773"
              />
            </View>
            <TouchableOpacity style={styles.smallYellowButton} onPress={handleAddSubtask}>
              <Icon name="plus" size={20} color="#0C3B2E" />
              <Text style={styles.smallYellowButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Subtask List */}
        <FlatList
          data={subtasks}
          renderItem={renderSubtaskItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          style={styles.subtaskList}
        />

        {/* Add Task Button */}
        <TouchableOpacity style={styles.largeYellowButton} onPress={handleAddTask}>
          <Icon name="check" size={24} color="#0C3B2E" style={styles.buttonIcon} />
          <Text style={styles.largeYellowButtonText}>Add Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default CreateTask;