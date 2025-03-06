import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import CustomAppBar from '../../../components/CustomAppBar';

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
      <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
        <Text style={styles.errorText}>User ID is missing. Please log in again.</Text>
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
    <View style={styles.milestoneItem}>
      <Text style={styles.milestoneTitle}>{item.title}</Text>
      <Text style={styles.milestoneDeadline}>
        Deadline: {formatDate(item.deadline)}
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Create Goal" showBackButton={true} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Create a New Goal</Text>

        <Text style={styles.label}>Goal Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter goal title"
          placeholderTextColor="#ffffff"
        />

        <Text style={styles.label}>Goal Type</Text>
        <Picker
          selectedValue={type}
          onValueChange={(itemValue) => setType(itemValue)}
          style={styles.picker}
          dropdownIconColor="#FFBA00"
        >
          <Picker.Item label="Short-term" value="short-term" color="#FFBA00" />
          <Picker.Item label="Long-term" value="long-term" color="#FFBA00" />
        </Picker>

        <Text style={styles.label}>Category</Text>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
          dropdownIconColor="#FFBA00"
        >
          <Picker.Item label="Health" value="Health" color="#FFBA00" />
          <Picker.Item label="Career" value="Career" color="#FFBA00" />
          <Picker.Item label="Personal Growth" value="Personal Growth" color="#FFBA00" />
          <Picker.Item label="Finance" value="Finance" color="#FFBA00" />
          <Picker.Item label="Other" value="Other" color="#FFBA00" />
        </Picker>

        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter goal description"
          placeholderTextColor="#ffffff"
          multiline={true}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Add Milestones</Text>
        <TextInput
          style={styles.input}
          value={milestoneTitle}
          onChangeText={setMilestoneTitle}
          placeholder="Enter milestone title"
          placeholderTextColor="#ffffff"
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
          scrollEnabled={false} // Disable scrolling in FlatList since ScrollView handles it
        />

        <TouchableOpacity style={styles.createButton} onPress={handleCreateGoal}>
          <Text style={styles.createButtonText}>Create Goal</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFBA00',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    color: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#6D9773',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#6D9773',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  createButton: {
    backgroundColor: '#B46617',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
  },
  dateButton: {
    backgroundColor: '#FFBA00',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  dateButtonText: {
    color: '#0C3B2E',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addMilestoneButton: {
    backgroundColor: '#6D9773',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addMilestoneButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  milestoneList: {
    marginTop: 10,
  },
  milestoneItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  milestoneDeadline: {
    fontSize: 14,
    color: '#6D9773',
  },
});

export default CreateGoalScreen;