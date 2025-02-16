import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const MentorListPage = () => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const mentorSnapshot = await firestore().collection('mentors').get();
        const mentorList = mentorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMentors(mentorList);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };

    fetchMentors();
  }, []);

  const renderMentorItem = ({ item }) => (
    <View style={styles.mentorItem}>
      <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
      <View style={styles.mentorInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.username}>@{item.username}</Text>
        <Text style={styles.bio}>{item.bio}</Text>
        <Text style={styles.expertise}>Offers: {item.expertise}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mentors}
        renderItem={renderMentorItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  mentorItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  mentorInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  expertise: {
    fontSize: 14,
    color: '#007BFF',
  },
});

export default MentorListPage;