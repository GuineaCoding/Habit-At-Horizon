import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import CustomAppBar from '../../components/CustomAppBar';

const MenteeListScreen = ({ navigation }) => {
  const [mentees, setMentees] = useState([]);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const menteeSnapshot = await firestore()
          .collection('users')
          .where('roles', 'array-contains', 'mentee')
          .get();

        const menteeList = menteeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMentees(menteeList);
      } catch (error) {
        console.error('Error fetching mentees:', error);
      }
    };

    fetchMentees();
  }, []);

  const renderProfileImage = (profileImage, username) => {
    if (profileImage) {
      return (
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      );
    } else {
      const firstLetter = username ? username.charAt(0).toUpperCase() : 'U';
      return (
        <View style={styles.profilePlaceholder}>
          <Text style={styles.profilePlaceholderText}>{firstLetter}</Text>
        </View>
      );
    }
  };

  const renderMenteeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menteeItem}
      onPress={() => navigation.navigate('MenteeProfileViewScreen', { mentee: item })}
    >
      {renderProfileImage(item.profileImage, item.username)}
      <View style={styles.menteeInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.username}>@{item.username}</Text>
        <Text style={styles.bio}>{item.bio}</Text>
        {item.tags && (
          <View style={styles.tagsContainer}>
            <Text style={styles.sectionTitle}>Interests:</Text>
            <View style={styles.tagsRow}>
              {item.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Mentee List" showBackButton={false} />
      <FlatList
        data={mentees}
        renderItem={renderMenteeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  menteeItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: '#264d00',
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
  profilePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6D9773',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profilePlaceholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  menteeInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#FFBA00',
  },
  username: {
    fontSize: 14,
    color: '#6D9773',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagsContainer: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFBA00',
    marginBottom: 4,
  },
  tagsRow: {
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

export default MenteeListScreen;