import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import firestore from '@react-native-firebase/firestore';
import { Dimensions } from 'react-native';

const BoardDetailsScreen = ({ route }) => {
    const { boardId } = route.params;  
    const [boardData, setBoardData] = useState(null);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'lessons', title: 'Lessons' },
        { key: 'tests', title: 'Tests' },
        { key: 'members', title: 'Members' },
    ]);

    useEffect(() => {
        
        const unsubscribe = firestore()
            .collection('boards')
            .doc(boardId)
            .onSnapshot(doc => {
                if (doc.exists) {
                    setBoardData({ id: doc.id, ...doc.data() });
                }
            });

        return () => unsubscribe();
    }, [boardId]);

    if (!boardData) {
        return (
            <View style={styles.container}>
                <Text>Loading board details...</Text>
            </View>
        );
    }
 
    const LessonsRoute = () => (
        <View style={styles.tabContainer}>
            <Text>Lessons </Text>
        </View>
    );

    // Tab Content: Tests
    const TestsRoute = () => (
        <View style={styles.tabContainer}>
            <Text>Tests </Text>
        </View>
    );

    // Tab Content: Members
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
        alignItems: 'center',
        justifyContent: 'center',
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
    memberItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    memberRole: {
        color: '#555',
    },
});

export default BoardDetailsScreen;
