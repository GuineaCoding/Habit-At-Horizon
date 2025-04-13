import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomAppBar from '../../components/CustomAppBar';

import { topListScreenStyle as styles } from './styles';

const TopListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await firestore().collection('users').get();

        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          points: doc.data().points || 0, // Set points to 0 if empty or undefined
        }));

        const sortedUsers = usersData.sort((a, b) => b.points - a.points);

        setUsers(sortedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const renderUserItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('MenteeProfileViewScreen', { mentee: item })}
    >
      <View style={styles.rankContainer}>
        <Icon
          name={index === 0 ? 'trophy' : 'numeric'}
          size={24}
          color={index === 0 ? '#FFBA00' : '#0C3B2E'}
        />
        <Text style={styles.rank}>{index + 1}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.username}>@{item.username}</Text>
      </View>
      <View style={styles.pointsContainer}>
        <Icon name="star" size={20} color="#B46617" />
        <Text style={styles.points}>{item.points} points</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Top List" showBackButton={true} />
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </LinearGradient>
  );
};

export default TopListScreen;