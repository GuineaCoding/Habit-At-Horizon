import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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
      style={styles.goalItem}
      onPress={() => navigation.navigate('GoalDetailsScreen', { goal: item, userId })}
    >
      <Text style={styles.goalTitle}>{item.title}</Text>
      <Text style={styles.goalCategory}>{item.category}</Text>
      <Text style={styles.goalStatus}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  const OngoingGoals = () => (
    <FlatList
      data={goals.filter((goal) => goal.status === 'ongoing')}
      renderItem={renderGoalItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text style={styles.emptyText}>No ongoing goals.</Text>}
    />
  );

  const AchievedGoals = () => (
    <FlatList
      data={goals.filter((goal) => goal.status === 'completed')}
      renderItem={renderGoalItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text style={styles.emptyText}>No achieved goals.</Text>}
    />
  );

  const AbandonedGoals = () => (
    <FlatList
      data={goals.filter((goal) => goal.status === 'abandoned')}
      renderItem={renderGoalItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text style={styles.emptyText}>No abandoned goals.</Text>}
    />
  );

  const renderScene = SceneMap({
    ongoing: OngoingGoals,
    achieved: AchievedGoals,
    abandoned: AbandonedGoals,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Goals</Text>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={styles.tabBar}
            indicatorStyle={styles.indicator}
            labelStyle={styles.tabLabel}
          />
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateGoalScreen', { userId })}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    color: '#333',
  },
  goalItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  goalCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  goalStatus: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
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
    color: '#fff',
  },
  tabBar: {
    backgroundColor: '#6200EE',
  },
  indicator: {
    backgroundColor: '#fff',
  },
  tabLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MainGoalPage;