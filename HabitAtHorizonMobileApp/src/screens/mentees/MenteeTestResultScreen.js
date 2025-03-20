import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import CustomAppBar from '../../components/CustomAppBar';
import LinearGradient from 'react-native-linear-gradient';
import { menteeTestResultScreenStyles as styles } from './menteesScreenStyle'; 

const MenteeTestResultScreen = ({ route }) => {
    // Get the submission data passed from the previous screen
    const { submission } = route.params;

    return (
        // Gradient background for the screen
        <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
            {/* Custom AppBar for navigation and title */}
            <CustomAppBar title="Test Results" showBackButton={true} />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Test Feedback</Text>
                <Text style={styles.feedback}>{submission.genericTestFeedback}</Text>

                {/* Loop through each response to show question-specific feedback */}
                {submission.responses.map((response, index) => (
                    <View key={index} style={styles.responseContainer}>
                        <Text style={styles.questionTitle}>{response.questionTitle}</Text>

                        <Text style={styles.feedback}>{response.feedback}</Text>
                    </View>
                ))}
            </ScrollView>
        </LinearGradient>
    );
};

export default MenteeTestResultScreen;