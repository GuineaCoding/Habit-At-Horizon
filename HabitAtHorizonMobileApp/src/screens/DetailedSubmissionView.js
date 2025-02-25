import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import CustomAppBar from '../components/CustomAppBar'; 

const DetailedSubmissionView = ({ route, navigation }) => {
    const { submissionId, userId, boardId } = route.params;
    const [submissionDetails, setSubmissionDetails] = useState(null);
    const [feedback, setFeedback] = useState([]);
    const [passStatus, setPassStatus] = useState('pass');
    const [genericTestFeedback, setGenericTestFeedback] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissionDetails = async () => {
            setLoading(true);
            try {
                console.log(`Fetching details for Board ID: ${boardId}, User ID: ${userId}, Submission ID: ${submissionId}`);
                const doc = await firestore()
                    .collection('boards')
                    .doc(boardId)
                    .collection('members')
                    .doc(userId)
                    .collection('submissions')
                    .doc(submissionId)
                    .get();

                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    const data = { id: doc.id, ...doc.data() };
                    setSubmissionDetails(data);
                    setFeedback((data.responses || []).map(r => r.feedback || ""));
                } else {
                    console.log("No such document found!");
                    setSubmissionDetails(null);
                }
            } catch (error) {
                console.error("Failed to fetch submission details: ", error);
            }
            setLoading(false);
        };

        fetchSubmissionDetails();
    }, [submissionId, userId, boardId]);

    const handleFeedbackChange = (text, index) => {
        const newFeedback = [...feedback];
        newFeedback[index] = text;
        setFeedback(newFeedback);
    };

    const submitFeedback = async () => {
        console.log("Submitting feedback...");
        setLoading(true);
        try {
            await firestore()
                .collection('boards')
                .doc(boardId)
                .collection('members')
                .doc(userId)
                .collection('submissions')
                .doc(submissionId)
                .update({
                    responses: submissionDetails.responses.map((response, index) => ({
                        ...response,
                        feedback: feedback[index]
                    })),
                    genericTestFeedback: genericTestFeedback,
                    passStatus: passStatus,
                    isTestCheckedByMentor: true
                });
            Alert.alert("Feedback Submitted", "Your feedback has been successfully submitted.");
            navigation.goBack();
        } catch (error) {
            console.error("Failed to submit feedback:", error);
            Alert.alert("Error", "Failed to submit feedback.");
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#FFBA00" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (!submissionDetails) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No details available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CustomAppBar
                title="Submission Details"
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {submissionDetails.responses && submissionDetails.responses.map((response, index) => (
                    <View key={index} style={styles.responseContainer}>
                        <Text style={styles.responseTitle}>{response.questionTitle}</Text>
                        <Text style={styles.responseText}>
                            Response: {Array.isArray(response.response) ? response.response.join(", ") : response.response}
                        </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => handleFeedbackChange(text, index)}
                            value={feedback[index]}
                            placeholder="Enter feedback here"
                            placeholderTextColor="#888"
                            multiline
                        />
                    </View>
                ))}
                <TextInput
                    style={styles.input}
                    onChangeText={setGenericTestFeedback}
                    value={genericTestFeedback}
                    placeholder="Enter generic test feedback here"
                    placeholderTextColor="#888"
                    multiline
                />
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={passStatus}
                        onValueChange={itemValue => setPassStatus(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Pass" value="pass" />
                        <Picker.Item label="Fail" value="fail" />
                    </Picker>
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={submitFeedback}>
                    <Text style={styles.submitButtonText}>Submit Feedback</Text>
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
    scrollContainer: {
        padding: 20,
    },
    loadingText: {
        color: '#FFBA00',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    errorText: {
        color: '#FFBA00',
        fontSize: 16,
        textAlign: 'center',
    },
    responseContainer: {
        marginTop: 10,
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
    },
    responseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0C3B2E',
    },
    responseText: {
        fontSize: 14,
        color: '#0C3B2E',
        marginTop: 5,
    },
    input: {
        minHeight: 80,
        borderWidth: 1,
        borderColor: '#6D9773',
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        color: '#0C3B2E',
        textAlignVertical: 'top',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#6D9773',
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#0C3B2E',
    },
    submitButton: {
        backgroundColor: '#FFBA00',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#0C3B2E',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default DetailedSubmissionView;