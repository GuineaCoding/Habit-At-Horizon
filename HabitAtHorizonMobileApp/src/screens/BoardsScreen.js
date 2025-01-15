import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const BoardsScreen = ({ navigation }) => {
    const [boards, setBoards] = useState([]);
    const user = auth().currentUser;

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('boards')
            .where(`members.${user.uid}`, '!=', null) 
            .onSnapshot(snapshot => {
                const fetchedBoards = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setBoards(fetchedBoards);
            });

        return () => unsubscribe();
    }, [user]);

    const renderBoard = ({ item }) => (
        <TouchableOpacity
            style={styles.boardItem}
            onPress={() => navigation.navigate('BoardScreen', { boardId: item.id })}
        >
            <Text style={styles.boardTitle}>{item.title}</Text>
            <Text style={styles.boardCreator}>Created by: {item.creatorEmail}</Text>
        </TouchableOpacity>
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
                <Button
                    title="Add a Board"
                    onPress={() => navigation.navigate('MentorshipScreen')}
                />
            </View>
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
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    boardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    boardCreator: {
        fontSize: 14,
        color: '#555',
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
});

export default BoardsScreen;
