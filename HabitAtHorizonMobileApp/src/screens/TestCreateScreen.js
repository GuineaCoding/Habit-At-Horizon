import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const TestCreateScreen = ({ route, navigation }) => {
    const { boardId } = route.params;
    const [testName, setTestName] = useState('');
    const [questions, setQuestions] = useState([]);

    const addQuestion = (type) => {
        let newQuestion = {
            id: Date.now(),
            type,
            questionText: '',
            detail: '',
            options: type === 'mcq' ? [{ text: '', correct: false }] : type === 'tf' ? [{ text: 'True', correct: false }, { text: 'False', correct: false }] : [],
            embedLink: type === 'video' ? '' : null  
        };

        setQuestions([...questions, newQuestion]);
    };

    const addOption = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].options.push({ text: '', correct: false });
        setQuestions(updatedQuestions);
    };

    const updateTestName = (text) => {
        setTestName(text);
    };

    const updateQuestionText = (index, text) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].questionText = text;
        setQuestions(updatedQuestions);
    };

    const updateDetail = (index, text) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].detail = text;
        setQuestions(updatedQuestions);
    };

    const updateEmbedLink = (index, text) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].embedLink = text;
        setQuestions(updatedQuestions);
    };

    const updateOptionText = (index, optionIndex, text) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].options[optionIndex].text = text;
        setQuestions(updatedQuestions);
    };

    const setOptionCorrect = (index, optionIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].options[optionIndex].correct = !updatedQuestions[index].options[optionIndex].correct;
        setQuestions(updatedQuestions);
    };

    const handleSubmitTest = async () => {
        if (!testName.trim()) {
            Alert.alert('Error', 'Please enter a test name.');
            return;
        }

        const filteredQuestions = questions.map(question => ({
            ...question,
            embedLink: question.embedLink || null
        }));

        try {
            await firestore()
                .collection('boards')
                .doc(boardId)
                .collection('tests')
                .add({
                    name: testName,
                    questions: filteredQuestions
                });
            Alert.alert('Success', 'Test submitted successfully!');
            navigation.goBack();
        } catch (error) {
            console.error("Error submitting test: ", error);
            Alert.alert('Error', 'Failed to submit test!');
        }
    };

    const renderQuestionInput = (question, index) => {
        switch (question.type) {
            case 'mcq':
            case 'tf':
                return (
                    <View key={question.id} style={styles.questionContainer}>
                        <TextInput
                            style={styles.questionInput}
                            placeholder="Question Title"
                            value={question.questionText}
                            onChangeText={(text) => updateQuestionText(index, text)}
                        />
                        {question.options.map((option, optionIndex) => (
                            <View key={optionIndex} style={styles.optionContainer}>
                                <TextInput
                                    style={styles.optionInput}
                                    placeholder="Option"
                                    value={option.text}
                                    onChangeText={(text) => updateOptionText(index, optionIndex, text)}
                                />
                                <Switch
                                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                                    thumbColor={option.correct ? '#f5dd4b' : '#f4f3f4'}
                                    onValueChange={() => setOptionCorrect(index, optionIndex)}
                                    value={option.correct}
                                />
                            </View>
                        ))}
                        {question.type === 'mcq' && <Button title="Add Option" onPress={() => addOption(index)} />}
                    </View>
                );
            case 'text':
            case 'video':
                return (
                    <View key={question.id} style={styles.questionContainer}>
                        <TextInput
                            style={styles.questionInput}
                            placeholder={question.type === 'video' ? "Video Title" : "Question Title"}
                            value={question.questionText}
                            onChangeText={(text) => updateQuestionText(index, text)}
                        />
                        {question.type === 'video' && (
                            <TextInput
                                style={styles.questionInput}
                                placeholder="Embed Video Link"
                                value={question.embedLink || ''}
                                onChangeText={(text) => updateEmbedLink(index, text)}
                            />
                        )}
                        <TextInput
                            style={styles.multilineInput}
                            multiline
                            numberOfLines={4}
                            placeholder="Detailed Question"
                            value={question.detail}
                            onChangeText={(text) => updateDetail(index, text)}
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
    },
});

export default TestCreateScreen;
