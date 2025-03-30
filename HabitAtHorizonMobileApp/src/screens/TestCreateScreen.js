import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Switch, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import CustomAppBar from '../components/CustomAppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TestCreateScreen = ({ route, navigation }) => {
    const { boardId } = route.params;
    const [testName, setTestName] = useState('');
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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
                style={styles.input}
                placeholder={`${question.questionType.toUpperCase()} Question Title`}
                placeholderTextColor="#888"
                value={question.questionTitle}
                onChangeText={text => updateField(index, 'questionTitle', text)}
            />
        ];

        if (question.questionType === 'text' || question.questionType === 'video') {
            if (question.questionType === 'text') {
                inputs.push(
                    <TextInput
                        key="detail"
                        style={[styles.input, styles.multilineInput]}
                        multiline
                        placeholder="Detailed Description"
                        placeholderTextColor="#888"
                        value={question.questionDetail}
                        onChangeText={text => updateField(index, 'questionDetail', text)}
                    />
                );
            } else {
                inputs.push(
                    <TextInput
                        key="embed"
                        style={styles.input}
                        placeholder="Embed Video Link"
                        placeholderTextColor="#888"
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
                            style={[styles.input, styles.optionInput]}
                            placeholder="Option Text"
                            placeholderTextColor="#888"
                            value={option.optionText}
                            onChangeText={text => updateOptionText(index, optionIndex, text)}
                        />
                        <Switch
                            trackColor={{ false: '#767577', true: '#6D9773' }}
                            thumbColor={option.isCorrect ? '#FFBA00' : '#f4f3f4'}
                            onValueChange={() => toggleOptionCorrect(index, optionIndex)}
                            value={option.isCorrect}
                        />
                    </View>
                );
            });
            if (question.questionType === 'mcq') {
                inputs.push(
                    <TouchableOpacity
                        key="add-option"
                        style={styles.addOptionButton}
                        onPress={() => addOption(index)}
                    >
                        <Icon name="plus" size={20} color="#0C3B2E" />
                        <Text style={styles.addOptionButtonText}>Add Option</Text>
                    </TouchableOpacity>
                );
            }
        }

        return (
            <View key={question.questionId} style={styles.questionContainer}>
                {inputs}
                <TouchableOpacity 
                    style={styles.deleteQuestionButton}
                    onPress={() => deleteQuestion(index)}
                >
                    <Icon name="delete" size={20} color="#FFFFFF" />
                    <Text style={styles.deleteQuestionButtonText}>Delete Question</Text>
                </TouchableOpacity>
            </View>
        );
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

    const deleteQuestion = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
    };

    const handleSubmitTest = async () => {
        if (!testName.trim()) {
            Alert.alert('Error', 'Please enter a test name.');
            return;
        }

        if (questions.length === 0) {
            Alert.alert('Error', 'Please add at least one question.');
            return;
        }

        setIsLoading(true);

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
                    })),
                    createdAt: new Date()
                });
            Alert.alert('Success', 'Test submitted successfully!');
            navigation.goBack();
        } catch (error) {
            console.error("Error submitting test: ", error);
            Alert.alert('Error', 'Failed to submit test!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
            <CustomAppBar 
                title="Create Test" 
                showBackButton={true} 
            />
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.header}>Create a New Test</Text>
                
                <TextInput
                    style={styles.input}
                    placeholder="Enter Test Name"
                    placeholderTextColor="#888"
                    value={testName}
                    onChangeText={setTestName}
                />
                
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addQuestion('mcq')}
                    >
                        <Icon name="format-list-checks" size={20} color="#0C3B2E" />
                        <Text style={styles.addButtonText}>MCQ</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addQuestion('tf')}
                    >
                        <Icon name="check-circle-outline" size={20} color="#0C3B2E" />
                        <Text style={styles.addButtonText}>True/False</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addQuestion('text')}
                    >
                        <Icon name="text" size={20} color="#0C3B2E" />
                        <Text style={styles.addButtonText}>Text</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addQuestion('video')}
                    >
                        <Icon name="video" size={20} color="#0C3B2E" />
                        <Text style={styles.addButtonText}>Video</Text>
                    </TouchableOpacity>
                </View>
                
                {questions.map(renderQuestionInput)}
                
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmitTest}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#0C3B2E" />
                    ) : (
                        <>
                            <Icon name="send" size={20} color="#0C3B2E" />
                            <Text style={styles.submitButtonText}>Submit Test</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFBA00',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#FFFFFF',
        color: '#0C3B2E',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#6D9773',
    },
    multilineInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    addButton: {
        backgroundColor: '#FFBA00',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    addButtonText: {
        color: '#0C3B2E',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    questionContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    optionInput: {
        flex: 1,
        marginRight: 10,
    },
    addOptionButton: {
        backgroundColor: '#FFBA00',
        padding: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    addOptionButtonText: {
        color: '#0C3B2E',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    deleteQuestionButton: {
        backgroundColor: '#E74C3C',
        padding: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    deleteQuestionButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    submitButton: {
        backgroundColor: '#FFBA00',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    submitButtonText: {
        color: '#0C3B2E',
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 10,
    },
});

export default TestCreateScreen;