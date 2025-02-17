import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; 
import CustomAppBar from '../components/CustomAppBar';

const HomeScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert('Exit App', 'Are you sure you wan111t to exit?', [
          { text: 'Cancel', onPress: () => null, style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, []) 
  );

  const goToMyPersonalSpace = () => {
    navigation.navigate('PersonalSpaceScreen');
  };

  const goToMentoring = () => {
    navigation.navigate('MentorshipScreen');
  };

  const goToMenteeScreen = () => {
    navigation.navigate('MenteesDashboardScreen');
  };

  return (
    <View style={styles.container}>
      <CustomAppBar title="Home Screen" showBackButton={false} />
      <View style={styles.listContainer}>
        <TouchableOpacity style={[styles.listItem, { backgroundColor: '#6D9773' }]} onPress={goToMyPersonalSpace}>
          <Text style={styles.listText}>My Personal Space</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.listItem, { backgroundColor: '#B46617' }]} onPress={goToMentoring}>
          <Text style={styles.listText}>Mentoring Space</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.listItem, { backgroundColor: '#FFBA00' }]} onPress={goToMenteeScreen}>
          <Text style={styles.listText}>Mentee Space</Text>
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
  listContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  listItem: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    alignItems: 'center',
  },
  listText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default HomeScreen;