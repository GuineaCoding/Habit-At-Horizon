import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions, TextInput, ActivityIndicator } from 'react-native';
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
            });

        return () => unsubscribe();
    }, [boardId]);

    return (
        <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.gradientContainer}>
            <FlatList
                data={lessons}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.lessonItem}
                        onPress={() => navigation.navigate('LessonScreen', { boardId, lessonId: item.id })}
                    >
                        <Icon name="book-open" size={24} color="#0C3B2E" style={styles.icon} />
                        <View style={styles.textContainer}>
                            <Text style={styles.lessonTitle}>{item.title}</Text>
                            <Text style={styles.lessonContent}>{item.description}</Text>
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
            });

        return () => unsubscribe();
    }, [boardId]);

    return (
        <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.gradientContainer}>
            <FlatList
                data={tests}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.testItem}
                        onPress={() => navigation.navigate('TestViewScreen', { boardId, testId: item.id })}
                    >
                        <Icon name="clipboard-text" size={24} color="#0C3B2E" style={styles.icon} />
                        <View style={styles.textContainer}>
                            <Text style={styles.testTitle}>{item.testName}</Text>
                            <Text style={styles.testContent}>{item.description}</Text>
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
            <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.gradientContainer}>
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#FFBA00" />
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.gradientContainer}>
            <FlatList
                data={submissions}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.resultItem}
                        onPress={() => navigation.navigate('MenteeTestResultScreen', { submission: item })}
                    >
                        <Icon name="chart-bar" size={24} color="#0C3B2E" style={styles.icon} />
                        <View style={styles.textContainer}>
                            <Text style={styles.testName}>{item.testName}</Text>
                            <Text style={styles.testStatus}>Status: {item.passStatus}</Text>
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
            <View style={styles.scene}>
                <FlatList
                    data={messages}
                    contentContainerStyle={styles.listContainer}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.messageItem}>
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
                        <Icon name="send" size={24} color="#0C3B2E" />
                    </TouchableOpacity>
                </View>
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
        { key: 'communication', title: 'Communication' },
    ]);

    const renderScene = SceneMap({
        lessons: () => <LessonsRoute boardId={boardId} navigation={navigation} />,
        tests: () => <TestsRoute boardId={boardId} navigation={navigation} />,
        results: () => <ResultsRoute boardId={boardId} userId={userId} />,
        communication: () => <CommunicationRoute boardId={boardId} />,
    });

    return (
        <View style={styles.container}>
            {/* CustomAppBar at the top */}
            <CustomAppBar
                title="Mentee's Dashboard"
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />
            {/* TabView below the CustomAppBar */}
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: '#FFBA00' }}
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