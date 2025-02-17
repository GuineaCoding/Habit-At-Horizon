import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import CustomAppBar from '../../components/CustomAppBar';
const MentorshipScreen = ({ navigation }) => {
    const menuItems = [
        { id: '1', title: 'Boards', navigateTo: 'BoardsScreen' },
        { id: '2', title: 'View Mentor List', navigateTo: 'MentorListPage' }, 
        { id: '3', title: 'Create Mentor Profile', navigateTo: 'AddMentorScreen' }, 
        { id: '4', title: 'Go Back', navigateTo: null }, 
    ];

    const handleNavigation = (navigateTo) => {
        if (navigateTo) {
            navigation.navigate(navigateTo);
        } else {
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.navigate('Home'); 
            }
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.listItem, { backgroundColor: '#6D9773' }]} 
            onPress={() => handleNavigation(item.navigateTo)}
        >
            <Text style={styles.listText}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
      <CustomAppBar title="Home Screen" showBackButton={false} menuItems={menuItems} />

            <View style={styles.content}>
                <Text style={styles.header}>Mentorship Environment</Text>
                <FlatList
                    data={menuItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0C3B2E', 
    },
    topBar: {
        height: 60,
        backgroundColor: '#6D9773', 
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight, 
    },
    topBarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF', 
    },
    content: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
        color: '#FFFFFF', 
    },
    listContainer: {
        flexGrow: 1,
    },
    listItem: {
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 3,
        alignItems: 'center',
    },
    listText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default MentorshipScreen;