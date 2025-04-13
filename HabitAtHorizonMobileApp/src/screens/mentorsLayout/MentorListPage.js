import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CustomAppBar from '../../components/CustomAppBar';
import LinearGradient from 'react-native-linear-gradient';

import { mentorListPageStyle as styles } from './styles';

const MentorListPage = ({ navigation }) => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const mentorSnapshot = await firestore().collection('mentors').get();
        const mentorList = mentorSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMentors(mentorList);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };

    fetchMentors();
  }, []);

  const handleMentorPress = (mentor) => {
    navigation.navigate('MentorProfileViewScreen', { mentor });
  };

  const renderMentorItem = ({ item }) => {
    const firstLetter = item.username ? item.username.charAt(0).toUpperCase() : 'M';
    
    return (
      <TouchableOpacity
        style={styles.mentorItem}
        onPress={() => handleMentorPress(item)} 
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
        <View style={styles.mentorInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.username}>@{item.username}</Text>
          <Text style={styles.bio}>{item.bio}</Text>
          <Text style={styles.expertise}>Offers: {item.expertise}</Text>
          {item.tags && (
            <View style={styles.tagsContainer}>
              {item.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Mentor List" showBackButton={true} />
      <FlatList
        data={mentors}
        renderItem={renderMentorItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </LinearGradient>
  );
};

export default MentorListPage;