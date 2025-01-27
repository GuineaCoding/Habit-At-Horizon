    import React, { useEffect, useState } from 'react';
    import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, TextInput, Button, ActivityIndicator } from 'react-native';
    import firestore from '@react-native-firebase/firestore';
    import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
    import auth from '@react-native-firebase/auth';
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
            <FlatList
                data={lessons}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.lessonItem}
                        onPress={() => navigation.navigate('LessonScreen', { boardId, lessonId: item.id })}
                    >
                        <Text style={styles.lessonTitle}>{item.title}</Text>
                        <Text style={styles.lessonContent}>{item.description}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
            />
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
            <FlatList
                data={tests}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.testItem}
                        onPress={() => navigation.navigate('TestViewScreen', { boardId, testId: item.id })}
                    >
                        <Text style={styles.testTitle}>{item.testName}</Text>
                        <Text style={styles.testContent}>{item.description}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
            />
        );
    };

    const ResultsRoute = ({ boardId, userId }) => {
        const [loading, setLoading] = useState(true);
        const [memberData, setMemberData] = useState(null);
        const [checkedSubmissions, setCheckedSubmissions] = useState([]);
    
        useEffect(() => {
            const fetchMemberData = async () => {
                console.log("Accessing results for boardId:", boardId);
                console.log("Accessing results for userId:", userId);
    
                try {
                    const memberRef = firestore()
                        .collection('boards')
                        .doc(boardId)
                        .collection('members')
                        .doc(userId);
    
                    const memberDoc = await memberRef.get();
    
                    if (memberDoc.exists) {
                        console.log("Fetched member data:", memberDoc.data());
                        setMemberData(memberDoc.data());
    
                        const submissionsSnapshot = await memberRef.collection('submissions').get();
                        const filteredSubmissions = [];
                        submissionsSnapshot.forEach(doc => {
                            const data = doc.data();
                            console.log(`Submission ${doc.id}:`, data);
                            if (data.isTestCheckedByMentor) {
                                filteredSubmissions.push(data.testName);
                            }
                        });
                        setCheckedSubmissions(filteredSubmissions);
                    } else {
                        console.log("No member data found.");
                        setMemberData(null);
                        setCheckedSubmissions([]);
                    }
                } catch (error) {
                    console.error("Error fetching member data:", error);
                    setCheckedSubmissions([]);
                }
                setLoading(false);
            };
    
            fetchMemberData();
        }, [boardId, userId]);
    
        if (loading) {
            return <View style={styles.loader}><ActivityIndicator size="large" color="#0000ff" /></View>;
        }
    
        if (!memberData) {
            return <View style={styles.container}><Text>No member data available.</Text></View>;
        }
    
        return (
            <View style={styles.scene}>
                <Text style={styles.contentText}>Results Content</Text>
                <Text style={styles.contentText}>Board ID: {boardId}</Text>
                <Text style={styles.contentText}>User ID: {userId}</Text>
                <Text style={styles.contentText}>Member Data: {JSON.stringify(memberData)}</Text>
                {checkedSubmissions.length > 0 ? (
                    <View>
                        <Text style={styles.contentText}>Approved Test Names:</Text>
                        {checkedSubmissions.map((name, index) => (
                            <Text key={index} style={styles.contentText}>{name}</Text>
                        ))}
                    </View>
                ) : (
                    <Text style={styles.contentText}>No approved tests found.</Text>
                )}
            </View>
        );
    };
    

    const CommunicationRoute = ({ boardId }) => {
        const [messages, setMessages] = useState([]);
        const [newMessage, setNewMessage] = useState('');
        const currentUser = auth().currentUser; 

        useEffect(() => {
            const unsubscribe = firestore()
                .collection('boards')
                .doc(boardId)
                .collection('chat')
                .orderBy('timestamp', 'asc')
                .onSnapshot(snapshot => {
                    const fetchedMessages = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setMessages(fetchedMessages);
                });

            return () => unsubscribe();
        }, [boardId]);

        const sendMessage = async () => {
            if (newMessage.trim() === '') return;

            await firestore()
                .collection('boards')
                .doc(boardId)
                .collection('chat')
                .add({
                    text: newMessage,
                    timestamp: firestore.FieldValue.serverTimestamp(),
                    senderId: currentUser.uid  
                });

            setNewMessage('');
        };

        return (
            <View style={styles.scene}>
                <FlatList
                    data={messages}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.messageItem}>
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
                        onSubmitEditing={sendMessage}
                    />
                    <Button title="Send" onPress={sendMessage} />
                </View>
            </View>
        );
    };

    const MenteeLessonBoardsScreen = ({ route, navigation }) => {
        const { boardId } = route.params;
        const currentUser = auth().currentUser;
        const userId = currentUser ? currentUser.uid : null;
    
        console.log("Current User ID:", userId); 
    
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
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: 'white' }}
                        style={styles.tabBar}
                        labelStyle={styles.tabLabel}
                    />
                )}
            />
        );
    };

    const styles = StyleSheet.create({
        scene: {
            flex: 1,
            padding: 20,
        },
        tabBar: {
            backgroundColor: '#007bff',
        },
        tabLabel: {
            color: '#fff',
            fontWeight: 'bold',
        },
        contentText: {
            fontSize: 16,
            textAlign: 'center',
        },
        lessonItem: {
            padding: 15,
            marginVertical: 8,
            backgroundColor: '#f0f0f0',
            borderRadius: 5,
        },
        testItem: {
            padding: 15,
            marginVertical: 8,
            backgroundColor: '#f0f0f0',
            borderRadius: 5,
        },
        testTitle: {
            fontSize: 16,
            fontWeight: 'bold',
        },
        testContent: {
            fontSize: 14,
            color: '#666',
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
    });

    export default MenteeLessonBoardsScreen;
