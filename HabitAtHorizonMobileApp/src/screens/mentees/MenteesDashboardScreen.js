import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomAppBar from '../../components/CustomAppBar'; 

const MenteesDashboardScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <CustomAppBar
                title="Mentee's Dashboard"
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />
            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('MenteeBoardsList')}
                >
                    <Text style={styles.buttonText}>Learning Boards</Text>
                </TouchableOpacity> 
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0C3B2E',
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: '100%',
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#FFBA00',
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0C3B2E',
    },
});

export default MenteesDashboardScreen;