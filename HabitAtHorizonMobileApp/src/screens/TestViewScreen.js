import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext';  

const TestViewScreen = ({ route, navigation }) => {
    const { testId, boardId } = route.params;
    const [testData, setTestData] = useState(null);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth(); 

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const testDoc = await firestore().collection('boards').doc(boardId).collection('tests').doc(testId).get();
                if (testDoc.exists) {
                    const data = testDoc.data();
                    const questions = data.questions.map(question => ({
                        ...question,
                        options: question.options?.map(option => ({
                            ...option,
                            checked: false 
                        }))
                    }));
                    setTestData({ ...data, questions });
                } else {
                    setError('No test data found');
                }
            } catch (err) {
                setError('Error fetching test data: ' + err.message);
            }
        };

        fetchTest();
    }, [testId, boardId]);

    const toggleCheckbox = (qIndex, optionIndex) => {
        setTestData(prevData => {
            const questions = [...prevData.questions];
            const question = questions[qIndex];
            question.options[optionIndex].checked = !question.options[optionIndex].checked;

            if (question.questionType === 'tf') {
                question.options.forEach((opt, idx) => {
                    if (idx !== optionIndex) opt.checked = false;
                });
            }
            return { ...prevData, questions };
        });
    };

    const handleSubmit = async () => {
        console.log("Handle submit started. Current user:", currentUser);
    
        if (currentUser && currentUser.email) {
            const responses = testData.questions.map(question => {
               
                let response = question.options 
                    ? question.options.filter(option => option.checked).map(option => option.optionText)
                    : question.userResponse; 
                
                return {
                    userEmail: currentUser.email,
                    questionTitle: question.questionTitle,
                    response: response,
                };
            });
    
            console.log("Prepared responses for submission:", responses);
    
            try {
                console.log(`Attempting to store responses in Firestore at /boards/${boardId}/testResponses`);
                const result = await firestore()
                    .collection('boards')
                    .doc(boardId)
                    .collection('testResponses')
                    .add({
                        testId: testId,
                        responses: responses,
                        submittedAt: firestore.FieldValue.serverTimestamp(),
                    });
                console.log("Firestore write successful, document ID:", result.id);
                Alert.alert('Success', 'Your answers have been submitted successfully!');
                navigation.goBack();
            } catch (error) {
                console.error('Error submitting answers to Firestore:', error);
                Alert.alert('Error', 'Failed to submit your answers. ' + error.message);
            }
        } else {
            console.log("Error: Current user email is not available.");
            Alert.alert('Error', 'User email is not available.');
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
            {testData.questions?.map((question, index) => (
                <View key={index} style={styles.questionContainer}>
                    <Text style={styles.questionText}>{question.questionTitle}</Text>
                    {question.questionDetail && <Text>{question.questionDetail}</Text>}
                    {question.questionType === 'mcq' && question.options.map((option, optIndex) => (
                        <CheckBox
                            key={optIndex}
                            title={option.optionText}
                            checked={option.checked}
                            onPress={() => toggleCheckbox(index, optIndex)}
                        />
                    ))}
                    {question.questionType === 'tf' && question.options.map((option, optIndex) => (
                        <CheckBox
                            key={optIndex}
                            title={option.optionText}
                            checked={option.checked}
                            onPress={() => toggleCheckbox(index, optIndex)}
                        />
                    ))}
                    {question.questionType === 'text' && (
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => {
                                setTestData(prevData => {
                                    const questions = [...prevData.questions];
                                    questions[index].userResponse = text;
                                    return { ...prevData, questions };
                                });
                            }}
                            value={question.userResponse || ''}
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
                                onChangeText={(text) => {
                                    setTestData(prevData => {
                                        const questions = [...prevData.questions];
                                        questions[index].userResponse = text;
                                        return { ...prevData, questions };
                                    });
                                }}
                                value={question.userResponse || ''}
                                placeholder="Your detailed response"
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
        textAlignVertical: 'top' 
    }
});


export default TestViewScreen;
