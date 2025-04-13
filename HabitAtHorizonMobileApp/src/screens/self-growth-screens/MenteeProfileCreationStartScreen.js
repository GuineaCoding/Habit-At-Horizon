import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomAppBar from '../../components/CustomAppBar';

import { menteeProfileCreationStartScreenStyle as styles } from './styles';

const MenteeProfileCreationStartScreen = ({ navigation }) => {
  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Become a Mentee" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Why Create a Mentee Profile?</Text>
        <Text style={styles.text}>
          Creating a mentee profile allows you to connect with experienced mentors who can guide you in achieving your goals. Whether you're looking to learn new skills, advance your career, or gain valuable insights, having a mentee profile makes it easier to find the right mentor for you.
        </Text>

        <Text style={styles.subHeading}>Benefits of Being a Mentee:</Text>
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Icon name="star" size={20} color="#FFBA00" style={styles.benefitIcon} />
            <Text style={styles.benefitText}>Get personalized guidance from experts.</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="lightbulb-on" size={20} color="#FFBA00" style={styles.benefitIcon} />
            <Text style={styles.benefitText}>Learn new skills and gain knowledge.</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="account-group" size={20} color="#FFBA00" style={styles.benefitIcon} />
            <Text style={styles.benefitText}>Build a network of professionals.</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="chart-line" size={20} color="#FFBA00" style={styles.benefitIcon} />
            <Text style={styles.benefitText}>Achieve your goals faster with support.</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="shield-check" size={20} color="#FFBA00" style={styles.benefitIcon} />
            <Text style={styles.benefitText}>Gain confidence and clarity in your journey.</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CreateMenteeProfile')}
        >
          <Text style={styles.buttonText}>Create Your Mentee Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default MenteeProfileCreationStartScreen;