// CreateGoalScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import CustomAppBar from '../../../components/CustomAppBar';
import { createGoalStyles } from './styles'; 

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
      <LinearGradient colors={['#0C3B2E', '#6D9773']} style={createGoalStyles.container}>
        <Text style={createGoalStyles.errorText}>User ID is missing. Please log in again.</Text>
      </LinearGradient>
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
    <View style={createGoalStyles.milestoneItem}>
      <Text style={createGoalStyles.milestoneTitle}>{item.title}</Text>
      <Text style={createGoalStyles.milestoneDeadline}>
        Deadline: {formatDate(item.deadline)}
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={createGoalStyles.container}>
      <CustomAppBar title="Create Goal" showBackButton={true} />
      <ScrollView contentContainerStyle={createGoalStyles.content}>
        <Text style={createGoalStyles.header}>Create a New Goal</Text>

        <Text style={createGoalStyles.label}>Goal Title</Text>
        <TextInput
          style={createGoalStyles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter goal title"
          placeholderTextColor="#ffffff"
        />

        <Text style={createGoalStyles.label}>Goal Type</Text>
        <Picker
          selectedValue={type}
          onValueChange={(itemValue) => setType(itemValue)}
          style={createGoalStyles.picker}
          dropdownIconColor="#FFBA00"
        >
          <Picker.Item label="Short-term" value="short-term" color="#FFBA00" />
          <Picker.Item label="Long-term" value="long-term" color="#FFBA00" />
        </Picker>

        <Text style={createGoalStyles.label}>Category</Text>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={createGoalStyles.picker}
          dropdownIconColor="#FFBA00"
        >
          <Picker.Item label="Health" value="Health" color="#FFBA00" />
          <Picker.Item label="Career" value="Career" color="#FFBA00" />
          <Picker.Item label="Personal Growth" value="Personal Growth" color="#FFBA00" />
          <Picker.Item label="Finance" value="Finance" color="#FFBA00" />
          <Picker.Item label="Other" value="Other" color="#FFBA00" />
        </Picker>

        <Text style={createGoalStyles.label}>Description (Optional)</Text>
        <TextInput
          style={[createGoalStyles.input, createGoalStyles.multilineInput]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter goal description"
          placeholderTextColor="#ffffff"
          multiline={true}
          textAlignVertical="top"
        />

        <Text style={createGoalStyles.label}>Add Milestones</Text>
        <TextInput
          style={createGoalStyles.input}
          value={milestoneTitle}
          onChangeText={setMilestoneTitle}
          placeholder="Enter milestone title"
          placeholderTextColor="#ffffff"
        />
        <TouchableOpacity
          style={createGoalStyles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={createGoalStyles.dateButtonText}>
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
        <TouchableOpacity style={createGoalStyles.addMilestoneButton} onPress={handleAddMilestone}>
          <Text style={createGoalStyles.addMilestoneButtonText}>Add Milestone</Text>
        </TouchableOpacity>

        <FlatList
          data={milestones}
          renderItem={renderMilestoneItem}
          keyExtractor={(item) => item.id}
          style={createGoalStyles.milestoneList}
          scrollEnabled={false} 
        />

        <TouchableOpacity style={createGoalStyles.createButton} onPress={handleCreateGoal}>
          <Text style={createGoalStyles.createButtonText}>Create Goal</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default CreateGoalScreen;