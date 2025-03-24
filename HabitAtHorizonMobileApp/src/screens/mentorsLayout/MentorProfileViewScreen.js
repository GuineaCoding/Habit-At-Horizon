import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import CustomAppBar from '../../components/CustomAppBar';
import LinearGradient from 'react-native-linear-gradient';

const MentorProfileViewScreen = ({ route, navigation }) => {
  // Get the mentor data from navigation params
  const { mentor } = route.params;

  if (!mentor) {
    return (
      <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
        <CustomAppBar title="Mentor Profile" showBackButton={true} />
        <Text style={styles.noProfileText}>No mentor data available.</Text>
      </LinearGradient>
    );
  }

  const firstLetter = mentor.username ? mentor.username.charAt(0).toUpperCase() : 'M';

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Mentor Profile" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={['#0C3B2E', '#6D9773']}
            style={styles.profileCircle}
          >
            <Text style={styles.profileLetter}>{firstLetter}</Text>
          </LinearGradient>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>{mentor.name}</Text>
            <Text style={styles.username}>@{mentor.username}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bio}>{mentor.bio}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Expertise</Text>
          <Text style={styles.expertise}>{mentor.expertise}</Text>
        </View>

        {mentor.tags && mentor.tags.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {mentor.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
          </View>
        )}

        {mentor.availability && mentor.availability.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <View style={styles.tagsContainer}>
              {mentor.availability.map((avail, index) => (
                <Text key={index} style={styles.tag}>
                  {avail}
                </Text>
              ))}
            </View>
          </View>
        )}

        {mentor.languages && mentor.languages.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.tagsContainer}>
              {mentor.languages.map((lang, index) => (
                <Text key={index} style={styles.tag}>
                  {lang}
                </Text>
              ))}
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Experience Level</Text>
          <Text style={styles.experienceLevel}>{mentor.experienceLevel}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Social Media</Text>
          {mentor.linkedIn && (
            <TouchableOpacity onPress={() => Linking.openURL(mentor.linkedIn)}>
              <Text style={styles.link}>LinkedIn: {mentor.linkedIn}</Text>
            </TouchableOpacity>
          )}
          {mentor.twitter && (
            <TouchableOpacity onPress={() => Linking.openURL(`https://twitter.com/${mentor.twitter}`)}>
              <Text style={styles.link}>Twitter: @{mentor.twitter}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 3,
    borderColor: '#FFBA00',
  },
  profileLetter: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  username: {
    fontSize: 16,
    color: '#FFBA00',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFBA00',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  expertise: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    fontSize: 12,
    color: '#FFFFFF',
    backgroundColor: 'rgba(109, 151, 115, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  experienceLevel: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  link: {
    fontSize: 14,
    color: '#FFBA00',
    marginBottom: 8,
    textDecorationLine: 'underline',
  },
  noProfileText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MentorProfileViewScreen;