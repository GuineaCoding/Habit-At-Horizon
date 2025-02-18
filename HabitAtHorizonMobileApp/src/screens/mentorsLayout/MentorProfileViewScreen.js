import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomAppBar from '../../components/CustomAppBar';

const MentorProfileViewScreen = ({ navigation }) => {
  const [mentor, setMentor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const userId = auth().currentUser?.uid;

  useEffect(() => {
    const fetchMentorProfile = async () => {
      if (userId) {
        try {
          const mentorSnapshot = await firestore()
            .collection('mentors')
            .where('userId', '==', userId)
            .get();

          if (!mentorSnapshot.empty) {
            const mentorData = mentorSnapshot.docs[0].data();
            setMentor(mentorData);
          }
        } catch (error) {
          console.error('Error fetching mentor profile:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMentorProfile();
  }, [userId]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!mentor) {
    return (
      <View style={styles.container}>
        <Text style={styles.noProfileText}>No mentor profile found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <CustomAppBar title="My Mentor Profile" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.name}>{mentor.name}</Text>
        <Text style={styles.username}>@{mentor.username}</Text>

        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.bio}>{mentor.bio}</Text>

        <Text style={styles.sectionTitle}>Expertise</Text>
        <Text style={styles.expertise}>{mentor.expertise}</Text>

        {mentor.tags && mentor.tags.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {mentor.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
          </>
        )}

        {mentor.availability && mentor.availability.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Availability</Text>
            <View style={styles.tagsContainer}>
              {mentor.availability.map((avail, index) => (
                <Text key={index} style={styles.tag}>
                  {avail}
                </Text>
              ))}
            </View>
          </>
        )}

        {mentor.languages && mentor.languages.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.tagsContainer}>
              {mentor.languages.map((lang, index) => (
                <Text key={index} style={styles.tag}>
                  {lang}
                </Text>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Experience Level</Text>
        <Text style={styles.experienceLevel}>{mentor.experienceLevel}</Text>

        <Text style={styles.sectionTitle}>Social Media</Text>
        <Image source={{ uri: mentor.profileImage }} style={styles.profileImage} />
        {mentor.linkedIn && (
          <Text style={styles.link}>LinkedIn: {mentor.linkedIn}</Text>
        )}
        {mentor.twitter && (
          <Text style={styles.link}>Twitter: {mentor.twitter}</Text>
        )}
      </ScrollView>
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
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', 
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#6D9773', 
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFBA00', 
    marginTop: 16,
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#FFFFFF', 
    textAlign: 'center',
    marginBottom: 16,
  },
  expertise: {
    fontSize: 14,
    color: '#FFFFFF', 
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
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
  experienceLevel: {
    fontSize: 14,
    color: '#FFFFFF', 
    marginBottom: 16,
  },
  link: {
    fontSize: 14,
    color: '#007BFF', 
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF', 
    textAlign: 'center',
  },
  noProfileText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default MentorProfileViewScreen;