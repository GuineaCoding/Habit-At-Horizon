import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomAppBar from '../../components/CustomAppBar';
import LinearGradient from 'react-native-linear-gradient';

const MenteeTestResultScreen = ({ route }) => {
    const { submission } = route.params;

    return (
        <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
            <CustomAppBar title="Test Results" showBackButton={true} />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Test Feedback</Text>
                <Text style={styles.feedback}>{submission.genericTestFeedback}</Text>
                {submission.responses.map((response, index) => (
                    <View key={index} style={styles.responseContainer}>
                        <Text style={styles.questionTitle}>{response.questionTitle}</Text>
                        <Text style={styles.feedback}>{response.feedback}</Text>
                    </View>
                ))}
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFBA00',
        marginBottom: 20,
        textAlign: 'center',
    },
    feedback: {
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 20,
        lineHeight: 24,
    },
    responseContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFBA00',
    },
    questionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFBA00',
        marginBottom: 10,
    },
});

export default MenteeTestResultScreen;