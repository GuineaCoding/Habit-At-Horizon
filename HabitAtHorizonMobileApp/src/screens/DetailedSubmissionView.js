import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const DetailedSubmissionView = ({ route }) => {
    const { submissionId, userId, boardId } = route.params;
    const [submissionDetails, setSubmissionDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissionDetails = async () => {
            try {
                const doc = await firestore()
                    .collection('boards')
                    .doc(boardId)
                    .collection('testResponses')
                    .doc(submissionId)
                    .get();

                if (doc.exists) {
                    setSubmissionDetails({ id: doc.id, ...doc.data() });
                } else {
                    setSubmissionDetails(null);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch submission details: ", error);
                setLoading(false);
            }
        };

        fetchSubmissionDetails();
    }, [submissionId, boardId]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!submissionDetails) {
        return (
            <View style={styles.container}>
                <Text>No details available.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Detailed Submission View</Text>
            <Text style={styles.label}>Test ID: {submissionDetails.testId}</Text>
            <Text style={styles.label}>Submitted by: {userId}</Text>
            <Text style={styles.label}>Submission ID: {submissionId}</Text>
            <Text style={styles.label}>Submitted on: {submissionDetails.submittedAt && new Date(submissionDetails.submittedAt.toDate()).toLocaleDateString()}</Text>
            {submissionDetails.responses && submissionDetails.responses.map((response, index) => (
                <View key={index} style={styles.responseContainer}>
                    <Text style={styles.responseTitle}>{response.questionTitle}</Text>
                    <Text style={styles.responseText}>Response: {response.response.join(", ")}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    responseContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    responseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    responseText: {
        fontSize: 15,
        color: '#333',
    },
});

export default DetailedSubmissionView;
