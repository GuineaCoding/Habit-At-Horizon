import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import CustomAppBar from '../../components/CustomAppBar';

const MenteeProfileViewScreen = ({ route }) => {
  const { mentee } = route.params; 

  return (
    <View style={styles.container}>

      <CustomAppBar title="Mentee Profile" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.content}>

        {mentee.profileImage && (
          <Image source={{ uri: mentee.profileImage }} style={styles.profileImage} />
        )}

        <Text style={styles.name}>{mentee.name}</Text>
        <Text style={styles.username}>@{mentee.username}</Text>

        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.bio}>{mentee.bio}</Text>

        {mentee.goals && mentee.goals.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Goals</Text>
            <View style={styles.tagsContainer}>
              {mentee.goals.map((goal, index) => (
                <Text key={index} style={styles.tag}>
                  {goal}
                </Text>
              ))}
            </View>
          </>
        )}

        {mentee.skills && mentee.skills.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.tagsContainer}>
              {mentee.skills.map((skill, index) => (
                <Text key={index} style={styles.tag}>
                  {skill}
                </Text>
              ))}
            </View>
          </>
        )}

        {mentee.availability && mentee.availability.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Availability</Text>
            <View style={styles.tagsContainer}>
              {mentee.availability.map((avail, index) => (
                <Text key={index} style={styles.tag}>
                  {avail}
                </Text>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Social Media</Text>
        {mentee.linkedIn && (
          <Text style={styles.link}>LinkedIn: {mentee.linkedIn}</Text>
        )}
        {mentee.twitter && (
          <Text style={styles.link}>Twitter: {mentee.twitter}</Text>
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
  link: {
    fontSize: 14,
    color: '#007BFF', 
    marginBottom: 8,
  },
});

export default MenteeProfileViewScreen;