import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CustomAppBar from '../../components/CustomAppBar';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { mentorProfileCreationStartScreenStyle as styles } from './styles';

const MentorProfileCreationStartScreen = ({ navigation }) => {
    return (
        <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
            <CustomAppBar title="Create Mentor Profile" showBackButton={true} />
            <ScrollView contentContainerStyle={styles.content}>
                <Icon name="account-star" size={100} color="#FFBA00" style={styles.icon} />

                <Text style={styles.heading}>Why Become a Mentor?</Text>
                <Text style={styles.text}>
                    Becoming a mentor is a rewarding experience that allows you to share your knowledge, guide others, and make a meaningful impact. Whether you're an expert in your field or have valuable life experiences, your insights can help others grow and succeed.
                </Text>

                <Text style={styles.subHeading}>Benefits of Being a Mentor:</Text>
                <View style={styles.benefitsContainer}>
                    <Text style={styles.benefitText}>🌟 Share your expertise and knowledge.</Text>
                    <Text style={styles.benefitText}>🌟 Help others achieve their goals.</Text>
                    <Text style={styles.benefitText}>🌟 Build meaningful connections.</Text>
                    <Text style={styles.benefitText}>🌟 Enhance your leadership and communication skills.</Text>
                    <Text style={styles.benefitText}>🌟 Make a positive impact on someone's life.</Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('AddMentorScreen')}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

export default MentorProfileCreationStartScreen;