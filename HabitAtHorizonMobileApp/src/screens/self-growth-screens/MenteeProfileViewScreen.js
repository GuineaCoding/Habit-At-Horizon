import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomAppBar from '../../components/CustomAppBar';

import { MenteeProfileViewScreenStyle as styles } from './styles';

const MenteeProfileViewScreen = ({ route }) => {
  const { mentee } = route.params;

  const renderStreakMessage = (streak) => {
    return streak > 0 ? `${streak} days` : 'No active streak';
  };

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Mentee Profile" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.content}>

        {mentee.profileImage && (
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: mentee.profileImage }} style={styles.profileImage} />
          </View>
        )}

        <Text style={styles.name}>{mentee.name}</Text>
        <Text style={styles.username}>@{mentee.username}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bio}>{mentee.bio}</Text>
        </View>

        {mentee.menteeData?.goals && mentee.menteeData.goals.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Goals</Text>
            <View style={styles.tagsContainer}>
              {mentee.menteeData.goals.map((goal, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{goal}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {mentee.menteeData?.skills && mentee.menteeData.skills.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.tagsContainer}>
              {mentee.menteeData.skills.map((skill, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {mentee.menteeData?.availability && mentee.menteeData.availability.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <View style={styles.tagsContainer}>
              {mentee.menteeData.availability.map((avail, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{avail}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon name="star" size={24} color="#FFBA00" />
              <Text style={styles.statValue}>{mentee.points}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="chart-line" size={24} color="#FFBA00" />
              <Text style={styles.statValue}>{mentee.xp}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="calendar-today" size={24} color="#FFBA00" />
              <Text style={styles.statValue}>
                {mentee.pointsEarnedToday > 0 ? mentee.pointsEarnedToday : 'No points'}
              </Text>
              <Text style={styles.statLabel}>Last Progress</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon name="fire" size={24} color="#FFBA00" />
              <Text style={styles.statValue}>{renderStreakMessage(mentee.streak)}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="fire" size={24} color="#FFBA00" />
              <Text style={styles.statValue}>{renderStreakMessage(mentee.longestStreak)}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Last Activity</Text>
          <Text style={styles.dateText}>
            Last Goal Completion: {mentee.lastGoalCompletionDate || 'No activity'}
          </Text>
          <Text style={styles.dateText}>
            Last Points Earned: {mentee.lastPointsEarnedDate || 'No activity'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Social Media</Text>
          {mentee.menteeData?.linkedIn && (
            <TouchableOpacity style={styles.linkContainer}>
              <Icon name="linkedin" size={20} color="#0077B5" />
              <Text style={styles.link}>{mentee.menteeData.linkedIn}</Text>
            </TouchableOpacity>
          )}
          {mentee.menteeData?.twitter && (
            <TouchableOpacity style={styles.linkContainer}>
              <Icon name="twitter" size={20} color="#1DA1F2" />
              <Text style={styles.link}>{mentee.menteeData.twitter}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default MenteeProfileViewScreen;