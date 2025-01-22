import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const LessonsRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#fff' }]}>
        <Text style={styles.contentText}>Lessons Content</Text>
    </View>
);

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

const initialLayout = { width: Dimensions.get('window').width };

const MenteesDashboardScreen = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'lessons', title: 'Lessons' },
        { key: 'tests', title: 'Tests' },
        { key: 'results', title: 'Results' },
        { key: 'communication', title: 'Communication' },
    ]);

    const renderScene = SceneMap({
        lessons: LessonsRoute,
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
    }
});

export default MenteesDashboardScreen;
