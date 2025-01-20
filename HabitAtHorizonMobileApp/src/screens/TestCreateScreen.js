import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const TestCreateScreen = ({ route, navigation }) => {
    const { boardId } = route.params;
    const [testName, setTestName] = useState('');
    const [questions, setQuestions] = useState([]);

    const addQuestion = (type) => {
        const baseQuestion = {
            questionId: Date.now(),
            questionType: type,
            questionTitle: '',
        };
        
        let specificQuestion = {};
        switch (type) {
            case 'mcq':
                specificQuestion = {
                    options: [{ optionText: '', isCorrect: false }],
                };
                break;
            case 'tf':
                specificQuestion = {
                    options: [
                        { optionText: 'True', isCorrect: false },
                        { optionText: 'False', isCorrect: false }
                    ],
                };
                break;
            case 'text':
                specificQuestion = {
                    questionDetail: '',
                };
                break;
            case 'video':
                specificQuestion = {
                    videoEmbedLink: '',
                };
                break;
        }

        setQuestions([...questions, { ...baseQuestion, ...specificQuestion }]);
    };

    const renderQuestionInput = (question, index) => {
        let inputs = [
            <TextInput
                key="title"
                style={styles.questionInput}
                placeholder={`${question.questionType.toUpperCase()} Question Title`}
                value={question.questionTitle}
                onChangeText={text => updateField(index, 'questionTitle', text)}
            />
        ];

        if (question.questionType === 'text' || question.questionType === 'video') {
            if (question.questionType === 'text') {
                inputs.push(
                    <TextInput
                        key="detail"
                        style={styles.multilineInput}
                        multiline
                        numberOfLines={4}
                        placeholder="Detailed Description"
                        value={question.questionDetail}
                        onChangeText={text => updateField(index, 'questionDetail', text)}
                    />
                );
            } else {
                inputs.push(
                    <TextInput
                        key="embed"
                        style={styles.questionInput}
                        placeholder="Embed Video Link"
                        value={question.videoEmbedLink}
                        onChangeText={text => updateField(index, 'videoEmbedLink', text)}
                    />
                );
            }
        } else {
            question.options.forEach((option, optionIndex) => {
                inputs.push(
                    <View key={`option-${optionIndex}`} style={styles.optionContainer}>
                        <TextInput
                            style={styles.optionInput}
                            placeholder="Option Text"
                            value={option.optionText}
                            onChangeText={text => updateOptionText(index, optionIndex, text)}
                        />
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={option.isCorrect ? '#f5dd4b' : '#f4f3f4'}
                            onValueChange={() => toggleOptionCorrect(index, optionIndex)}
                            value={option.isCorrect}
                        />
                    </View>
                );
            });
            if (question.questionType === 'mcq') {
                inputs.push(
                    <Button
                        key="add-option"
                        title="Add Option"
                        onPress={() => addOption(index)}
                    />
                );
            }
        }

        return <View key={question.questionId} style={styles.questionContainer}>{inputs}</View>;
    };

    const updateField = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const updateOptionText = (index, optionIndex, text) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].options[optionIndex].optionText = text;
        setQuestions(updatedQuestions);
    };

    const toggleOptionCorrect = (index, optionIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].options[optionIndex].isCorrect = !updatedQuestions[index].options[optionIndex].isCorrect;
        setQuestions(updatedQuestions);
    };

    const addOption = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].options.push({ optionText: '', isCorrect: false });
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
                    testName,
                    questions: questions.map(question => ({
                        ...question,
                        options: question.options ? question.options.map(option => ({
                            optionText: option.optionText,
                            isCorrect: option.isCorrect
                        })) : []
                    }))
                });
            Alert.alert('Success', 'Test submitted successfully!');
            navigation.goBack();
        } catch (error) {
            console.error("Error submitting test: ", error);
            Alert.alert('Error', 'Failed to submit test!');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Create a Test</Text>
            <TextInput
                style={styles.testNameInput}
                placeholder="Enter Test Name"
                value={testName}
                onChangeText={setTestName}
            />
            <Button title="Add Multiple Choice Question" onPress={() => addQuestion('mcq')} />
            <Button title="Add True/False Question" onPress={() => addQuestion('tf')} />
            <Button title="Add Text Response Question" onPress={() => addQuestion('text')} />
            <Button title="Add Video Analysis Question" onPress={() => addQuestion('video')} />
            {questions.map(renderQuestionInput)}
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
});

export default TestCreateScreen;
