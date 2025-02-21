import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, Alert, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CustomAppBar from '../components/CustomAppBar';
import { useQuote } from '../components/useQuote'; 

const HomeScreen = () => {
  const navigation = useNavigation();
  const { quote, isLoading, error, fetchQuote } = useQuote(); 
  const [refreshing, setRefreshing] = React.useState(false);

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

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchQuote();
    setRefreshing(false);
  }, [fetchQuote]);

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

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <CustomAppBar title="Home Screen" showBackButton={false} />

      <View style={styles.quoteContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#6D9773" />
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
        <TouchableOpacity style={[styles.listItem, { backgroundColor: '#6D9773' }]} onPress={goToMyPersonalSpace}>
          <Text style={styles.listText}>My Personal Space</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.listItem, { backgroundColor: '#B46617' }]} onPress={goToMentoring}>
          <Text style={styles.listText}>Mentoring Space</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.listItem, { backgroundColor: '#FFBA00' }]} onPress={goToMenteeScreen}>
          <Text style={styles.listText}>Mentee Space</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.listItem, { backgroundColor: '#FFBA00' }]} onPress={goToTopListScreen}>
          <Text style={styles.listText}>Top List Screen</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0C3B2E',
    paddingBottom: 20,
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