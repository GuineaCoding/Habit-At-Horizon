import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const AboutScreen = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      {/* Back Button Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>About</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="information" 
                size={30} 
                color="#FFBA00" 
              />
            </View>
            <Text style={styles.header}>About Habit-at-Horizon</Text>
            <Text style={styles.text}>
              Habit-at-Horizon helps you maintain daily habits and achieve long-term goals.
            </Text>
          </Card.Content>
        </Card>

        {/* Rest of your cards remain the same */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="target" 
                size={30} 
                color="#FFBA00" 
              />
            </View>
            <Text style={styles.subHeader}>Our Mission</Text>
            <Text style={styles.text}>
              We empower individuals to build positive habits for a healthier life.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.subHeader}>Features</Text>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons 
                name="check-circle" 
                size={24} 
                color="#FFBA00" 
              />
              <Text style={styles.featureText}>
                Track daily habits effortlessly
              </Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons 
                name="chart-line" 
                size={24} 
                color="#FFBA00" 
              />
              <Text style={styles.featureText}>
                Visualize progress with charts
              </Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons 
                name="bell" 
                size={24} 
                color="#FFBA00" 
              />
              <Text style={styles.featureText}>
                Customizable reminders
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="star" 
                size={30} 
                color="#FFBA00" 
              />
            </View>
            <Text style={styles.subHeader}>Why Choose Us?</Text>
            <Text style={styles.text}>
              User-friendly interface with personalized insights.
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 12, 
    backgroundColor: '#0C3B2E',
  },
  backButton: {
    marginRight: 15,
  },
  screenTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 10, 
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 20,
    elevation: 3,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    color: '#FFBA00',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    color: '#0C3B2E',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 10,
    flex: 1,
  },
});

export default AboutScreen;