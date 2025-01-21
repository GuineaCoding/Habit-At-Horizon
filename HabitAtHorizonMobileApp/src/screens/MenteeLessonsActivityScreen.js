import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const MenteeLessonsActivityScreen = ({ route }) => {
    const { userId, boardId } = route.params;
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const snapshot = await firestore()
                    .collection('boards')
                    .doc(boardId)
                    .collection('testResponses')
                    .where('userId', '==', userId)
                    .get();

                const fetchedSubmissions = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setSubmissions(fetchedSubmissions);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch submissions: ", error);
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [userId, boardId]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={submissions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.submissionItem}
                        onPress={() => navigation.navigate('DetailedSubmissionView', { submissionId: item.id, userId, boardId })}
                    >
                        <Text style={styles.submissionTitle}>Test Name: {item.testName}</Text>
                        <Text>Submitted on: {new Date(item.submittedAt.toDate()).toLocaleDateString()}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text>No submissions found.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    submissionItem: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 5
    },
    submissionTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default MenteeLessonsActivityScreen;
