import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CustomAppBar from '../../components/CustomAppBar';

const MentorListPage = ({ navigation }) => {
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

  const handleMentorPress = (mentor) => {
    navigation.navigate('MentorProfileViewScreen', { mentor });
  };

  const renderMentorItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mentorItem}
      onPress={() => handleMentorPress(item)} // Make the mentor item clickable
    >
      <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
      <View style={styles.mentorInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.username}>@{item.username}</Text>
        <Text style={styles.bio}>{item.bio}</Text>
        <Text style={styles.expertise}>Offers: {item.expertise}</Text>
        {item.tags && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CustomAppBar title="Mentor List" showBackButton={true} />
      <FlatList
        data={mentors}
        renderItem={renderMentorItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C3B2E',
  },
  listContainer: {
    padding: 16,
  },
  mentorItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
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
    color: '#0C3B2E',
  },
  username: {
    fontSize: 14,
    color: '#6D9773',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  expertise: {
    fontSize: 14,
    color: '#B46617',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: 12,
    color: '#FFFFFF',
    backgroundColor: '#6D9773',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
});

export default MentorListPage;