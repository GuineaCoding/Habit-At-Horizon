import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const DetailedSubmissionView = ({ route, navigation }) => {
    const { submissionId, userId, boardId } = route.params;
    const [submissionDetails, setSubmissionDetails] = useState(null);
    const [feedback, setFeedback] = useState([]);
    const [passStatus, setPassStatus] = useState('pass'); 
    const [genericTestFeedback, setGenericTestFeedback] = useState('');
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
                    const data = { id: doc.id, ...doc.data() };
                    setSubmissionDetails(data);
                    setFeedback(data.responses.map(r => r.feedback || ""));
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

    const handleFeedbackChange = (text, index) => {
        const newFeedback = [...feedback];
        newFeedback[index] = text;
        setFeedback(newFeedback);
    };

    const submitFeedback = async () => {
        try {
            const updatedResponses = submissionDetails.responses.map((response, index) => ({
                ...response,
                feedback: feedback[index]
            }));

            await firestore()
                .collection('boards')
                .doc(boardId)
                .collection('testResponses')
                .doc(submissionId)
                .update({
                    responses: updatedResponses,
                    isTestCheckedByMentor: true,
                    passStatus,
                    genericTestFeedback
                });

            Alert.alert("Feedback Submitted", "Feedback has been successfully saved.", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error("Error submitting feedback: ", error);
            Alert.alert("Error", "Failed to submit feedback.");
        }
    };

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
            {submissionDetails.responses.map((response, index) => (
                <View key={index} style={styles.responseContainer}>
                    <Text style={styles.responseTitle}>{response.questionTitle}</Text>
                    <Text style={styles.responseText}>Response: {response.response}</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => handleFeedbackChange(text, index)}
                        value={feedback[index]}
                        placeholder="Enter feedback here"
                        multiline
                    />
                </View>
            ))}
            <TextInput
                style={styles.input}
                onChangeText={setGenericTestFeedback}
                value={genericTestFeedback}
                placeholder="Enter generic test feedback here"
                multiline
            />
            <Picker
                selectedValue={passStatus}
                onValueChange={itemValue => setPassStatus(itemValue)}
                style={{ height: 50, width: 150 }}>
                <Picker.Item label="Pass" value="pass" />
                <Picker.Item label="Fail" value="fail" />
            </Picker>
            <Button title="Submit Feedback" onPress={submitFeedback} color="#007bff" />
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
    input: {
        minHeight: 60,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff'
    },
});

export default DetailedSubmissionView;
