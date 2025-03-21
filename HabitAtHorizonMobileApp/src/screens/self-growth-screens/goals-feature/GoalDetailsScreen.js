import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ProgressBar } from 'react-native-paper';
import CustomAppBar from '../../../components/CustomAppBar';
import LinearGradient from 'react-native-linear-gradient';
import { goalDetailsStyles } from './styles'; 

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
    <View style={goalDetailsStyles.milestoneItem}>
      <Text style={goalDetailsStyles.milestoneTitle}>{item.title}</Text>
      <Text style={goalDetailsStyles.milestoneDeadline}>
        Deadline: {new Date(item.deadline).toLocaleDateString()}
      </Text>
      <Text style={goalDetailsStyles.milestoneStatus}>Status: {item.status}</Text>
      {item.status !== 'completed' && (
        <TouchableOpacity
          style={goalDetailsStyles.completeButton}
          onPress={() => handleMarkMilestoneCompleted(item.id)}
        >
          <Text style={goalDetailsStyles.completeButtonText}>Mark as Completed</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={goalDetailsStyles.container}>
      <CustomAppBar
        title="Goal Details"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <View style={goalDetailsStyles.content}>
        <Text style={goalDetailsStyles.header}>{goal.title}</Text>
        <Text style={goalDetailsStyles.category}>Category: {goal.category}</Text>
        <Text style={goalDetailsStyles.description}>{goal.description}</Text>

        <Text style={goalDetailsStyles.progressLabel}>Progress</Text>
        <ProgressBar
          progress={progress}
          color="#FFBA00"
          style={goalDetailsStyles.progressBar}
        />
        <Text style={goalDetailsStyles.progressText}>{Math.round(progress * 100)}% completed</Text>

        <Text style={goalDetailsStyles.milestonesHeader}>Milestones</Text>
        <FlatList
          data={milestones}
          renderItem={renderMilestoneItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={goalDetailsStyles.emptyText}>No milestones added.</Text>}
        />

        {goal.status !== 'completed' && (
          <TouchableOpacity style={goalDetailsStyles.completeGoalButton} onPress={handleMarkGoalCompleted}>
            <Text style={goalDetailsStyles.completeGoalButtonText}>Mark Goal as Completed</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

export default GoalDetailsScreen;