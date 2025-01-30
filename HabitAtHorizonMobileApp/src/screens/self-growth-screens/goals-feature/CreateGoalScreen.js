import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateGoalScreen = ({ navigation, route }) => {
  const { userId } = route.params || {};
  const [title, setTitle] = useState('');
  const [type, setType] = useState('short-term');
  const [category, setCategory] = useState('Health');
  const [description, setDescription] = useState('');
  const [milestones, setMilestones] = useState([]); 
  const [milestoneTitle, setMilestoneTitle] = useState('');  
  const [milestoneDeadline, setMilestoneDeadline] = useState(new Date()); 
  const [showDatePicker, setShowDatePicker] = useState(false); 

  useEffect(() => {
    if (!route.params) {
      console.error('route.params is undefined');
      alert('Navigation error. Please try again.');
      navigation.goBack();
    }
  }, [route.params]);

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User ID is missing. Please log in again.</Text>
      </View>
    );
  }

  const handleAddMilestone = () => {
    if (!milestoneTitle.trim()) {
      alert('Please enter a milestone title.');
      return;
    }

    const newMilestone = {
      id: Date.now().toString(), 
      title: milestoneTitle,
      deadline: milestoneDeadline,
      status: 'not started',
    };

    setMilestones([...milestones, newMilestone]); 
    setMilestoneTitle(''); 
    setMilestoneDeadline(new Date()); 
  };

  const handleCreateGoal = async () => {
    if (!title.trim()) {
      alert('Please enter a goal title.');
      return;
    }

    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('goals')
        .add({
          title,
          type,
          category,
          description,
          milestones, 
          status: 'active',
          createdAt: firestore.Timestamp.fromDate(new Date()),
          updatedAt: firestore.Timestamp.fromDate(new Date()),
        });
      alert('Goal created successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating goal: ', error);
      alert('Failed to create goal.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setMilestoneDeadline(selectedDate);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderMilestoneItem = ({ item }) => (
    <View style={styles.milestoneItem}>
      <Text style={styles.milestoneTitle}>{item.title}</Text>
      <Text style={styles.milestoneDeadline}>
        Deadline: {formatDate(item.deadline)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a New Goal</Text>

      <Text style={styles.label}>Goal Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter goal title"
      />

      <Text style={styles.label}>Goal Type</Text>
      <Picker
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Short-term" value="short-term" />
        <Picker.Item label="Long-term" value="long-term" />
      </Picker>

      <Text style={styles.label}>Category</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Health" value="Health" />
        <Picker.Item label="Career" value="Career" />
        <Picker.Item label="Personal Growth" value="Personal Growth" />
        <Picker.Item label="Finance" value="Finance" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Text style={styles.label}>Description (Optional)</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter goal description"
        multiline
      />

      <Text style={styles.label}>Add Milestones</Text>
      <TextInput
        style={styles.input}
        value={milestoneTitle}
        onChangeText={setMilestoneTitle}
        placeholder="Enter milestone title"
      />
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          Select Deadline: {formatDate(milestoneDeadline)}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={milestoneDeadline}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
      <TouchableOpacity style={styles.addMilestoneButton} onPress={handleAddMilestone}>
        <Text style={styles.addMilestoneButtonText}>Add Milestone</Text>
      </TouchableOpacity>

      <FlatList
        data={milestones}
        renderItem={renderMilestoneItem}
        keyExtractor={(item) => item.id}
        style={styles.milestoneList}
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreateGoal}>
        <Text style={styles.createButtonText}>Create Goal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  createButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  dateButton: {
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  addMilestoneButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addMilestoneButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  milestoneList: {
    marginTop: 10,
  },
  milestoneItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  milestoneDeadline: {
    fontSize: 14,
    color: '#666',
  },
});

export default CreateGoalScreen;