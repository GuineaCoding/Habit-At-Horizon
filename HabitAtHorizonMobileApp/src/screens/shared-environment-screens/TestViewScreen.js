import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import CustomAppBar from '../../components/CustomAppBar';

const TestViewScreen = ({ route, navigation }) => {
    const { testId, boardId } = route.params;
    const [testData, setTestData] = useState(null);
    const [responses, setResponses] = useState({});
    const [error, setError] = useState(null);
    const [hasSubmitted, setHasSubmitted] = useState(false); 
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const testDoc = await firestore().collection('boards').doc(boardId).collection('tests').doc(testId).get();
                if (testDoc.exists) {
                    const data = testDoc.data();
                    setTestData(data);
                    const initialResponses = data.questions.reduce((acc, question) => {
                        acc[question.questionId] = question.options ? [] : '';
                        return acc;
                    }, {});
                    setResponses(initialResponses);
                } else {
                    setError('No test data found');
                }
            } catch (err) {
                setError('Error fetching test data: ' + err.message);
            }
        };

        const checkIfSubmitted = async () => {
            if (currentUser && currentUser.uid) {
                const submissionRef = firestore()
                    .collection('boards')
                    .doc(boardId)
                    .collection('members')
                    .doc(currentUser.uid)
                    .collection('submissions')
                    .where('testId', '==', testId);

                const snapshot = await submissionRef.get();
                if (!snapshot.empty) {
                    setHasSubmitted(true);
                }
            }
        };

        fetchTest();
        checkIfSubmitted();
    }, [testId, boardId, currentUser]);

    const handleOptionChange = (questionId, optionText, isTrueFalse = false) => {
        setResponses(prev => {
            const newResponses = { ...prev };
            if (isTrueFalse) {
                newResponses[questionId] = [optionText];
            } else {
                const currentSelection = newResponses[questionId];
                const index = currentSelection.indexOf(optionText);
                if (index > -1) {
                    currentSelection.splice(index, 1);
                } else {
                    currentSelection.push(optionText);
                }
                newResponses[questionId] = currentSelection;
            }
            return newResponses;
        });
    };

    const handleTextChange = (questionId, text) => {
        setResponses(prev => ({ ...prev, [questionId]: text }));
    };

    const handleSubmit = async () => {
        if (hasSubmitted) {
            Alert.alert('Already Submitted', 'You have already submitted this test.');
            return;
        }

        if (currentUser && currentUser.uid) {
            const allAnswered = testData.questions.every(question =>
                question.options ? responses[question.questionId].length > 0 : responses[question.questionId].trim() !== ''
            );

            if (!allAnswered) {
                Alert.alert('Incomplete', 'Please answer all questions before submitting.');
                return;
            }

            const submission = {
                testName: testData.testName,
                testId: testId,
                userId: currentUser.uid,
                userEmail: currentUser.email,
                isTestCheckedByMentor: false,
                passStatus: "not graded",
                responses: Object.keys(responses).map(questionId => ({
                    questionTitle: testData.questions.find(q => q.questionId.toString() === questionId).questionTitle,
                    response: responses[questionId],
                })),
                submittedAt: firestore.FieldValue.serverTimestamp(),
            };

            try {
                await firestore()
                    .collection('boards')
                    .doc(boardId)
                    .collection('members')
                    .doc(currentUser.uid)
                    .collection('submissions')
                    .add(submission);

                setHasSubmitted(true); 
                Alert.alert('Success', 'Your answers have been submitted successfully!');
                navigation.goBack();
            } catch (error) {
                console.error("Error submitting test response:", error);
                Alert.alert('Error', 'Failed to submit your answers. ' + error.message);
            }
        } else {
            Alert.alert('Error', 'User is not authenticated.');
        }
    };

    if (error) {
        return <View style={styles.container}><Text>Error: {error}</Text></View>;
    }

    if (!testData) {
        return <View style={styles.container}><Text>Loading test data...</Text></View>;
    }

    return (
        <View style={styles.container}>
            <CustomAppBar
                title={testData.testName}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {testData.questions.map(question => (
                    <View key={question.questionId} style={styles.questionContainer}>
                        <Text style={styles.questionText}>{question.questionTitle}</Text>
                        {question.questionDetail && <Text style={styles.questionDetail}>{question.questionDetail}</Text>}
                        {question.options && question.options.map((option, index) => (
                            <CheckBox
                                key={index}
                                title={option.optionText}
                                checked={responses[question.questionId].includes(option.optionText)}
                                onPress={() => handleOptionChange(question.questionId, option.optionText, question.questionType === 'tf')}
                                containerStyle={question.questionType === 'tf' ? { backgroundColor: 'transparent', borderWidth: 0 } : {}}
                                textStyle={styles.checkboxText}
                                checkedColor="#FFBA00"
                            />
                        ))}
                        {question.questionType === 'text' && (
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => handleTextChange(question.questionId, text)}
                                value={responses[question.questionId]}
                                placeholder="Your answer"
                                multiline
                                placeholderTextColor="#888"
                                editable={!hasSubmitted} 
                            />
                        )}
                        {question.questionType === 'video' && (
                            <>
                                <WebView
                                    source={{ uri: question.videoEmbedLink }}
                                    style={{ height: 300, marginVertical: 10 }}
                                />
                                <TextInput
                                    style={styles.input}
                                    onChangeText={(text) => handleTextChange(question.questionId, text)}
                                    value={responses[question.questionId]}
                                    placeholder="Enter your response to the video"
                                    multiline
                                    placeholderTextColor="#888"
                                    editable={!hasSubmitted} 
                                />
                            </>
                        )}
                    </View>
                ))}
                <TouchableOpacity
                    style={[styles.submitButton, hasSubmitted && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={hasSubmitted} 
                >
                    <Text style={styles.submitButtonText}>
                        {hasSubmitted ? 'Already Submitted' : 'Submit Test'}
                    </Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#FFBA00',
    },
    questionContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#0C3B2E',
    },
    questionDetail: {
        fontSize: 16,
        marginBottom: 10,
        color: '#6D9773',
    },
    checkboxText: {
        fontSize: 16,
        color: '#0C3B2E',
    },
    input: {
        minHeight: 80,
        borderWidth: 1,
        borderColor: '#6D9773',
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 5,
        textAlignVertical: 'top',
        color: '#0C3B2E',
        backgroundColor: '#FFFFFF',
    },
    submitButton: {
        backgroundColor: '#FFBA00',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: '#ccc', 
    },
    submitButtonText: {
        color: '#0C3B2E',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TestViewScreen;