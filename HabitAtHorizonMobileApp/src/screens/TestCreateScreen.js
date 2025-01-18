import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Switch } from 'react-native';

const TestCreateScreen = () => {
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
        updatedQuestions[index].options.forEach((option, idx) => {
            if (idx === optionIndex) option.correct = !option.correct;
        });
        setQuestions(updatedQuestions);
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
                            <Button title="True" onPress={() => setAnswer(index, 'True')} />
                            <Button title="False" onPress={() => setAnswer(index, 'False')} />
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
            <Button title="Add Multiple Choice Question" onPress={() => addQuestion('mcq')} />
            <Button title="Add True/False Question" onPress={() => addQuestion('tf')} />
            <Button title="Add Text Response Question" onPress={() => addQuestion('text')} />
            <Button title="Add Video Analysis Question" onPress={() => addQuestion('video')} />
            {questions.map((question, index) => renderQuestionInput(question, index))}
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
