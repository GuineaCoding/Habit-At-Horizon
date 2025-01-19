import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const TestCreateScreen = ({ route, navigation }) => {
    const { boardId } = route.params;
    const [testName, setTestName] = useState('');
    const [questions, setQuestions] = useState([]);

    const addQuestion = (type) => {
        const newQuestion = {
            id: Date.now(),
            type,
            questionText: '',
            options: type === 'mcq' ? [{text: '', correct: false}] : [],
            answer: ''
        };
        setQuestions([...questions, newQuestion]);
    };

    const updateTestName = (text) => {
        setTestName(text);
    };

    const updateQuestionText = (index, text) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].questionText = text;
        setQuestions(updatedQuestions);
    };

    const updateOptionText = (index, optionIndex, text) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].options[optionIndex].text = text;
        setQuestions(updatedQuestions);
    };

    const addOption = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].options.push({text: '', correct: false});
        setQuestions(updatedQuestions);
    };

    const setOptionCorrect = (index, optionIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].options[optionIndex].correct = !updatedQuestions[index].options[optionIndex].correct;
        setQuestions(updatedQuestions);
    };

    const setAnswer = (index, answer) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].answer = answer;
        setQuestions(updatedQuestions);
    };

    const handleSubmitTest = async () => {
        if (!testName.trim()) {
            Alert.alert('Error', 'Please enter a test name.');
            return;
        }
        try {
            await firestore()
                .collection('boards')
                .doc(boardId)
                .collection('tests')
                .add({
                    name: testName,
                    questions
                });
            Alert.alert('Success', 'Test submitted successfully!');
            navigation.goBack();
        } catch (error) {
            console.error("Error submitting test: ", error);
            Alert.alert('Error', 'Failed to submit test!');
        }
    };

    const renderOptionInput = (option, index, questionIndex) => (
        <View key={index} style={styles.optionContainer}>
            <TextInput
                style={styles.optionInput}
                placeholder="Option"
                value={option.text}
                onChangeText={(text) => updateOptionText(questionIndex, index, text)}
            />
            <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={option.correct ? '#f5dd4b' : '#f4f3f4'}
                onValueChange={() => setOptionCorrect(questionIndex, index)}
                value={option.correct}
            />
        </View>
    );

    const renderQuestionInput = (question, index) => {
        switch (question.type) {
            case 'mcq':
                return (
                    <View key={question.id} style={styles.questionContainer}>
                        <TextInput
                            style={styles.questionInput}
                            placeholder="Question Text"
                            value={question.questionText}
                            onChangeText={(text) => updateQuestionText(index, text)}
                        />
                        {question.options.map((option, optionIndex) => renderOptionInput(option, optionIndex, index))}
                        <Button title="Add Option" onPress={() => addOption(index)} />
                    </View>
                );
            case 'tf':
                return (
                    <View key={question.id} style={styles.questionContainer}>
                        <TextInput
                            style={styles.questionInput}
                            placeholder="Question Text"
                            value={question.questionText}
                            onChangeText={(text) => updateQuestionText(index, text)}
                        />
                        <View style={styles.buttonRow}>
                            <Button title="True" color="green" onPress={() => setAnswer(index, 'True')} />
                            <Button title="False" color="red" onPress={() => setAnswer(index, 'False')} />
                        </View>
                    </View>
                );
            case 'text':
            case 'video':
                return (
                    <View key={question.id} style={styles.questionContainer}>
                        <TextInput
                            style={styles.questionInput}
                            placeholder={question.type === 'video' ? "Embed Video Link" : "Question Text"}
                            value={question.questionText}
                            onChangeText={(text) => updateQuestionText(index, text)}
                        />
                        <TextInput
                            style={styles.multilineInput}
                            multiline
                            numberOfLines={4}
                            placeholder={question.type === 'video' ? "Analysis Text" : "Enter answer text"}
                            value={question.answer}
                            onChangeText={(text) => setAnswer(index, text)}
                        />
                    </View>
                );
            default:
                return <View />;
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Create a Test</Text>
            <TextInput
                style={styles.testNameInput}
                placeholder="Enter Test Name"
                value={testName}
                onChangeText={updateTestName}
            />
            <Button title="Add Multiple Choice Question" onPress={() => addQuestion('mcq')} />
            <Button title="Add True/False Question" onPress={() => addQuestion('tf')} />
            <Button title="Add Text Response Question" onPress={() => addQuestion('text')} />
            <Button title="Add Video Analysis Question" onPress={() => addQuestion('video')} />
            {questions.map((question, index) => renderQuestionInput(question, index))}
            <Button title="Submit Test" onPress={handleSubmitTest} />
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
        marginBottom: 20,
    },
    testNameInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
    },
    questionContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    questionInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    optionInput: {
        flex: 1,
        marginRight: 10,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
    },
    multilineInput: {
        minHeight: 80,
        borderColor: 'gray',
        borderWidth: 1,
        textAlignVertical: 'top',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    }
});

export default TestCreateScreen;
