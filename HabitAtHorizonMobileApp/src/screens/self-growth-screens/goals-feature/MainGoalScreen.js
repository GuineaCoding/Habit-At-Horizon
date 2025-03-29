import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomAppBar from '../../../components/CustomAppBar';
import LinearGradient from 'react-native-linear-gradient';
import { mainGoalPageStyles } from './styles';

const MainGoalPage = ({ navigation }) => {
  const [goals, setGoals] = useState([]);
  const [userId, setUserId] = useState(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'ongoing', title: 'Ongoing' },
    { key: 'achieved', title: 'Achieved' },
    { key: 'abandoned', title: 'Abandoned' },
  ]);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setUserId(user.uid);
    } else {
      alert('User not logged in.');
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .collection('goals')
      .onSnapshot((snapshot) => {
        const goalsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGoals(goalsData);
      });

    return () => unsubscribe();
  }, [userId]);

  const renderGoalItem = ({ item }) => (
    <TouchableOpacity
      style={mainGoalPageStyles.goalItem}
      onPress={() => navigation.navigate('GoalDetailsScreen', { goal: item, userId })}
    >
      <Text style={mainGoalPageStyles.goalTitle}>{item.title}</Text>
      <Text style={mainGoalPageStyles.goalCategory}>{item.category}</Text>
      <Text style={mainGoalPageStyles.goalStatus}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  const OngoingGoals = () => (
    <FlatList
      data={goals.filter((goal) => goal.status === 'active')}
      renderItem={renderGoalItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text style={mainGoalPageStyles.emptyText}>No ongoing goals.</Text>}
    />
  );

  const AchievedGoals = () => (
    <FlatList
      data={goals.filter((goal) => goal.status === 'completed')}
      renderItem={renderGoalItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text style={mainGoalPageStyles.emptyText}>No achieved goals.</Text>}
    />
  );

  const goToProgressScreen = () => {
    navigation.navigate('ProgressScreen', { userId });
  };

  const AbandonedGoals = () => (
    <FlatList
      data={goals.filter((goal) => goal.status === 'abandoned')}
      renderItem={renderGoalItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text style={mainGoalPageStyles.emptyText}>No abandoned goals.</Text>}
    />
  );

  const renderScene = SceneMap({
    ongoing: OngoingGoals,
    achieved: AchievedGoals,
    abandoned: AbandonedGoals,
  });

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={mainGoalPageStyles.container}>
      <CustomAppBar title="My Goals" showBackButton={true} />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={mainGoalPageStyles.tabBar}
            indicatorStyle={mainGoalPageStyles.indicator}
            labelStyle={mainGoalPageStyles.tabLabel}
          />
        )}
      />

      <TouchableOpacity
        style={mainGoalPageStyles.addButton}
        onPress={() => navigation.navigate('CreateGoalScreen', { userId })}
      >
        <Text style={mainGoalPageStyles.addButtonText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity style={mainGoalPageStyles.progressButton} onPress={goToProgressScreen}>
        <Text style={mainGoalPageStyles.progressButtonText}>Go to Leaderboard</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default MainGoalPage;