import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const MenteeBoardsList = ({ navigation }) => {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = auth().currentUser;

    useEffect(() => {
        const fetchBoards = async () => {
            const snapshot = await firestore()
                .collection('boards')
                .where(`members.${currentUser.uid}.role`, '==', 'mentee')
                .get();

            const fetchedBoards = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setBoards(fetchedBoards);
            setLoading(false);
        };

        fetchBoards();
    }, []);

    if (loading) {
        return <View style={styles.container}><Text>Loading boards...</Text></View>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={boards}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.boardItem}
                        onPress={() => navigation.navigate('BoardDetails', { boardId: item.id })}
                    >
                        <Text style={styles.boardTitle}>{item.title}</Text>
                        <Text style={styles.boardCreator}>Created by: {item.creatorEmail}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text>No boards found.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    boardItem: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 5
    },
    boardTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    boardCreator: {
        fontSize: 14,
        color: '#666',
    }
});

export default MenteeBoardsList;
