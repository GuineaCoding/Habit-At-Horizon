import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Dimensions, Modal, TextInput } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import firestore from '@react-native-firebase/firestore';
import { findUserByUsername } from '../services/UserService';
import CustomAppBar from '../components/CustomAppBar';
import LinearGradient from 'react-native-linear-gradient';

const BoardDetailsScreen = ({ route, navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { boardId } = route.params;
    const [boardData, setBoardData] = useState(null);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'lessons', title: 'Lessons' },
        { key: 'tests', title: 'Tests' },
        { key: 'members', title: 'Mentees and Submissions' },
    ]);
    const [lessons, setLessons] = useState([]);
    const [tests, setTests] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const unsubscribeBoard = firestore().collection('boards').doc(boardId).onSnapshot(doc => {
            if (doc.exists) {
                setBoardData({ id: doc.id, ...doc.data() });
            } else {
                setBoardData(null);
            }
        });

        const unsubscribeMembers = firestore().collection('boards').doc(boardId).collection('members').onSnapshot(snapshot => {
            const fetchedMembers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMembers(fetchedMembers);
        });

        const unsubscribeLessons = firestore().collection('boards').doc(boardId).collection('lessons').onSnapshot(snapshot => {
            const fetchedLessons = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setLessons(fetchedLessons);
        });

        const unsubscribeTests = firestore().collection('boards').doc(boardId).collection('tests').onSnapshot(snapshot => {
            const fetchedTests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTests(fetchedTests);
        });

        return () => {
            unsubscribeBoard();
            unsubscribeMembers();
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

    const inviteUser = async () => {
        if (!username) {
            setErrorMessage("Please enter a username.");
            return;
        }
        try {
            setErrorMessage('');
            const user = await findUserByUsername(username);

            if (!user) {
                setErrorMessage("User not found.");
                return;
            }

            const userId = user.id;
            const memberRef = firestore().collection('boards').doc(boardId).collection('members').doc(userId);
            const memberDoc = await memberRef.get();

            if (memberDoc.exists) {
                Alert.alert('Error', 'User is already a member of this board.');
                return;
            }

            await memberRef.set({
                userId: userId,
                email: user.email,
                username: user.username,
                role: 'mentee',
                joinedAt: firestore.FieldValue.serverTimestamp(),
            });

            await firestore().collection('users').doc(userId).update({
                boards: firestore.FieldValue.arrayUnion(boardId)
            });

            Alert.alert('Success', 'User has been invited successfully!');
            setModalVisible(false);
            setUsername('');
        } catch (error) {
            console.error("Failed to invite user:", error);
            setErrorMessage(error.message || 'Failed to invite user. Please try again.');
        }
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
                            <TouchableOpacity onPress={() => navigation.navigate('LessonBuilderScreen', { boardId, lessonId: item.id })} style={styles.editButton}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => firestore().collection('boards').doc(boardId).collection('lessons').doc(item.id).delete()} style={styles.deleteButton}>
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
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
                        <TouchableOpacity onPress={() => handleDeleteTest(item.id)} style={styles.deleteButton}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListFooterComponent={
                    <TouchableOpacity
                        style={styles.addTestButton}
                        onPress={() => navigation.navigate('TestCreateScreen', { boardId })}
                    >
                        <Text style={styles.addTestButtonText}>Add Test</Text>
                    </TouchableOpacity>
                }
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
                data={members}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('MenteeLessonsActivityScreen', { boardId, userId: item.id })}
                    >
                        <View style={styles.memberItem}>
                            <Text style={styles.memberEmail}>{item.email}</Text>
                            <Text style={styles.memberRole}>Username: {item.username || 'Not defined'}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListFooterComponent={
                    <TouchableOpacity
                        style={styles.inviteButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.inviteButtonText}>Invite Member</Text>
                    </TouchableOpacity>
                }
            />
        </View>
    );

    const renderScene = SceneMap({
        lessons: LessonsRoute,
        tests: TestsRoute,
        members: MembersRoute,
    });

    return (
        <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
        <View style={styles.container}>
            <CustomAppBar title={boardData.title} showBackButton={true} />
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
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Invite Member</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter username"
                            value={username}
                            onChangeText={setUsername}
                        />
                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                        <TouchableOpacity onPress={inviteUser} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Invite</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButtonCancel}>
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabContainer: {
        flex: 1,
        padding: 20,
    },
    tabBar: {
        backgroundColor: '#6D9773',
    },
    tabIndicator: {
        backgroundColor: '#FFBA00',
    },
    tabLabel: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    lessonItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: '#6D9773',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#6D9773',
    },
    lessonTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    buttonGroup: {
        flexDirection: 'row',
    },
    editButton: {
        backgroundColor: '#FFBA00',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: '#B46617',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#0C3B2E',
        fontWeight: 'bold',
    },
    noLessons: {
        textAlign: 'center',
        color: '#888',
        fontSize: 16,
        marginVertical: 20,
    },
    addLessonButton: {
        backgroundColor: '#FFBA00',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    addLessonButtonText: {
        color: '#0C3B2E',
        fontSize: 16,
        fontWeight: 'bold',
    },
    memberItem: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#6D9773',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#6D9773',
    },
    memberEmail: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    memberRole: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    inviteButton: {
        backgroundColor: '#FFBA00',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    inviteButtonText: {
        color: '#0C3B2E',
        fontSize: 16,
        fontWeight: 'bold',
    },
    testItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: '#6D9773',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#6D9773',
    },
    testTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    addTestButton: {
        backgroundColor: '#FFBA00',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    addTestButtonText: {
        color: '#0C3B2E',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#0C3B2E',
        padding: 20,
        borderRadius: 10,
        width: '90%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFBA00',
        textAlign: 'center',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#6D9773',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        width: '100%',
        backgroundColor: '#FFFFFF',
        color: '#0C3B2E',
    },
    modalButton: {
        backgroundColor: '#FFBA00',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
    },
    modalButtonCancel: {
        backgroundColor: '#B46617',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
    },
    modalButtonText: {
        color: '#0C3B2E',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#FF3B30',
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default BoardDetailsScreen;