import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BoardsScreen = ({ navigation }) => {
    const [boards, setBoards] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [boardTitle, setBoardTitle] = useState('');
    const [editBoardId, setEditBoardId] = useState(null);
    const user = auth().currentUser;

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const boardsSnapshot = await firestore().collection('boards').get();
                const userBoards = [];

                for (const boardDoc of boardsSnapshot.docs) {
                    const memberDoc = await boardDoc.ref
                        .collection('members')
                        .doc(user.uid)
                        .get();

                    if (memberDoc.exists) {
                        userBoards.push({
                            id: boardDoc.id,
                            ...boardDoc.data(),
                        });
                    }
                }

                setBoards(userBoards);
            } catch (error) {
                console.error('Error fetching boards:', error);
            }
        };

        fetchBoards();
    }, [user]);

    const handleSaveBoard = async () => {
        if (!boardTitle.trim()) {
            Alert.alert('Validation Error', 'Board name cannot be empty');
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
                    .update({ title: boardTitle });
            } else {
                const newBoardRef = firestore().collection('boards').doc();
                await newBoardRef.set({
                    title: boardTitle,
                    creator: user.uid,
                    creatorEmail: user.email,
                    createdAt: new Date(),
                });
                await newBoardRef.collection('members').doc(user.uid).set({
                    role: 'Admin',
                    joinedAt: new Date(),
                });
            }

            setModalVisible(false);
            setBoardTitle('');
            setEditBoardId(null);
        } catch (error) {
            console.error('Error saving board:', error);
        }
    };


    const deleteBoard = async boardId => {
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
                        } catch (error) {
                            console.error('Error deleting board:', error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const openEditModal = board => {
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
                <Text style={styles.boardCreator}>Created by: {item.creatorEmail}</Text>
            </TouchableOpacity>
            <View style={styles.boardActions}>
                <TouchableOpacity onPress={() => openEditModal(item)}>
                    <Icon name="edit" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteBoard(item.id)}>
                    <Icon name="delete" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Boards</Text>
            {boards.length > 0 ? (
                <FlatList
                    data={boards}
                    renderItem={renderBoard}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <Text style={styles.noBoardsText}>You have no boards yet.</Text>
            )}

            <View style={styles.addButtonContainer}>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add a Board</Text>
                </TouchableOpacity>
            </View>

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
                            value={boardTitle}
                            onChangeText={setBoardTitle}
                        />
                        <Button
                            title={editBoardId ? 'Save Changes' : 'Create Board'}
                            onPress={handleSaveBoard}
                        />
                        <Button title="Cancel" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    list: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    boardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    boardInfo: {
        flex: 1,
    },
    boardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    boardCreator: {
        fontSize: 14,
        color: '#555',
    },
    boardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 60,
    },
    noBoardsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#777',
        marginVertical: 20,
    },
    addButtonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
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
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
    },
    modalHeader: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        width: '100%',
    },
});

export default BoardsScreen;
