import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const MenteeTestResultScreen = ({ route }) => {
    const { submission } = route.params;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Generic Test Feedback</Text>
            <Text style={styles.feedback}>{submission.genericTestFeedback}</Text>
            {submission.responses.map((response, index) => (
                <View key={index} style={styles.responseContainer}>
                    <Text style={styles.questionTitle}>{response.questionTitle}</Text>
                    <Text style={styles.feedback}>{response.feedback}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    feedback: {
        fontSize: 16,
        marginVertical: 5,
    },
    responseContainer: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    questionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default MenteeTestResultScreen;
