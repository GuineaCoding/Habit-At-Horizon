import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, Alert, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CustomAppBar from '../components/CustomAppBar';
import { useQuote } from '../components/useQuote';
import { useRefreshService } from '../components/pullRefreshScreenService';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { quote, isLoading, error, fetchQuote } = useQuote();
  const { refreshing, onRefresh } = useRefreshService(fetchQuote);

  useFocusEffect(
    React.useCallback(() => {
      fetchQuote();

      const backAction = () => {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
          { text: 'Cancel', onPress: () => null, style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [fetchQuote])
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

  const goToTopListScreen = () => {
    navigation.navigate('TopListScreen');
  };
  const goToCreatePostScreen = () => {
    navigation.navigate('CreatePostScreen');
  };

  const goToTimelineScreen = () => {
    navigation.navigate('TimelineScreen');
  };



  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <CustomAppBar title="Home Screen" showBackButton={false} />

        <View style={styles.quoteContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#FFBA00" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <>
              <Text style={styles.quoteText}>"{quote.content}"</Text>
              <Text style={styles.authorText}>- {quote.author}</Text>
            </>
          )}
        </View>

        <View style={styles.listContainer}>
          <TouchableOpacity style={styles.button} onPress={goToMyPersonalSpace}>
            <Icon name="account" size={24} color="#0C3B2E" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>My Personal Space</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToMentoring}>
            <Icon name="school" size={24} color="#0C3B2E" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Mentoring Space</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToMenteeScreen}>
            <Icon name="account-group" size={24} color="#0C3B2E" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Mentee Space</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToTopListScreen}>
            <Icon name="format-list-numbered" size={24} color="#0C3B2E" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Top List Screen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToTimelineScreen}>
            <Icon name="newspaper" size={24} color="#0C3B2E" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Community Feed</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  quoteContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  authorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFBA00',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#FFBA00',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    color: '#0C3B2E',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
});

export default HomeScreen;