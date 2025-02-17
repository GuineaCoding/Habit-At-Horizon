import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import CustomAppBar from '../../components/CustomAppBar';

const MentorProfileCreationStartScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <CustomAppBar title="Create Mentor Profile" showBackButton={false} />
            <ScrollView contentContainerStyle={styles.content}>
                <Image
                    //   source={require('../assets/mentor_intro.png')} 
                    style={styles.image}
                />

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
        height: 50,
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

export default MentorProfileCreationStartScreen;