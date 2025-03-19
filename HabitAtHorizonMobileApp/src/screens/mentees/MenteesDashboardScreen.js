import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomAppBar from '../../components/CustomAppBar';
import LinearGradient from 'react-native-linear-gradient';
import { menteesDashboardScreenStyles as styles } from './menteesScreenStyle'; 

const MenteesDashboardScreen = () => {
    const navigation = useNavigation();

    return (
        <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
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
        </LinearGradient>
    );
};

export default MenteesDashboardScreen;