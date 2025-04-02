import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import CustomAppBar from '../components/CustomAppBar';

const BoardsScreen = ({ navigation }) => {
    const [boards, setBoards] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [boardTitle, setBoardTitle] = useState('');
    const [editBoardId, setEditBoardId] = useState(null);
    const user = auth().currentUser;

    const fetchBoards = async () => {
        try {
            const userBoards = [];
            
            // 1. Get boards where user is the creator
            const creatorBoards = await firestore()
                .collection('boards')
                .where('creator', '==', user.uid)
                .get();
            
            creatorBoards.forEach(doc => {
                userBoards.push({
                    id: doc.id,
                    ...doc.data(),
                    isCreator: true
                });
            });

            // 2. Get boards where user is a member (using alternative approach)
            const allBoards = await firestore()
                .collection('boards')
                .get();

            const memberBoardsPromises = allBoards.docs.map(async (doc) => {
                if (doc.data().creator === user.uid) return null;
                
                const memberDoc = await firestore()
                    .collection('boards')
                    .doc(doc.id)
                    .collection('members')
                    .doc(user.uid)
                    .get();
                
                return memberDoc.exists ? {
                    id: doc.id,
                    ...doc.data(),
                    isCreator: false
                } : null;
            });

            const memberBoards = (await Promise.all(memberBoardsPromises)).filter(b => b !== null);
            userBoards.push(...memberBoards);

            setBoards(userBoards);
        } catch (error) {
            console.error('Error fetching boards:', error);
            Alert.alert('Error', 'Failed to load boards. Please try again later.');
        }
    };

    useEffect(() => {
        fetchBoards();
    }, [user]);

    const handleSaveBoard = async () => {
        if (!boardTitle.trim()) {
            Alert.alert('Validation Error', 'Board name cannot be empty');
            return;
        }

        if (!user || !user.uid) {
            Alert.alert('User Error', 'User information is not available. Please log in again.');
            return;
        }

        let username = '';
        try {
            const userDoc = await firestore().collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                username = userDoc.data().username;
            } else {
                Alert.alert('User Error', 'User profile not found.');
                return;
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            Alert.alert('Error', 'Failed to fetch user profile. Please try again.');
            return;
        }

        try {
            const existingBoards = await firestore()
                .collection('boards')
                .where('title', '==', boardTitle)
                .get();

            if (!existingBoards.empty && (!editBoardId || existingBoards.docs[0].id !== editBoardId)) {
                Alert.alert('Validation Error', 'Board name must be unique');
                return;
            }

            if (editBoardId) {
                await firestore()
                    .collection('boards')
                    .doc(editBoardId)
                    .update({ title: boardTitle, username: username });
            } else {
                const newBoardRef = firestore().collection('boards').doc();
                await newBoardRef.set({
                    title: boardTitle,
                    creator: user.uid,
                    creatorEmail: user.email,
                    username: username,
                    createdAt: new Date(),
                });
                await newBoardRef.collection('members').doc(user.uid).set({
                    userId: user.uid,
                    role: 'Admin',
                    creatorEmail: user.email,
                    username: username,
                    joinedAt: new Date(),
                });
            }

            await fetchBoards();

            setModalVisible(false);
            setBoardTitle('');
            setEditBoardId(null);
        } catch (error) {
            console.error('Error saving board:', error);
            Alert.alert('Error', 'Failed to save the board. Please try again.');
        }
    };

    const deleteBoard = async (boardId) => {
        Alert.alert(
            'Delete Board',
            'Are you sure you want to delete this board?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await firestore().collection('boards').doc(boardId).delete();
                            await fetchBoards();
                        } catch (error) {
                            console.error('Error deleting board:', error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const openEditModal = (board) => {
        setBoardTitle(board.title);
        setEditBoardId(board.id);
        setModalVisible(true);
    };

    const renderBoard = ({ item }) => (
        <View style={styles.boardItem}>
            <TouchableOpacity
                style={styles.boardInfo}
                onPress={() => navigation.navigate('BoardDetailsScreen', { boardId: item.id })}
            >
                <Text style={styles.boardTitle}>{item.title}</Text>
                <Text style={styles.boardCreator}>Created by: {item.username}</Text>
                {item.creator !== user.uid && (
                    <Text style={styles.boardMemberNote}>(Shared with you)</Text>
                )}
            </TouchableOpacity>
            <View style={styles.boardActions}>
                {item.creator === user.uid && (
                    <>
                        <TouchableOpacity onPress={() => openEditModal(item)}>
                            <Icon name="edit" size={24} color="#FFBA00" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteBoard(item.id)}>
                            <Icon name="delete" size={24} color="#B46617" />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );

    return (
        <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
            <CustomAppBar title="Your Boards" showBackButton={false} />
            {boards.length > 0 ? (
                <FlatList
                    data={boards}
                    renderItem={renderBoard}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <Text style={styles.noBoardsText}>You have no boards yet.</Text>
            )}

            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add a Board</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>
                            {editBoardId ? 'Edit Board' : 'Create a New Board'}
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter board title"
                            placeholderTextColor="#888"
                            value={boardTitle}
                            onChangeText={setBoardTitle}
                        />
                        <TouchableOpacity onPress={handleSaveBoard} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>
                                {editBoardId ? 'Save Changes' : 'Create Board'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButtonCancel}>
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    boardItem: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: '#6D9773',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    boardInfo: {
        flex: 1,
    },
    boardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFBA00',
    },
    boardCreator: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    boardMemberNote: {
        fontSize: 12,
        color: '#FFBA00',
        fontStyle: 'italic',
    },
    boardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 60,
    },
    noBoardsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#FFFFFF',
        marginVertical: 20,
    },
    addButton: {
        backgroundColor: '#FFBA00',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        margin: 20,
    },
    addButtonText: {
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
    modalHeader: {
        fontSize: 18,
        marginBottom: 10,
        color: '#FFBA00',
        textAlign: 'center',
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
});

export default BoardsScreen;