import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator, TextInput, Button } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const MenteeLessonsActivityScreen = () => {
    const { userId, boardId } = useRoute().params;
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'checked', title: 'Checked' },
        { key: 'unchecked', title: 'Unchecked' },
        { key: 'chat', title: 'Chat' } 
    ]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        console.log(`Attempting to fetch submissions with Board ID: ${boardId}, User ID: ${userId}`);
        if (!userId || !boardId) {
            console.error("Invalid user or board ID:", { userId, boardId });
            setLoading(false);
            return;
        }

        const fetchSubmissions = async () => {
            setLoading(true);
            try {
                const snapshot = await firestore()
                    .collection('boards')
                    .doc(boardId)
                    .collection('members')
                    .doc(userId)
                    .collection('submissions')
                    .get();

                if (!snapshot.empty) {
                    const fetchedSubmissions = snapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            testName: data.testName,
                            submittedAt: data.submittedAt,
                            isTestCheckedByMentor: data.isTestCheckedByMentor
                        };
                    });
                    setSubmissions(fetchedSubmissions);
                } else {
                    setSubmissions([]);
                }
            } catch (error) {
                console.error("Failed to fetch submissions:", error);
            }
            setLoading(false);
        };

        fetchSubmissions();
    }, [userId, boardId]);

    const filteredSubmissions = (checked) =>
        submissions.filter(sub => sub.isTestCheckedByMentor === checked);

    const renderScene = SceneMap({
        unchecked: () => <SubmissionList submissions={filteredSubmissions(false)} navigation={navigation} userId={userId} boardId={boardId} />,
        checked: () => <SubmissionList submissions={filteredSubmissions(true)} navigation={navigation} userId={userId} boardId={boardId} />,
        chat: () => <ChatTab userId={userId} boardId={boardId} />
    });

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading submissions...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Submissions</Text>
            </View>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={props => <TabBar {...props} style={styles.tabBar} />}
            />
        </SafeAreaView>
    );
};

const SubmissionList = ({ submissions, navigation, userId, boardId }) => {
    if (submissions.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    {submissions.some(sub => sub.isTestCheckedByMentor) ? "No unchecked submissions." : "No checked submissions."}
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={submissions}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={[styles.submissionItem, item.isTestCheckedByMentor ? styles.checked : styles.unchecked]}
                    onPress={() => navigation.navigate('DetailedSubmissionView', {
                        submissionId: item.id,
                        userId: userId,
                        boardId: boardId
                    })}
                >
                    <Text style={styles.submissionTitle}>Test Name: {item.testName}</Text>
                    <Text>Submitted on: {item.submittedAt ? new Date(item.submittedAt.toDate()).toLocaleDateString() : 'N/A'}</Text>
                </TouchableOpacity>
            )}
        />
    );
};

const ChatTab = ({ userId, boardId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        console.log("Setting up Firestore listener for chat messages...");
        const unsubscribe = firestore()
            .collection('boards')
            .doc(boardId)
            .collection('chat')
            .doc(userId)
            .collection('messages')
            .orderBy('timestamp', 'asc')
            .onSnapshot(async (snapshot) => {
                console.log("New messages snapshot received:", snapshot.docs.length);
                const fetchedMessages = await Promise.all(
                    snapshot.docs.map(async (doc) => {
                        const messageData = doc.data();
                        console.log("Fetched message data:", messageData);
                        const userDoc = await firestore()
                            .collection('users')
                            .doc(messageData.senderId)
                            .get();
                        const username = userDoc.data()?.username || 'Unknown User';
                        return {
                            id: doc.id,
                            ...messageData,
                            username,
                        };
                    })
                );
                setMessages(fetchedMessages);
            }, (error) => {
                console.error("Error fetching messages:", error);
            });

        return () => {
            console.log("Unsubscribing from Firestore listener...");
            unsubscribe();
        };
    }, [userId, boardId]);

    const sendMessage = async () => {
        if (!newMessage.trim()) {
            console.log("Message is empty, not sending.");
            return;
        }

        const currentUser = auth().currentUser; 
        if (!currentUser) {
            console.error("No authenticated user found.");
            return;
        }

        const messageData = {
            text: newMessage,
            timestamp: firestore.FieldValue.serverTimestamp(),
            senderId: currentUser.uid, 
        };

        console.log("Sending message:", messageData);

        try {
            await firestore()
                .collection('boards')
                .doc(boardId)
                .collection('chat')
                .doc(userId)
                .collection('messages')
                .add(messageData);
            console.log("Message sent successfully.");
            setNewMessage(''); 
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <View style={styles.chatContainer}>
            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.messageItem}>
                        <Text style={styles.messageText}>
                            {item.username}: {item.text}
                        </Text>
                    </View>
                )}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    onSubmitEditing={sendMessage}
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    header: {
        height: 50,
        backgroundColor: '#007bff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerTitle: {
        fontSize: 20,
        color: '#ffffff',
        fontWeight: 'bold'
    },
    tabBar: {
        backgroundColor: '#007bff'
    },
    submissionItem: {
        padding: 15,
        marginVertical: 8,
        borderRadius: 5
    },
    checked: {
        backgroundColor: '#e0ffe0'
    },
    unchecked: {
        backgroundColor: '#ffe0e0'
    },
    submissionTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    chatContainer: {
        flex: 1,
        padding: 10,
    },
    messageItem: {
        padding: 10,
        marginVertical: 4,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    messageText: {
        fontSize: 14,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginRight: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#777',
    },
});

export default MenteeLessonsActivityScreen;