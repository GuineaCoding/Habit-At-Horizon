import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import CustomAppBar from '../../components/CustomAppBar';

import { menteeListScreen as styles } from './styles';

const MenteeListScreen = ({ navigation }) => {
  const [mentees, setMentees] = useState([]);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const menteeSnapshot = await firestore()
          .collection('users')
          .where('roles', 'array-contains', 'mentee')
          .where('visibleToOthers', '==', true) // Only show visible mentees
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

  const renderMenteeItem = ({ item }) => {
    const firstLetter = item.username ? item.username.charAt(0).toUpperCase() : 'U';
    
    return (
      <TouchableOpacity
        style={styles.menteeItem}
        onPress={() => navigation.navigate('MenteeProfileViewScreen', { mentee: item })}
      >
        {item.profileImage ? (
          <Image 
            source={{ uri: item.profileImage }}
            style={styles.profileImage}
          />
        ) : (
          <LinearGradient
            colors={['#0C3B2E', '#6D9773']}
            style={styles.profileCircle}
          >
            <Text style={styles.profileLetter}>{firstLetter}</Text>
          </LinearGradient>
        )}
        
        <View style={styles.menteeInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.username}>@{item.username}</Text>
          <Text style={styles.bio} numberOfLines={2} ellipsizeMode="tail">
            {item.bio}
          </Text>
          
          {item.menteeData?.goals?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Goals:</Text>
              <View style={styles.tagsContainer}>
                {item.menteeData.goals.slice(0, 3).map((goal, index) => (
                  <Text key={index} style={styles.tag}>
                    {goal}
                  </Text>
                ))}
                {item.menteeData.goals.length > 3 && (
                  <Text style={styles.moreTag}>+{item.menteeData.goals.length - 3}</Text>
                )}
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Mentee List" showBackButton={false} />
      <FlatList
        data={mentees}
        renderItem={renderMenteeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No mentees found</Text>
        }
      />
    </LinearGradient>
  );
};

export default MenteeListScreen;