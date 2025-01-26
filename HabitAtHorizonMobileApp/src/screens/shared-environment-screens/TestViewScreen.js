import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const TestViewScreen = ({ route, navigation }) => {
    const { testId, boardId } = route.params;
    const [testData, setTestData] = useState(null);
    const [responses, setResponses] = useState({});
    const [error, setError] = useState(null);
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

        fetchTest();
    }, [testId, boardId]);

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
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Test: {testData.testName}</Text>
            {testData.questions.map(question => (
                <View key={question.questionId} style={styles.questionContainer}>
                    <Text style={styles.questionText}>{question.questionTitle}</Text>
                    {question.questionDetail && <Text>{question.questionDetail}</Text>}
                    {question.options && question.options.map((option, index) => (
                        <CheckBox
                            key={index}
                            title={option.optionText}
                            checked={responses[question.questionId].includes(option.optionText)}
                            onPress={() => handleOptionChange(question.questionId, option.optionText, question.questionType === 'tf')}
                            containerStyle={question.questionType === 'tf' ? { backgroundColor: 'transparent', borderWidth: 0 } : {}}
                        />
                    ))}
                    {question.questionType === 'text' && (
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => handleTextChange(question.questionId, text)}
                            value={responses[question.questionId]}
                            placeholder="Your answer"
                            multiline
                        />
                    )}
                    {question.questionType === 'video' && (
                        <>
                            <WebView
                                source={{ uri: question.videoEmbedLink }}
                                style={{ height: 300 }}
                            />
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => handleTextChange(question.questionId, text)}
                                value={responses[question.questionId]}
                                placeholder="Enter your response to the video"
                                multiline
                            />
                        </>
                    )}
                </View>
            ))}
            <Button title="Submit Test" onPress={handleSubmit} color="#007bff" />
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    questionContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    questionText: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    input: {
        minHeight: 80,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 5,
        textAlignVertical: 'top',
    }
});

export default TestViewScreen;
