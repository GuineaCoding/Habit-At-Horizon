import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CustomAppBar from '../../components/CustomAppBar';

const ProgressScreen = ({ navigation, route }) => {
  const { userId } = route.params;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firestore().collection('users').doc(userId).get();
        if (userDoc.exists) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFBA00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomAppBar
        title="Progress"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <Text style={styles.header}>Your Progress</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Points:</Text>
          <Text style={styles.value}>{userData.points || 0}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Current Streak:</Text>
          <Text style={styles.value}>{userData.streak || 0} days</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Longest Streak:</Text>
          <Text style={styles.value}>{userData.longestStreak || 0} days</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Continuous Streak:</Text>
          <Text style={styles.value}>
            {userData.isContinuousStreak ? 'Yes' : 'No'}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Level:</Text>
          <Text style={styles.value}>{userData.level || 1}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>XP:</Text>
          <Text style={styles.value}>{userData.xp || 0}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C3B2E',
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    color: '#6D9773',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFBA00',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C3B2E',
  },
});

export default ProgressScreen;