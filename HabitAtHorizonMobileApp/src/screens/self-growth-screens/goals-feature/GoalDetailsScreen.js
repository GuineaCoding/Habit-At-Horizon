import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ProgressBar } from 'react-native-paper';
import CustomAppBar from '../../../components/CustomAppBar';

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

  const calculateLevel = (xp) => {
    return Math.floor(Math.sqrt(xp / 100));
  };

  const handleMarkGoalCompleted = async () => {
    try {
      const userRef = firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();
      const userData = userDoc.data();

      const today = new Date().toISOString().split('T')[0];

      const lastPointsEarnedDate = userData.lastPointsEarnedDate || '';
      const pointsEarnedToday = userData.pointsEarnedToday || 0;

      const hasReachedDailyLimit = lastPointsEarnedDate === today && pointsEarnedToday >= 10;

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

      if (!hasReachedDailyLimit) {
        let updatedPointsEarnedToday = pointsEarnedToday;
        if (lastPointsEarnedDate !== today) {
          updatedPointsEarnedToday = 0;
        }

        await userRef.update({
          points: firestore.FieldValue.increment(10),
          pointsEarnedToday: updatedPointsEarnedToday + 10,
          lastPointsEarnedDate: today,
        });

        Alert.alert(
          'Success',
          'Goal and all milestones marked as completed! 10 points added.'
        );
      } else {
        Alert.alert(
          'Goal Completed',
          'Goal and all milestones marked as completed. No points awarded (daily limit reached).'
        );
      }

      await userRef.update({
        xp: firestore.FieldValue.increment(10),
      });

      const updatedUserDoc = await userRef.get();
      const updatedXp = updatedUserDoc.data().xp || 0;
      const updatedLevel = calculateLevel(updatedXp);

      if (updatedLevel > userData.level) {
        await userRef.update({
          level: updatedLevel,
        });

        Alert.alert(
          'Level Up!',
          `Congratulations! You've reached Level ${updatedLevel}.`
        );
      }

      const lastGoalCompletionDate = userData.lastGoalCompletionDate || '';
      const streak = userData.streak || 0;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayFormatted = yesterday.toISOString().split('T')[0];

      let updatedStreak = streak;
      if (lastGoalCompletionDate === yesterdayFormatted) {
        updatedStreak += 1;
      } else if (lastGoalCompletionDate !== today) {
        updatedStreak = 1;
      }

      let updatedLongestStreak = userData.longestStreak || 0;
      if (updatedStreak > updatedLongestStreak) {
        updatedLongestStreak = updatedStreak;
      }

      if (updatedStreak === 7) {
        await userRef.update({
          points: firestore.FieldValue.increment(30),
        });

        Alert.alert(
          'Streak Bonus!',
          'You completed goals for 7 consecutive days! 30 points awarded.'
        );
      }

      await userRef.update({
        streak: updatedStreak,
        longestStreak: updatedLongestStreak,
        lastGoalCompletionDate: today,
      });

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
      <CustomAppBar
        title="Goal Details"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <Text style={styles.header}>{goal.title}</Text>
      <Text style={styles.category}>Category: {goal.category}</Text>
      <Text style={styles.description}>{goal.description}</Text>

      <Text style={styles.progressLabel}>Progress</Text>
      <ProgressBar
        progress={progress}
        color="#FFBA00"
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
    backgroundColor: '#0C3B2E',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  category: {
    fontSize: 16,
    color: '#B46617',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#6D9773',
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFFFFF',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#6D9773',
    marginBottom: 20,
  },
  milestonesHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  milestoneItem: {
    backgroundColor: '#6D9773',
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
    color: '#FFFFFF',
  },
  milestoneDeadline: {
    fontSize: 14,
    color: '#B46617',
    marginTop: 5,
  },
  milestoneStatus: {
    fontSize: 14,
    color: '#FFBA00',
    marginTop: 5,
  },
  completeButton: {
    backgroundColor: '#B46617',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  completeGoalButton: {
    backgroundColor: '#FFBA00',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  completeGoalButtonText: {
    color: '#0C3B2E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#6D9773',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default GoalDetailsScreen;