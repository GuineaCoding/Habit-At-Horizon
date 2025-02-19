import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import CustomAppBar from '../../components/CustomAppBar';

const MenteeProfileCreationStartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>

      <CustomAppBar title="Become a Mentee" showBackButton={true} />


      <ScrollView contentContainerStyle={styles.content}>
 
        <Image
        //   source={require('../assets/mentee_intro.png')} 
          style={styles.image}
        />

        <Text style={styles.heading}>Why Create a Mentee Profile?</Text>
        <Text style={styles.text}>
          Creating a mentee profile allows you to connect with experienced mentors who can guide you in achieving your goals. Whether you're looking to learn new skills, advance your career, or gain valuable insights, having a mentee profile makes it easier to find the right mentor for you.
        </Text>

        <Text style={styles.subHeading}>Benefits of Being a Mentee:</Text>
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitText}>🌟 Get personalized guidance from experts.</Text>
          <Text style={styles.benefitText}>🌟 Learn new skills and gain knowledge.</Text>
          <Text style={styles.benefitText}>🌟 Build a network of professionals.</Text>
          <Text style={styles.benefitText}>🌟 Achieve your goals faster with support.</Text>
          <Text style={styles.benefitText}>🌟 Gain confidence and clarity in your journey.</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CreateMenteeProfile')} 
        >
          <Text style={styles.buttonText}>Create Your Mentee Profile</Text>
        </TouchableOpacity>
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
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFBA00', 
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B46617', 
    marginBottom: 10,
    textAlign: 'center',
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  benefitText: {
    fontSize: 16,
    color: '#FFFFFF', 
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6D9773', 
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 3, 
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', 
  },
});

export default MenteeProfileCreationStartScreen;