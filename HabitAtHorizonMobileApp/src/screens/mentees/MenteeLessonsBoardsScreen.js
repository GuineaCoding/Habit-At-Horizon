import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Dimensions } from 'react-native';

const initialLayout = { width: Dimensions.get('window').width };

const LessonsRoute = ({ boardId }) => {
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('boards')
            .doc(boardId)
            .collection('lessons')
            .onSnapshot(snapshot => {
                const fetchedLessons = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setLessons(fetchedLessons);
            });

        return () => unsubscribe();
    }, [boardId]);

    return (
        <FlatList
            data={lessons}
            renderItem={({ item }) => (
                <View style={styles.lessonItem}>
                    <Text style={styles.lessonTitle}>{item.title}</Text>
                    <Text style={styles.lessonContent}>{item.description}</Text>
                </View>
            )}
            keyExtractor={item => item.id}
        />
    );
};

const TestsRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#fff' }]}>
        <Text style={styles.contentText}>Tests Content</Text>
    </View>
);

const ResultsRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#fff' }]}>
        <Text style={styles.contentText}>Results Content</Text>
    </View>
);

const CommunicationRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#fff' }]}>
        <Text style={styles.contentText}>Communication Content</Text>
    </View>
);

const MenteesDashboardScreen = ({ route }) => {
    const { boardId } = route.params;
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'lessons', title: 'Lessons', boardId },
        { key: 'tests', title: 'Tests' },
        { key: 'results', title: 'Results' },
        { key: 'communication', title: 'Communication' },
    ]);

    const renderScene = SceneMap({
        lessons: () => <LessonsRoute boardId={boardId} />,
        tests: TestsRoute,
        results: ResultsRoute,
        communication: CommunicationRoute,
    });

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={props => (
                <TabBar
                    {...props}
                    indicatorStyle={{ backgroundColor: 'white' }}
                    style={styles.tabBar}
                    labelStyle={styles.tabLabel}
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        padding: 20,
    },
    tabBar: {
        backgroundColor: '#007bff',
    },
    tabLabel: {
        color: '#fff',
        fontWeight: 'bold',
    },
    contentText: {
        fontSize: 16,
        textAlign: 'center',
    },
    lessonItem: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 5
    },
    lessonTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    lessonContent: {
        fontSize: 14,
        color: '#666',
    }
});

export default MenteesDashboardScreen;
