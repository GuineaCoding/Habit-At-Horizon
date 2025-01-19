import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const TestViewScreen = ({ route }) => {
    const { boardId, testId } = route.params;
    const [testDetails, setTestDetails] = useState(null);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('boards')
            .doc(boardId)
            .collection('tests')
            .doc(testId)
            .onSnapshot(doc => {
                if (doc.exists) {
                    setTestDetails(doc.data());
                }
            });

        return () => unsubscribe();
    }, [boardId, testId]);

    if (!testDetails) {
        return <View style={styles.container}><Text>Loading test details...</Text></View>;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>{testDetails.name}</Text>
            {testDetails.questions.map((question, index) => (
                <View key={index} style={styles.question}>
                    <Text style={styles.questionText}>{question.questionText}</Text>
                </View>
            ))}
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
});

export default TestViewScreen;
