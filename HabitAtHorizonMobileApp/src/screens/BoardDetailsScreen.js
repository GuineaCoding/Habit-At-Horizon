import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Button } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import firestore from '@react-native-firebase/firestore';
import { Dimensions } from 'react-native';

const BoardDetailsScreen = ({ route, navigation }) => {
    const { boardId } = route.params;
    const [boardData, setBoardData] = useState(null);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'lessons', title: 'Lessons' },
        { key: 'tests', title: 'Tests' },
        { key: 'members', title: 'Members' },
    ]);
    const [lessons, setLessons] = useState([]);
    const [tests, setTests] = useState([]);

    useEffect(() => {
        const unsubscribeBoard = firestore()
            .collection('boards')
            .doc(boardId)
            .onSnapshot(doc => {
                if (doc.exists) {
                    setBoardData({ id: doc.id, ...doc.data() });
                } else {
                    setBoardData(null);
                }
            });

        const unsubscribeLessons = firestore()
            .collection('boards')
            .doc(boardId)
            .collection('lessons')
            .onSnapshot(snapshot => {
                const fetchedLessons = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setLessons(fetchedLessons);
            });

        const unsubscribeTests = firestore()
            .collection('boards')
            .doc(boardId)
            .collection('tests')
            .onSnapshot(snapshot => {
                const fetchedTests = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTests(fetchedTests);
            });

        return () => {
            unsubscribeBoard();
            unsubscribeLessons();
            unsubscribeTests();
        };
    }, [boardId]);

    if (!boardData) {
        return (
            <View style={styles.container}>
                <Text>Loading board details...</Text>
            </View>
        );
    }

    const addTest = () => {
        navigation.navigate('TestCreateScreen', { boardId });
    };

    const LessonsRoute = () => (
        <View style={styles.tabContainer}>
            <FlatList
                data={lessons}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.lessonItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('LessonScreen', { boardId, lessonId: item.id })}>
                            <Text style={styles.lessonTitle}>{item.title}</Text>
                        </TouchableOpacity>
                        <View style={styles.buttonGroup}>
                            <Button title="Edit" onPress={() => navigation.navigate('LessonBuilderScreen', { boardId, lessonId: item.id })} />
                            <Button title="Delete" color="red" onPress={() => firestore().collection('boards').doc(boardId).collection('lessons').doc(item.id).delete()} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.noLessons}>No lessons added yet.</Text>}
            />
            <TouchableOpacity
                style={styles.addLessonButton}
                onPress={() => navigation.navigate('LessonBuilderScreen', { boardId })}
            >
                <Text style={styles.addLessonButtonText}>Add Lesson</Text>
            </TouchableOpacity>
        </View>
    );

    const TestsRoute = () => (
        <View style={styles.tabContainer}>
            <FlatList
                data={tests}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.testItem}>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={() => navigation.navigate('TestViewScreen', { boardId, testId: item.id })}
                        >
                            <Text style={styles.testTitle}>{item.testName}</Text>
                        </TouchableOpacity>
                        <Button
                            title="Delete"
                            color="red"
                            onPress={() => handleDeleteTest(item.id)}
                        />
                    </View>
                )}
                ListFooterComponent={(
                    <TouchableOpacity
                        style={styles.addTestButton}
                        onPress={() => navigation.navigate('TestCreateScreen', { boardId })}
                    >
                        <Text style={styles.addTestButtonText}>Add Test</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );

    const handleDeleteTest = (testId) => {
        Alert.alert("Confirm Delete", "Are you sure you want to delete this test?", [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: () => firestore().collection('boards').doc(boardId).collection('tests').doc(testId).delete() }
        ]);
    };



    const MembersRoute = () => (
        <View style={styles.tabContainer}>
            <FlatList
                data={Object.entries(boardData.members || {})}
                keyExtractor={([userId]) => userId}
                renderItem={({ item: [userId, userDetails] }) => (
                    <View style={styles.memberItem}>
                        <Text>{userDetails.email}</Text>
                        <Text style={styles.memberRole}>Role: {userDetails.role}</Text>
                    </View>
                )}
            />
        </View>
    );

    const renderScene = SceneMap({
        lessons: LessonsRoute,
        tests: TestsRoute,
        members: MembersRoute,
    });

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{boardData.title}</Text>
            <Text style={styles.subHeader}>Created by: {boardData.creatorEmail}</Text>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        indicatorStyle={styles.tabIndicator}
                        style={styles.tabBar}
                        labelStyle={styles.tabLabel}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({

    testItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subHeader: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    tabContainer: {
        flex: 1,
        paddingBottom: 20,
    },
    tabBar: {
        backgroundColor: '#007bff',
    },
    tabIndicator: {
        backgroundColor: '#fff',
    },
    tabLabel: {
        color: '#fff',
        fontWeight: 'bold',
    },
    lessonItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    lessonTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    lessonDescription: {
        fontSize: 14,
        color: '#555',
    },
    buttonGroup: {
        flexDirection: 'row',
    },
    noLessons: {
        textAlign: 'center',
        color: '#777',
        fontSize: 16,
        marginVertical: 20,
    },
    addLessonButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        left: 20,
        right: 20,
    },
    addLessonButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    memberItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    memberRole: {
        color: '#555',
    },
    testItem: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    testTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    addTestButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    addTestButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BoardDetailsScreen;
