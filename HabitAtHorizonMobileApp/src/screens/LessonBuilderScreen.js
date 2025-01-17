import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const LessonBuilderScreen = ({ route, navigation }) => {
    const { boardId, lessonId } = route.params;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState([]);

    const addElement = (type) => {
        const newElement = { id: Date.now(), type, value: '' };
        setContent([...content, newElement]);
    };

    const saveLesson = async () => {
        try {
            const lessonData = { title, description, content, createdAt: new Date() };

            if (lessonId) {
                await firestore()
                    .collection('boards')
                    .doc(boardId)
                    .collection('lessons')
                    .doc(lessonId)
                    .update(lessonData);
            } else {
                await firestore()
                    .collection('boards')
                    .doc(boardId)
                    .collection('lessons')
                    .add(lessonData);
            }

            Alert.alert('Success', 'Lesson saved successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Error saving lesson:', error);
            Alert.alert('Error', 'Could not save the lesson.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>{lessonId ? 'Edit Lesson' : 'Create Lesson'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Lesson Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            <View style={styles.contentActions}>
                <Button title="Add Heading" onPress={() => addElement('heading')} />
                <Button title="Add Paragraph" onPress={() => addElement('paragraph')} />
                <Button title="Add List" onPress={() => addElement('list')} />
                <Button title="Add iFrame" onPress={() => addElement('iframe')} />
            </View>
            {content.map((item) => (
                <View key={item.id} style={styles.contentItem}>
                    <Text>{item.type}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={`Enter ${item.type}`}
                        value={item.value}
                        onChangeText={(text) => {
                            setContent(
                                content.map((c) =>
                                    c.id === item.id ? { ...c, value: text } : c
                                )
                            );
                        }}
                    />
                </View>
            ))}
            <Button title="Save Lesson" onPress={saveLesson} />
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    contentActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    contentItem: {
        marginBottom: 15,
    },
});

export default LessonBuilderScreen;
