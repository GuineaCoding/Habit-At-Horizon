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
            setLoading(true);
            console.log("Starting to fetch boards for user:", currentUser.uid);
            const boardList = [];

            try {
                const boardsSnapshot = await firestore().collection('boards').get();
                console.log("Fetched boards, total count:", boardsSnapshot.size);

                for (const boardDoc of boardsSnapshot.docs) {
                    console.log("Checking board:", boardDoc.id);
                    const membersSnapshot = await boardDoc.ref.collection('members')
                        .where('userId', '==', currentUser.uid)
                        .where('role', '==', 'mentee')
                        .get();

                    console.log(`Checked members for board ${boardDoc.id}, found count:`, membersSnapshot.size);
                    for (const memberDoc of membersSnapshot.docs) {
                        console.log(`User ${currentUser.uid} is a mentee in board ${boardDoc.id} with memberId ${memberDoc.id}`);
                        boardList.push({
                            id: boardDoc.id,
                            memberId: memberDoc.id,
                            ...boardDoc.data()
                        });
                    }
                }

                if (boardList.length > 0) {
                    console.log("Boards where user is a mentee found:", boardList.length);
                } else {
                    console.log("No boards found where user is a mentee.");
                }
                setBoards(boardList);
            } catch (error) {
                console.error("Error fetching boards:", error);
            }
            setLoading(false);
        };

        fetchBoards();
    }, []);

    if (loading) {
        console.log("Loading boards...");
        return <View style={styles.container}><Text>Loading boards...</Text></View>;
    }

    if (!boards.length) {
        console.log("No boards to display after fetch.");
        return <View style={styles.container}><Text>No boards found.</Text></View>;
    }

    console.log("Rendering boards list.");
    return (
        <View style={styles.container}>
            <FlatList
                data={boards}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.boardItem}
                        onPress={() => {
                            console.log("Navigating to details for board:", item.id, "with memberId:", item.memberId);
                            navigation.navigate('MenteeLessonsBoardsScreen', { boardId: item.id, memberId: item.memberId });
                        }}
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
