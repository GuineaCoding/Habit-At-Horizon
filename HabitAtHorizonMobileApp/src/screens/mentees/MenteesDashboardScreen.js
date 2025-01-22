import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MenteesDashboardScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mentee's Dashboard</Text>
            </View>
            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('LessonBoardsScreen')}
                >
                    <Text style={styles.buttonText}>Lesson Boards</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('AnotherBoardScreen')}
                >
                    <Text style={styles.buttonText}>Another Board</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff'
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    backButton: {
        fontSize: 18,
        color: '#007bff'
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    content: {
        width: '100%',
        alignItems: 'center'
    },
    button: {
        width: '100%',
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default MenteesDashboardScreen;
