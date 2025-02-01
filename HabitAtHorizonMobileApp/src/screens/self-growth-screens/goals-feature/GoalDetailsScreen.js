import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ProgressBar } from 'react-native-paper';

const GoalDetailsScreen = ({ navigation, route }) => {
  const { goal: initialGoal, userId } = route.params;
  const [goal, setGoal] = useState(initialGoal); 
  const [milestones, setMilestones] = useState(initialGoal.milestones || []);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .collection('goals')
      .doc(initialGoal.id)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const updatedGoal = { id: doc.id, ...doc.data() };
          setGoal(updatedGoal);
          setMilestones(updatedGoal.milestones || []);
        }
      });

    return () => unsubscribe();
  }, [initialGoal.id, userId]);


  useEffect(() => {
    if (goal.status === 'completed') {
      setProgress(1); 
    } else {
      const completedMilestones = milestones.filter((m) => m.status === 'completed').length;
      const totalMilestones = milestones.length;
      const newProgress = totalMilestones > 0 ? completedMilestones / totalMilestones : 0;
      setProgress(newProgress);
    }
  }, [milestones, goal.status]);

  const handleMarkGoalCompleted = async () => {
    try {
    
      const updatedMilestones = milestones.map((m) => ({
        ...m,
        status: 'completed',
      }));

      await firestore()
        .collection('users')
        .doc(userId)
        .collection('goals')
        .doc(goal.id)
        .update({
          status: 'completed',
          milestones: updatedMilestones,
          updatedAt: firestore.Timestamp.fromDate(new Date()),
        });

      Alert.alert('Success', 'Goal and all milestones marked as completed!');
      navigation.goBack();
    } catch (error) {
      console.error('Error marking goal as completed: ', error);
      Alert.alert('Error', 'Failed to mark goal as completed.');
    }
  };

  const handleMarkMilestoneCompleted = async (milestoneId) => {
    try {
      const updatedMilestones = milestones.map((m) =>
        m.id === milestoneId ? { ...m, status: 'completed' } : m
      );

      await firestore()
        .collection('users')
        .doc(userId)
        .collection('goals')
        .doc(goal.id)
        .update({
          milestones: updatedMilestones,
          updatedAt: firestore.Timestamp.fromDate(new Date()),
        });

      setMilestones(updatedMilestones);
      Alert.alert('Success', 'Milestone marked as completed!');
    } catch (error) {
      console.error('Error marking milestone as completed: ', error);
      Alert.alert('Error', 'Failed to mark milestone as completed.');
    }
  };

  const renderMilestoneItem = ({ item }) => (
    <View style={styles.milestoneItem}>
      <Text style={styles.milestoneTitle}>{item.title}</Text>
      <Text style={styles.milestoneDeadline}>
        Deadline: {new Date(item.deadline).toLocaleDateString()}
      </Text>
      <Text style={styles.milestoneStatus}>Status: {item.status}</Text>
      {item.status !== 'completed' && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => handleMarkMilestoneCompleted(item.id)}
        >
          <Text style={styles.completeButtonText}>Mark as Completed</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{goal.title}</Text>
      <Text style={styles.category}>Category: {goal.category}</Text>
      <Text style={styles.description}>{goal.description}</Text>

      <Text style={styles.progressLabel}>Progress</Text>
      <ProgressBar
        progress={progress}
        color="#6200EE"
        style={styles.progressBar}
      />
      <Text style={styles.progressText}>{Math.round(progress * 100)}% completed</Text>

      <Text style={styles.milestonesHeader}>Milestones</Text>
      <FlatList
        data={milestones}
        renderItem={renderMilestoneItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No milestones added.</Text>}
      />

      {goal.status !== 'completed' && (
        <TouchableOpacity style={styles.completeGoalButton} onPress={handleMarkGoalCompleted}>
          <Text style={styles.completeGoalButtonText}>Mark Goal as Completed</Text>
        </TouchableOpacity>
      )}
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
    marginBottom: 10,
    color: '#333',
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  milestonesHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  milestoneItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  milestoneDeadline: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  milestoneStatus: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  completeGoalButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  completeGoalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default GoalDetailsScreen;