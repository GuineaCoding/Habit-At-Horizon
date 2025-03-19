import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { menteeCheckedTestScreenStyles as styles } from './menteesScreenStyle';

const MenteeCheckedTestScreen = ({ route }) => {
    const { submissionId, boardId } = route.params;
    const [submission, setSubmission] = useState(null);

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const doc = await firestore()
                    .collection('boards')
                    .doc(boardId)
                    .collection('members')
                    .doc(submissionId)
                    .get();

                if (doc.exists() && doc.data().isTestCheckedByMentor) {
                    setSubmission(doc.data());
                } else {
                    Alert.alert("No Submission Found", "This test has not been checked by a mentor yet.");
                }
            } catch (error) {
                console.error("Failed to fetch submission: ", error);
                Alert.alert("Error", "Failed to load the submission details.");
            }
        };

        fetchSubmission();
    }, [boardId, submissionId]);

    if (!submission) {
        return (
            <View style={styles.container}>
                <Text>Loading submission details...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Test Details</Text>
            <Text style={styles.title}>{submission.testName}</Text>
            <Text style={styles.passStatus}>Pass Status: {submission.passStatus}</Text>
            {submission.responses.map((response, index) => (
                <View key={index} style={styles.responseContainer}>
                    <Text style={styles.questionTitle}>{response.questionTitle}</Text>
                    <Text style={styles.feedback}>Feedback: {response.feedback || "No feedback provided"}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

export default MenteeCheckedTestScreen;