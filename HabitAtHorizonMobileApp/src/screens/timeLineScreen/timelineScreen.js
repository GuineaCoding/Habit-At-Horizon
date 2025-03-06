import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import YoutubePlayer from 'react-native-youtube-iframe'; // Use react-native-youtube-iframe

const TimelineScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          const postsList = [];
          snapshot.forEach((doc) => {
            postsList.push({ id: doc.id, ...doc.data() });
          });
          setPosts(postsList);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching posts:', error);
          setLoading(false);
        }
      );

    return () => unsubscribe(); 
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0C3B2E" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={styles.postTitle}>{item.title}</Text>

            {item.description && (
              <Text style={styles.postDescription}>{item.description}</Text>
            )}

            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
            )}

            {item.youtubeUrl && (
              <YoutubePlayer
                height={200}
                videoId={extractYoutubeVideoId(item.youtubeUrl)} 
                play={false} 
              />
            )}

            <Text style={styles.postMetadata}>
              Posted by {item.username} • {item.createdAt?.toDate().toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts found.</Text>
          </View>
        }
      />
    </LinearGradient>
  );
};

const extractYoutubeVideoId = (url) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: {
    borderWidth: 1,
    borderColor: '#FFBA00',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  postMetadata: {
    fontSize: 12,
    color: '#FFBA00',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default TimelineScreen;