import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';

const MenteeLessonsActivityScreen = () => {
    const { userId, boardId } = useRoute().params;
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'checked', title: 'Checked' },
        { key: 'unchecked', title: 'Unchecked' }
    ]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        console.log(`Attempting to fetch submissions with Board ID: ${boardId}, User ID: ${userId}`);
        if (!userId || !boardId) {
            console.error("Invalid user or board ID:", { userId, boardId });
            setLoading(false);
            return;
        }

        const fetchSubmissions = async () => {
            setLoading(true);
            try {
                const snapshot = await firestore()
                    .collection('boards')
                    .doc(boardId)
                    .collection('members')
                    .doc(userId)
                    .collection('submissions')
                    .get();

                if (!snapshot.empty) {
                    const fetchedSubmissions = snapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            testName: data.testName,
                            submittedAt: data.submittedAt,
                            isTestCheckedByMentor: data.isTestCheckedByMentor
                        };
                    });
                    setSubmissions(fetchedSubmissions);
                } else {
                    setSubmissions([]);
                }
            } catch (error) {
                console.error("Failed to fetch submissions:", error);
            }
            setLoading(false);
        };

        fetchSubmissions();
    }, [userId, boardId]);

    const filteredSubmissions = (checked) =>
        submissions.filter(sub => sub.isTestCheckedByMentor === checked);

    const renderScene = SceneMap({
        unchecked: () => <SubmissionList submissions={filteredSubmissions(false)} navigation={navigation} userId={userId} boardId={boardId} />,
        checked: () => <SubmissionList submissions={filteredSubmissions(true)} navigation={navigation} userId={userId} boardId={boardId} />        
    });

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading submissions...</Text>
            </View>
        );
    }

    if (!submissions.length) {
        return (
            <View style={styles.container}>
                <Text>No submissions found.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Submissions</Text>
            </View>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={props => <TabBar {...props} style={styles.tabBar} />}
            />
        </SafeAreaView>
    );
};

const SubmissionList = ({ submissions, navigation, userId, boardId }) => (
    <FlatList
        data={submissions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
            <TouchableOpacity
                style={[styles.submissionItem, item.isTestCheckedByMentor ? styles.checked : styles.unchecked]}
                onPress={() => navigation.navigate('DetailedSubmissionView', {
                    submissionId: item.id,
                    userId: userId, 
                    boardId: boardId
                })}
            >
                <Text style={styles.submissionTitle}>Test Name: {item.testName}</Text>
                <Text>Submitted on: {item.submittedAt ? new Date(item.submittedAt.toDate()).toLocaleDateString() : 'N/A'}</Text>
            </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No submissions found.</Text>}
    />
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    header: {
        height: 50,
        backgroundColor: '#007bff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerTitle: {
        fontSize: 20,
        color: '#ffffff',
        fontWeight: 'bold'
    },
    tabBar: {
        backgroundColor: '#007bff'
    },
    submissionItem: {
        padding: 15,
        marginVertical: 8,
        borderRadius: 5
    },
    checked: {
        backgroundColor: '#e0ffe0'
    },
    unchecked: {
        backgroundColor: '#ffe0e0'
    },
    submissionTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default MenteeLessonsActivityScreen;
