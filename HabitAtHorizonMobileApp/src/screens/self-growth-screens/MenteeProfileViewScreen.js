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

        {mentee.menteeData?.goals && mentee.menteeData.goals.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Goals</Text>
            <View style={styles.tagsContainer}>
              {mentee.menteeData.goals.map((goal, index) => (
                <Text key={index} style={styles.tag}>
                  {goal}
                </Text>
              ))}
            </View>
          </>
        )}

        {mentee.menteeData?.skills && mentee.menteeData.skills.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.tagsContainer}>
              {mentee.menteeData.skills.map((skill, index) => (
                <Text key={index} style={styles.tag}>
                  {skill}
                </Text>
              ))}
            </View>
          </>
        )}

        {mentee.menteeData?.availability && mentee.menteeData.availability.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Availability</Text>
            <View style={styles.tagsContainer}>
              {mentee.menteeData.availability.map((avail, index) => (
                <Text key={index} style={styles.tag}>
                  {avail}
                </Text>
              ))}
            </View>
          </>
        )}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mentee.points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mentee.xp}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mentee.pointsEarnedToday}</Text>
            <Text style={styles.statLabel}>Points Today</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mentee.streak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mentee.longestStreak}</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </View>
        </View>

        <View style={styles.datesContainer}>
          <Text style={styles.sectionTitle}>Last Activity</Text>
          <Text style={styles.dateText}>
            Last Goal Completion: {mentee.lastGoalCompletionDate}
          </Text>
          <Text style={styles.dateText}>
            Last Points Earned: {mentee.lastPointsEarnedDate}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Social Media</Text>
        {mentee.menteeData?.linkedIn && (
          <Text style={styles.link}>LinkedIn: {mentee.menteeData.linkedIn}</Text>
        )}
        {mentee.menteeData?.twitter && (
          <Text style={styles.link}>Twitter: {mentee.menteeData.twitter}</Text>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#6D9773',
  },
  datesContainer: {
    width: '100%',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
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