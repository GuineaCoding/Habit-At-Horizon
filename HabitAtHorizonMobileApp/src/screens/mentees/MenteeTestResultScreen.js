import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomAppBar from '../../components/CustomAppBar';

const MenteeTestResultScreen = ({ route }) => {
    const { submission } = route.params;

    return (
        <View style={styles.container}>
            <CustomAppBar title="Test Results" showBackButton={true} />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Generic Test Feedback</Text>
                <Text style={styles.feedback}>{submission.genericTestFeedback}</Text>
                {submission.responses.map((response, index) => (
                    <View key={index} style={styles.responseContainer}>
                        <Text style={styles.questionTitle}>{response.questionTitle}</Text>
                        <Text style={styles.feedback}>{response.feedback}</Text>
                    </View>
                ))}
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
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFBA00', 
        marginBottom: 16,
    },
    feedback: {
        fontSize: 16,
        color: '#FFFFFF', 
        marginBottom: 16,
        lineHeight: 24,
    },
    responseContainer: {
        marginTop: 15,
        padding: 15,
        backgroundColor: '#6D9773', 
        borderRadius: 10,
    },
    questionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF', 
        marginBottom: 8,
    },
});

export default MenteeTestResultScreen;