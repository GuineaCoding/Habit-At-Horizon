  import React, { useEffect, useState } from 'react';
  import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
  import firestore from '@react-native-firebase/firestore';
  import CustomAppBar from '../../components/CustomAppBar';

  const MenteeListScreen = ({ navigation }) => {
    const [mentees, setMentees] = useState([]);

    useEffect(() => {
      const fetchMentees = async () => {
        try {
          const menteeSnapshot = await firestore()
            .collection('users')
            .where('roles', 'array-contains', 'mentee') 
            .get();

          const menteeList = menteeSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMentees(menteeList);
        } catch (error) {
          console.error('Error fetching mentees:', error);
        }
      };

      fetchMentees();
    }, []);

    const renderMenteeItem = ({ item }) => (
      <TouchableOpacity
        style={styles.menteeItem}
        onPress={() => navigation.navigate('MenteeProfileViewScreen', { mentee: item })}
      >
        <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
        <View style={styles.menteeInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.username}>@{item.username}</Text>
          <Text style={styles.bio}>{item.bio}</Text>

        </View>
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <CustomAppBar title="Mentee List" showBackButton={false} />

        <FlatList
          data={mentees}
          renderItem={renderMenteeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0C3B2E',
    },
    listContainer: {
      padding: 16,
    },
    menteeItem: {
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
      padding: 16,
      marginBottom: 12,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    profileImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 16,
    },
    menteeInfo: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
      color: '#0C3B2E',
    },
    username: {
      fontSize: 14,
      color: '#6D9773',
      marginBottom: 8,
    },
    bio: {
      fontSize: 14,
      color: '#333',
      marginBottom: 8,
    },
    tagsContainer: {
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#0C3B2E',
      marginBottom: 4,
    },
    tag: {
      fontSize: 12,
      color: '#FFFFFF',
      backgroundColor: '#6D9773',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
      marginBottom: 8,
    },
  });

  export default MenteeListScreen;