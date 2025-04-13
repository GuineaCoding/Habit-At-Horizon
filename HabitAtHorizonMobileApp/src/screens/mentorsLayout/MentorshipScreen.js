import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomAppBar from '../../components/CustomAppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

import { mentorshipScreenStyle as styles } from './styles';

const MentorshipScreen = ({ navigation }) => {
    const menuItems = [
        { id: '1', title: 'Boards', navigateTo: 'BoardsScreen', icon: 'view-dashboard' },
        { id: '2', title: 'View Mentor List', navigateTo: 'MentorListPage', icon: 'account-group' },
        { id: '3', title: 'Create Mentor Profile', navigateTo: 'MentorProfileCreationStartScreen', icon: 'account-plus' }
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

export default MentorshipScreen;