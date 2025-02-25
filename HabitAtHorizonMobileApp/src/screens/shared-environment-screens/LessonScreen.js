import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import firestore from '@react-native-firebase/firestore';
import CustomAppBar from '../../components/CustomAppBar';

const LessonScreen = ({ route, navigation }) => {
    const { boardId, lessonId } = route.params;
    const [lesson, setLesson] = useState(null);
    const [isImageModalVisible, setIsImageModalVisible] = useState(false); 

    useEffect(() => {
        const lessonRef = firestore()
            .collection('boards')
            .doc(boardId)
            .collection('lessons')
            .doc(lessonId);

        const unsubscribe = lessonRef.onSnapshot((snapshot) => {
            if (snapshot.exists) {
                setLesson(snapshot.data());
            } else {
                setLesson(null);
            }
        });

        return unsubscribe;
    }, [boardId, lessonId]);

    if (!lesson) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading lesson details...</Text>
            </View>
        );
    }

    const renderContent = (item, index) => {
        switch (item.type) {
            case 'heading':
                return (
                    <Text key={index} style={styles.heading}>
                        {item.value}
                    </Text>
                );
            case 'paragraph':
                return (
                    <Text key={index} style={styles.paragraph}>
                        {item.value}
                    </Text>
                );
            case 'list':
                return (
                    <Text key={index} style={styles.listItem}>
                        • {item.value}
                    </Text>
                );
            case 'iframe':
                return (
                    <WebView
                        key={index}
                        style={styles.webview}
                        source={{ uri: item.value }}
                    />
                );
            default:
                return (
                    <Text key={index} style={styles.paragraph}>
                        {item.value}
                    </Text>
                );
        }
    };

    return (
        <View style={styles.container}>
            <CustomAppBar
                title={lesson.title} 
                showBackButton={true} 
                onBackPress={() => navigation.goBack()} 
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.description}>{lesson.description}</Text>
                {lesson.imageUrl && (
                    <TouchableOpacity onPress={() => setIsImageModalVisible(true)}>
                        <Image source={{ uri: lesson.imageUrl }} style={styles.image} />
                    </TouchableOpacity>
                )}
                {lesson.content && lesson.content.map(renderContent)}
            </ScrollView>
            <Modal
                visible={isImageModalVisible}
                transparent={true}
                onRequestClose={() => setIsImageModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.modalCloseButton}
                        onPress={() => setIsImageModalVisible(false)}
                    >
                        <Text style={styles.modalCloseButtonText}>Close</Text>
                    </TouchableOpacity>
                    <Image
                        source={{ uri: lesson.imageUrl }}
                        style={styles.fullScreenImage}
                        resizeMode="contain"
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0C3B2E',
    },
    scrollContainer: {
        padding: 20,
    },
    loadingText: {
        color: '#FFBA00',
        fontSize: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 18,
        marginBottom: 20,
        color: '#FFFFFF',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#FFBA00',
    },
    paragraph: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 10,
        color: '#FFFFFF',
        lineHeight: 24,
    },
    listItem: {
        fontSize: 16,
        marginLeft: 20,
        marginBottom: 5,
        color: '#FFFFFF',
    },
    webview: {
        height: 400,
        marginVertical: 20,
        borderRadius: 8,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    fullScreenImage: {
        width: '100%',
        height: '100%',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: '#FFBA00',
        padding: 10,
        borderRadius: 8,
    },
    modalCloseButtonText: {
        color: '#0C3B2E',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LessonScreen;