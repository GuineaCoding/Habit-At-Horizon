import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, Button, StyleSheet, Picker, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { FirebaseAuth } from '@react-native-firebase/auth';

const TestViewScreen = ({ route }) => {
    const { boardId, testId } = route.params;
    const [testDetails, setTestDetails] = useState(null);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('boards')
            .doc(boardId)
            .collection('tests')
            .doc(testId)
            .onSnapshot(doc => {
                if (doc.exists) {
                    setTestDetails(doc.data());
                    initializeAnswers(doc.data().questions);
                }
            });

        return () => unsubscribe();
    }, [boardId, testId]);

    const initializeAnswers = (questions) => {
        const initialAnswers = {};
        questions.forEach((question, index) => {
            if (question.type === 'mcq' || question.type === 'tf') {
                initialAnswers[index] = question.options[0].text; // Default to first option
            } else {
                initialAnswers[index] = '';
            }
        });
        setAnswers(initialAnswers);
    };

    const handleAnswerChange = (text, index) => {
        setAnswers(prev => ({ ...prev, [index]: text }));
    };

    const handleSubmit = async () => {
        const userEmail = FirebaseAuth().currentUser?.email;
        if (!userEmail) {
            Alert.alert('Error', 'No user logged in');
            return;
        }

        try {
            await firestore()
                .collection('boards')
                .doc(boardId)
                .collection('tests')
                .doc(testId)
                .collection('submissions')
                .add({
                    userEmail,
                    answers,
                    submittedAt: firestore.Timestamp.fromDate(new Date())
                });
            Alert.alert('Success', 'Test submitted successfully');
        } catch (error) {
            console.error("Error submitting test: ", error);
            Alert.alert('Error', 'Failed to submit test');
        }
    };

    if (!testDetails) {
        return <View style={styles.container}><Text>Loading test details...</Text></View>;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>{testDetails.name}</Text>
            {testDetails.questions.map((question, index) => (
                <View key={index} style={styles.question}>
                    <Text style={styles.questionText}>{question.questionText}</Text>
                    {question.type === 'tf' || question.type === 'mcq' ? (
                        <Picker
                            selectedValue={answers[index]}
                            onValueChange={(itemValue) => handleAnswerChange(itemValue, index)}
                        >
                            {question.options.map((option, idx) => (
                                <Picker.Item key={idx} label={option.text} value={option.text} />
                            ))}
                        </Picker>
                    ) : (
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => handleAnswerChange(text, index)}
                            value={answers[index]}
                            placeholder="Your answer"
                            multiline
                        />
                    )}
                </View>
            ))}
            <Button title="Submit Test" onPress={handleSubmit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    question: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    questionText: {
        fontSize: 18,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginTop: 5,
    }
});

export default TestViewScreen;
