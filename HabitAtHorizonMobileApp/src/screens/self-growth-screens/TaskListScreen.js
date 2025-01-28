import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const TaskList = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('tasks')
      .orderBy('dueDate', 'asc')
      .onSnapshot((snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
      });

    return () => unsubscribe();
  }, []);

  const handleTaskPress = (task) => {
    navigation.navigate('TaskDetails', { task });
  };

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity style={styles.taskItem} onPress={() => handleTaskPress(item)}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDueDate}>Due: {item.dueDate.toDate().toLocaleDateString()}</Text>
      <Text style={styles.taskPriority}>Priority: {item.priority}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateTask')}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  taskItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDueDate: {
    fontSize: 14,
    color: '#666',
  },
  taskPriority: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6200EE',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 30,
    color: 'white',
  },
});

export default TaskList;