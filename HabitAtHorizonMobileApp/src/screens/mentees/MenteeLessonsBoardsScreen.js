// MenteeLessonBoardsScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Dimensions, TextInput, ActivityIndicator, Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import CustomAppBar from '../../components/CustomAppBar';
import { menteeLessonBoardsScreenStyles as styles } from './menteesScreenStyle';

const initialLayout = { width: Dimensions.get('window').width };

const LessonsRoute = ({ boardId, navigation }) => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('boards')
            .doc(boardId)
            .collection('lessons')
            .onSnapshot(snapshot => {
                const fetchedLessons = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setLessons(fetchedLessons);
                setLoading(false);
            });

        return () => unsubscribe();
    }, [boardId]);

    if (loading) {
        return (
            <LinearGradient 
                colors={['#0C3B2E', '#6D9773']} 
                style={[styles.gradientContainer, styles.loader]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
            >
                <ActivityIndicator size="large" color="#FFBA00" />
            </LinearGradient>
        );
    }

    if (lessons.length === 0) {
        return (
            <LinearGradient 
                colors={['#0C3B2E', '#6D9773']} 
                style={[styles.gradientContainer, styles.emptyContainer]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
            >
                <Icon name="book-remove-outline" size={50} color="rgba(255, 255, 255, 0.3)" />
                <Text style={styles.emptyText}>No lessons available yet</Text>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient 
            colors={['#0C3B2E', '#6D9773']} 
            style={styles.gradientContainer}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
        >
            <FlatList
                data={lessons}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.cardItem}
                        onPress={() => navigation.navigate('LessonScreen', { boardId, lessonId: item.id })}
                    >
                        <Icon name="book-open" size={24} style={styles.icon} />
                        <View style={styles.textContainer}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardContent}>{item.description || 'No description'}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
            />
        </LinearGradient>
    );
};

const TestsRoute = ({ boardId, navigation }) => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('boards')
            .doc(boardId)
            .collection('tests')
            .onSnapshot(snapshot => {
                const fetchedTests = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTests(fetchedTests);
                setLoading(false);
            });

        return () => unsubscribe();
    }, [boardId]);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#FFBA00" />
            </View>
        );
    }

    if (tests.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Icon name="clipboard-remove-outline" size={50} color="rgba(255, 255, 255, 0.3)" />
                <Text style={styles.emptyText}>No tests available yet</Text>
            </View>
        );
    }

    return (
        <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.gradientContainer}>
            <FlatList
                data={tests}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.cardItem}
                        onPress={() => navigation.navigate('TestViewScreen', { boardId, testId: item.id })}
                    >
                        <Icon name="clipboard-text" size={24} style={styles.icon} />
                        <View style={styles.textContainer}>
                            <Text style={styles.cardTitle}>{item.testName}</Text>
                            <Text style={styles.cardContent}>{item.description || 'No description'}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
            />
        </LinearGradient>
    );
};

const ResultsRoute = ({ boardId, userId }) => {
    const [loading, setLoading] = useState(true);
    const [submissions, setSubmissions] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchSubmissions = async () => {
            const memberRef = firestore()
                .collection('boards')
                .doc(boardId)
                .collection('members')
                .doc(userId)
                .collection('submissions');

            const snapshot = await memberRef.where('isTestCheckedByMentor', '==', true).get();
            const submissionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSubmissions(submissionsData);
            setLoading(false);
        };

        fetchSubmissions();
    }, [boardId, userId]);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#FFBA00" />
            </View>
        );
    }

    if (submissions.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Icon name="chart-box-outline" size={50} color="rgba(255, 255, 255, 0.3)" />
                <Text style={styles.emptyText}>No test results available yet</Text>
            </View>
        );
    }

    return (
        <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.gradientContainer}>
            <FlatList
                data={submissions}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.cardItem}
                        onPress={() => navigation.navigate('MenteeTestResultScreen', { submission: item })}
                    >
                        <Icon name="chart-bar" size={24} style={styles.icon} />
                        <View style={styles.textContainer}>
                            <Text style={styles.cardTitle}>{item.testName}</Text>
                            <Text style={styles.statusText}>Status: {item.passStatus}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
            />
        </LinearGradient>
    );
};

const CommunicationRoute = ({ boardId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const currentUser = auth().currentUser;

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = firestore()
            .collection('boards')
            .doc(boardId)
            .collection('chat')
            .doc(currentUser.uid)
            .collection('messages')
            .orderBy('timestamp', 'asc')
            .onSnapshot(async (snapshot) => {
                const fetchedMessages = await Promise.all(
                    snapshot.docs.map(async (doc) => {
                        const messageData = doc.data();
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
            });

        return () => unsubscribe();
    }, [boardId, currentUser]);

    const sendMessage = async () => {
        if (!currentUser || newMessage.trim() === '') return;

        const userDoc = await firestore()
            .collection('users')
            .doc(currentUser.uid)
            .get();
        const username = userDoc.data()?.username || 'Unknown User';

        const messageData = {
            text: newMessage,
            timestamp: firestore.FieldValue.serverTimestamp(),
            senderId: currentUser.uid,
            username,
        };

        await firestore()
            .collection('boards')
            .doc(boardId)
            .collection('chat')
            .doc(currentUser.uid)
            .collection('messages')
            .add(messageData);

        setNewMessage('');
    };

    return (
        <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.gradientContainer}>
            <FlatList
                data={messages}
                contentContainerStyle={[styles.listContainer, { paddingBottom: 80 }]}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageItem,
                        item.senderId === currentUser?.uid ? styles.myMessage : styles.otherMessage
                    ]}>
                        <Text style={styles.messageUsername}>{item.username}</Text>
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    placeholderTextColor="#888"
                    onSubmitEditing={sendMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Icon name="send" size={20} color="#0C3B2E" />
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const MenteeLessonBoardsScreen = ({ route, navigation }) => {
    const { boardId } = route.params;
    const currentUser = auth().currentUser;
    const userId = currentUser ? currentUser.uid : null;

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'lessons', title: 'Lessons' },
        { key: 'tests', title: 'Tests' },
        { key: 'results', title: 'Results' },
        { key: 'communication', title: 'Chat' },
    ]);

    const renderScene = SceneMap({
        lessons: () => <LessonsRoute boardId={boardId} navigation={navigation} />,
        tests: () => <TestsRoute boardId={boardId} navigation={navigation} />,
        results: () => <ResultsRoute boardId={boardId} userId={userId} />,
        communication: () => <CommunicationRoute boardId={boardId} />,
    });

    return (
        <View style={styles.container}>
            <CustomAppBar
                title="Learning Board"
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        indicatorStyle={styles.tabIndicator}
                        style={styles.tabBar}
                        labelStyle={styles.tabLabel}
                    />
                )}
                style={styles.tabView}
            />
        </View>
    );
};

export default MenteeLessonBoardsScreen;