import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
          .where('visibleToOthers', '==', true) // Only show visible mentees
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

  const renderMenteeItem = ({ item }) => {
    const firstLetter = item.username ? item.username.charAt(0).toUpperCase() : 'U';
    
    return (
      <TouchableOpacity
        style={styles.menteeItem}
        onPress={() => navigation.navigate('MenteeProfileViewScreen', { mentee: item })}
      >
        {item.profileImage ? (
          <Image 
            source={{ uri: item.profileImage }}
            style={styles.profileImage}
          />
        ) : (
          <LinearGradient
            colors={['#0C3B2E', '#6D9773']}
            style={styles.profileCircle}
          >
            <Text style={styles.profileLetter}>{firstLetter}</Text>
          </LinearGradient>
        )}
        
        <View style={styles.menteeInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.username}>@{item.username}</Text>
          <Text style={styles.bio} numberOfLines={2} ellipsizeMode="tail">
            {item.bio}
          </Text>
          
          {item.menteeData?.goals?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Goals:</Text>
              <View style={styles.tagsContainer}>
                {item.menteeData.goals.slice(0, 3).map((goal, index) => (
                  <Text key={index} style={styles.tag}>
                    {goal}
                  </Text>
                ))}
                {item.menteeData.goals.length > 3 && (
                  <Text style={styles.moreTag}>+{item.menteeData.goals.length - 3}</Text>
                )}
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Mentee List" showBackButton={false} />
      <FlatList
        data={mentees}
        renderItem={renderMenteeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No mentees found</Text>
        }
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
    borderWidth: 1,
    borderColor: 'rgba(255, 186, 0, 0.2)',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#FFBA00',
  },
  profileCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#FFBA00',
  },
  profileLetter: {
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
    color: '#FFBA00',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    opacity: 0.9,
  },
  section: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#FFBA00',
    marginBottom: 4,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: 12,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 186, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 186, 0, 0.5)',
  },
  moreTag: {
    fontSize: 12,
    color: '#FFBA00',
    paddingVertical: 4,
  },
  emptyText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default MenteeListScreen;