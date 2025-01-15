import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const MentorshipScreen = ({ navigation }) => {
    const menuItems = [
        { id: '1', title: 'Boards', navigateTo: 'BoardsScreen' },
        { id: '2', title: 'Go Back', navigateTo: null }, 
    ];

    const handleNavigation = (navigateTo) => {
        if (navigateTo) {
            navigation.navigate(navigateTo);
        } else {
            navigation.goBack();
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleNavigation(item.navigateTo)}
        >
            <Text style={styles.listText}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mentorship Environment</Text>
            <FlatList
                data={menuItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
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
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    listContainer: {
        flexGrow: 1,
    },
    listItem: {
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 10,
    },
    listText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MentorshipScreen;
