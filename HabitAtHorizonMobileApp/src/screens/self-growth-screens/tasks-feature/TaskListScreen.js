import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const TaskList = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'ongoing', title: 'Ongoing' },
    { key: 'completed', title: 'Completed' },
  ]);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setUserId(user.uid);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .onSnapshot((snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
      });

    return () => unsubscribe();
  }, [userId]);

  const OngoingTasks = () => {
    const ongoingTasks = tasks.filter((task) => task.status !== 'Completed');
    return <TaskTab tasks={ongoingTasks} navigation={navigation} userId={userId} />;
  };

  const CompletedTasks = () => {
    const completedTasks = tasks.filter((task) => task.status === 'Completed');
    return <TaskTab tasks={completedTasks} navigation={navigation} userId={userId} />;
  };

  const renderScene = SceneMap({
    ongoing: OngoingTasks,
    completed: CompletedTasks,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#FFBA00' }}
      style={{ backgroundColor: '#0C3B2E' }}
      labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
    />
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={renderTabBar}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateTaskScreen', { userId })}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const TaskTab = ({ tasks, navigation, userId }) => {
  const handleTaskPress = (task) => {
    navigation.navigate('ViewTaskScreen', { task, userId });
  };

  const markTaskComplete = (taskId) => {
    firestore()
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .doc(taskId)
      .update({ status: 'Completed' });
  };

  const deleteTask = (taskId) => {
    firestore()
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .doc(taskId)
      .delete();
  };

  const handleEditTask = (task) => {
    navigation.navigate('EditTaskScreen', { task, userId });
  };

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.taskItem, item.dueDate.toDate() < new Date() && styles.overdueTask]}
      onPress={() => handleTaskPress(item)}>
      <View style={styles.taskDetails}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDueDate}>Due: {item.dueDate.toDate().toLocaleDateString()}</Text>
        <Text style={styles.taskPriority}>Priority: {item.priority}</Text>
        <Text style={styles.taskCategory}>Category: {item.category}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: '#6D9773' }]}
          onPress={(e) => {
            e.stopPropagation();
            markTaskComplete(item.id);
          }}>
          <Text style={styles.buttonText}>✓</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: '#B46617' }]}
          onPress={(e) => {
            e.stopPropagation();
            handleEditTask(item);
          }}>
          <Text style={styles.buttonText}>✎</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: '#FFBA00' }]}
          onPress={(e) => {
            e.stopPropagation();
            deleteTask(item.id);
          }}>
          <Text style={styles.buttonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={tasks}
      renderItem={renderTaskItem}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C3B2E',
    paddingTop: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#6D9773',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
  },
  overdueTask: {
    backgroundColor: '#ffcccc',
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0C3B2E',
  },
  taskDueDate: {
    fontSize: 14,
    color: '#666',
  },
  taskPriority: {
    fontSize: 14,
    color: '#666',
  },
  taskCategory: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFBA00',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    fontSize: 30,
    color: '#0C3B2E',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  smallButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TaskList;