import { menteeBoardsListStyles as styles } from './menteesScreenStyle';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomAppBar from '../../components/CustomAppBar';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MenteeBoardsList = ({ navigation }) => {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = auth().currentUser;

    useEffect(() => {
        const fetchBoards = async () => {
            setLoading(true);
            const boardList = [];

            try {
                const boardsSnapshot = await firestore().collection('boards').get();

                for (const boardDoc of boardsSnapshot.docs) {
                    const membersSnapshot = await boardDoc.ref.collection('members')
                        .where('userId', '==', currentUser.uid)
                        .where('role', '==', 'mentee')
                        .get();

                    for (const memberDoc of membersSnapshot.docs) {
                        boardList.push({
                            id: boardDoc.id,
                            memberId: memberDoc.id,
                            ...boardDoc.data()
                        });
                    }
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
        return (
            <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
                <CustomAppBar
                    title="Learning Boards"
                    showBackButton={true}
                    onBackPress={() => navigation.goBack()}
                />
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#FFBA00" />
                    <Text style={styles.loadingText}>Loading your learning boards...</Text>
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
            <CustomAppBar
                title="Learning Boards"
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />
            
            {boards.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="book-remove-outline" size={60} color="#FFBA00" />
                    <Text style={styles.emptyTitle}>No Learning Boards Found</Text>
                    <Text style={styles.emptySubtitle}>You haven't been added to any learning boards yet</Text>
                </View>
            ) : (
                <FlatList
                    data={boards}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.boardItem}
                            onPress={() => navigation.navigate('MenteeLessonsBoardsScreen', { 
                                boardId: item.id, 
                                memberId: item.memberId 
                            })}
                        >
                            <Icon name="book-education" size={30} color="#FFBA00" style={styles.boardIcon} />
                            <View style={styles.boardTextContainer}>
                                <Text style={styles.boardTitle}>{item.title}</Text>
                                <Text style={styles.boardCreator}>Created by: {item.creatorEmail}</Text>
                                <Text style={styles.boardDescription}>{item.description || 'No description available'}</Text>
                            </View>
                            <Icon name="chevron-right" size={24} color="#FFBA00" />
                        </TouchableOpacity>
                    )}
                />
            )}
        </LinearGradient>
    );
};

export default MenteeBoardsList;