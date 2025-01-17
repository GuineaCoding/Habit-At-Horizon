import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, WebView } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const LessonScreen = ({ route }) => {
    const { boardId, lessonId } = route.params;
    const [lesson, setLesson] = useState(null);

    useEffect(() => {
        const lessonRef = firestore().collection('boards').doc(boardId).collection('lessons').doc(lessonId);

        const unsubscribe = lessonRef.onSnapshot(snapshot => {
            if (snapshot.exists) {
                setLesson(snapshot.data());
            } else {
                setLesson(null);
            }
        });

        return unsubscribe;
    }, [boardId, lessonId]);

    if (!lesson) {
        return <View style={styles.container}><Text>Loading lesson details...</Text></View>;
    }

    const renderContent = (item, index) => {
        switch(item.type) {
            case 'heading':
                return <Text key={index} style={styles.heading}>{item.value}</Text>;
            case 'paragraph':
                return <Text key={index} style={styles.paragraph}>{item.value}</Text>;
            case 'list':
                return <Text key={index} style={styles.listItem}>{item.value}</Text>;
            case 'iframe':
                return <WebView key={index} style={styles.webview} source={{ uri: item.value }} />;
            default:
                return <Text key={index}>{item.value}</Text>;
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>{lesson.title}</Text>
            <Text style={styles.description}>{lesson.description}</Text>
            {lesson.content && lesson.content.map(renderContent)}
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
    description: {
        fontSize: 18,
        marginBottom: 10,
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
    },
    paragraph: {
        fontSize: 16,
        marginTop: 10,
    },
    listItem: {
        fontSize: 16,
        marginLeft: 20,
    },
    webview: {
        height: 200,  
        marginVertical: 20,
    },
});

export default LessonScreen;
