import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // For gradient background
import CustomAppBar from '../../components/CustomAppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // For icons

const MentorshipScreen = ({ navigation }) => {
    const menuItems = [
        { id: '1', title: 'Boards', navigateTo: 'BoardsScreen', icon: 'view-dashboard' },
        { id: '2', title: 'View Mentor List', navigateTo: 'MentorListPage', icon: 'account-group' },
        { id: '3', title: 'Create Mentor Profile', navigateTo: 'MentorProfileCreationStartScreen', icon: 'account-plus' },
        { id: '4', title: 'Go Back', navigateTo: null, icon: 'arrow-left' },
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
            style={styles.listItem}
            onPress={() => handleNavigation(item.navigateTo)}
        >
            <Icon name={item.icon} size={24} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.listText}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
            <CustomAppBar title="Mentorship Environment" showBackButton={true} />

            <View style={styles.content}>
                <Text style={styles.header}>Welcome to Mentorship</Text>
                <FlatList
                    data={menuItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFBA00',
        textAlign: 'center',
        marginBottom: 30,
    },
    listContainer: {
        flexGrow: 1,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFBA00',
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    icon: {
        marginRight: 16,
        color: '#0C3B2E',
    },
    listText: {
        fontSize: 18,
        color: '#0C3B2E',
        fontWeight: '600',
    },
});

export default MentorshipScreen;