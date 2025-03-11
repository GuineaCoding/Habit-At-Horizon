import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import CustomAppBar from '../components/CustomAppBar';
import LinearGradient from 'react-native-linear-gradient';

const DetailedSubmissionView = ({ route, navigation }) => {
  const { submissionId, userId, boardId } = route.params;
  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [passStatus, setPassStatus] = useState('pass');
  const [genericTestFeedback, setGenericTestFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      setLoading(true);
      try {
        const doc = await firestore()
          .collection('boards')
          .doc(boardId)
          .collection('members')
          .doc(userId)
          .collection('submissions')
          .doc(submissionId)
          .get();

        if (doc.exists) {
          const data = { id: doc.id, ...doc.data() };
          setSubmissionDetails(data);
          setFeedback((data.responses || []).map((r) => r.feedback || ''));
        } else {
          setSubmissionDetails(null);
        }
      } catch (error) {
        console.error('Failed to fetch submission details: ', error);
      }
      setLoading(false);
    };

    fetchSubmissionDetails();
  }, [submissionId, userId, boardId]);

  const handleFeedbackChange = (text, index) => {
    const newFeedback = [...feedback];
    newFeedback[index] = text;
    setFeedback(newFeedback);
  };

  const submitFeedback = async () => {
    setLoading(true);
    try {
      await firestore()
        .collection('boards')
        .doc(boardId)
        .collection('members')
        .doc(userId)
        .collection('submissions')
        .doc(submissionId)
        .update({
          responses: submissionDetails.responses.map((response, index) => ({
            ...response,
            feedback: feedback[index],
          })),
          genericTestFeedback: genericTestFeedback,
          passStatus: passStatus,
          isTestCheckedByMentor: true,
        });
      Alert.alert('Feedback Submitted', 'Your feedback has been successfully submitted.');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback.');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
        <ActivityIndicator size="large" color="#FFBA00" />
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    );
  }

  if (!submissionDetails) {
    return (
      <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
        <Text style={styles.errorText}>No details available.</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar
        title="Submission Details"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {submissionDetails.responses &&
          submissionDetails.responses.map((response, index) => (
            <View key={index} style={styles.responseContainer}>
              <Text style={styles.responseTitle}>{response.questionTitle}</Text>
              <Text style={styles.responseText}>
                Response: {Array.isArray(response.response) ? response.response.join(', ') : response.response}
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleFeedbackChange(text, index)}
                value={feedback[index]}
                placeholder="Enter feedback here"
                placeholderTextColor="#888"
                multiline
              />
            </View>
          ))}
        <TextInput
          style={styles.input}
          onChangeText={setGenericTestFeedback}
          value={genericTestFeedback}
          placeholder="Enter generic test feedback here"
          placeholderTextColor="#888"
          multiline
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={passStatus}
            onValueChange={(itemValue) => setPassStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Pass" value="pass" />
            <Picker.Item label="Fail" value="fail" />
          </Picker>
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={submitFeedback}>
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  loadingText: {
    color: '#FFBA00',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    color: '#FFBA00',
    fontSize: 16,
    textAlign: 'center',
  },
  responseContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0C3B2E',
  },
  responseText: {
    fontSize: 14,
    color: '#0C3B2E',
    marginTop: 5,
  },
  input: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#6D9773',
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#0C3B2E',
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#6D9773',
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#0C3B2E',
  },
  submitButton: {
    backgroundColor: '#FFBA00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#0C3B2E',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DetailedSubmissionView;