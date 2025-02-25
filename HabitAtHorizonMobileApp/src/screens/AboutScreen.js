import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const AboutScreen = () => {
  return (
    <LinearGradient
      colors={['#0C3B2E', '#6D9773']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.header}>About Habit-at-Horizon</Text>
            <Text style={styles.text}>
              Habit-at-Horizon is designed to help you maintain your daily habits and achieve your long-term goals
              with ease and efficiency. Join us on a journey to transform your aspirations into reality.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.subHeader}>Our Mission</Text>
            <Text style={styles.text}>
              Our mission is to empower individuals to build and sustain positive habits that lead to a healthier,
              happier, and more productive life. We believe small, consistent actions can create significant change.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.subHeader}>Features</Text>
            <View style={styles.featureItem}>
              <IconButton icon="check-circle" color="#FFBA00" size={24} />
              <Text style={styles.featureText}>Track daily habits effortlessly.</Text>
            </View>
            <View style={styles.featureItem}>
              <IconButton icon="chart-line" color="#FFBA00" size={24} />
              <Text style={styles.featureText}>Visualize your progress with charts.</Text>
            </View>
            <View style={styles.featureItem}>
              <IconButton icon="bell" color="#FFBA00" size={24} />
              <Text style={styles.featureText}>Set reminders to stay on track.</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.subHeader}>Why Choose Us?</Text>
            <Text style={styles.text}>
              With a user-friendly interface, personalized insights, and a supportive community, Habit-at-Horizon
              is your ultimate companion for habit-building success.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    fontSize: 24,
    color: '#0C3B2E',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    color: '#0C3B2E',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
});

export default AboutScreen;