// MenteesDashboardScreen.js
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
                <Text style={styles.welcomeText}>Welcome to Your Learning Space</Text>
                <Text style={styles.subtitle}>
                    Explore learning boards, acquire new knowledge, ask questions, and solve challenges
                </Text>
                <Text style={styles.welcomeText}>Learn • Ask • Solve</Text>
                
                <TouchableOpacity
                    style={[styles.button, styles.buttonEnhanced]}
                    onPress={() => navigation.navigate('MenteeBoardsList')}
                >
                    <Text style={styles.buttonText}>Browse Learning Boards</Text>
                </TouchableOpacity>
                
                <View style={styles.featuresContainer}>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureEmoji}>📚</Text>
                        <Text style={styles.featureText}>Learn from curated resources</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureEmoji}>💬</Text>
                        <Text style={styles.featureText}>Ask mentors questions</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureEmoji}>🧩</Text>
                        <Text style={styles.featureText}>Solve real challenges</Text>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};

export default MenteesDashboardScreen;