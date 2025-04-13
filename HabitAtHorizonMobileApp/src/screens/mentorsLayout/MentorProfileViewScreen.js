import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity, Image } from 'react-native';
import CustomAppBar from '../../components/CustomAppBar';
import LinearGradient from 'react-native-linear-gradient';

import { mentorProfileViewScreenStyle as styles } from './styles';

const MentorProfileViewScreen = ({ route, navigation }) => {
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
          {mentor.profileImage ? (
            <Image
              source={{ uri: mentor.profileImage }}
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

export default MentorProfileViewScreen;