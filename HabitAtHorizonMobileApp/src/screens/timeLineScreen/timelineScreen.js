import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import YoutubePlayer from 'react-native-youtube-iframe';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomAppBar from '../../components/CustomAppBar';
import auth from '@react-native-firebase/auth';

const TimelineScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = auth().currentUser?.uid;

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

  const sendNotification = async (postCreatorId, type, message) => {
    if (!currentUserId || !postCreatorId || currentUserId === postCreatorId) {
      return;
    }

    try {
      await firestore().collection('notifications').add({
        userId: postCreatorId,
        type,
        message,
        timestamp: firestore.FieldValue.serverTimestamp(),
        seen: false,
      });
      console.log('Notification sent successfully:', message);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleLike = async (postId, postCreatorId) => {
    try {
      const postRef = firestore().collection('posts').doc(postId);
      const postDoc = await postRef.get();
      const likedBy = postDoc.data()?.likedBy || [];

      if (likedBy.includes(currentUserId)) {
 
        await postRef.update({
          likesCount: firestore.FieldValue.increment(-1),
          likedBy: firestore.FieldValue.arrayRemove(currentUserId),
        });
      } else {
        await postRef.update({
          likesCount: firestore.FieldValue.increment(1),
          likedBy: firestore.FieldValue.arrayUnion(currentUserId),
        });

        const currentUser = auth().currentUser;
        const username = currentUser?.displayName || 'a user';
        const message = `Your post was liked by ${username}`;
        await sendNotification(postCreatorId, 'like', message);
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const handleCongratulate = async (postId, postCreatorId) => {
    try {
      const postRef = firestore().collection('posts').doc(postId);
      const postDoc = await postRef.get();
      const congratulatedBy = postDoc.data()?.congratulatedBy || [];

      if (congratulatedBy.includes(currentUserId)) {
      
        await postRef.update({
          congratsCount: firestore.FieldValue.increment(-1),
          congratulatedBy: firestore.FieldValue.arrayRemove(currentUserId),
        });
      } else {
        await postRef.update({
          congratsCount: firestore.FieldValue.increment(1),
          congratulatedBy: firestore.FieldValue.arrayUnion(currentUserId),
        });

        const currentUser = auth().currentUser;
        const username = currentUser?.displayName || 'a user';
        const message = `Your post was congratulated by ${username}`;
        await sendNotification(postCreatorId, 'congratulate', message);
      }
    } catch (error) {
      console.error('Error congratulating/undoing congratulate:', error);
    }
  };

  const handleEncourage = async (postId, postCreatorId) => {
    try {
      const postRef = firestore().collection('posts').doc(postId);
      const postDoc = await postRef.get();
      const encouragedBy = postDoc.data()?.encouragedBy || [];

      if (encouragedBy.includes(currentUserId)) {

        await postRef.update({
          encourageCount: firestore.FieldValue.increment(-1),
          encouragedBy: firestore.FieldValue.arrayRemove(currentUserId),
        });
      } else {
  
        await postRef.update({
          encourageCount: firestore.FieldValue.increment(1),
          encouragedBy: firestore.FieldValue.arrayUnion(currentUserId),
        });

        const currentUser = auth().currentUser;
        const username = currentUser?.displayName || 'a user';
        const message = `Your post was encouraged by ${username}`;
        await sendNotification(postCreatorId, 'encourage', message);
      }
    } catch (error) {
      console.error('Error encouraging/undoing encourage:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0C3B2E" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Timeline" showBackButton={false} />

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

            <View style={styles.interactionContainer}>
              <TouchableOpacity
                style={styles.interactionButton}
                onPress={() => handleLike(item.id, item.userId)}
              >
                <Icon
                  name="thumb-up"
                  size={20}
                  color={item.likedBy?.includes(currentUserId) ? '#CCCCCC' : '#FFBA00'}
                />
                <Text style={styles.interactionText}>{item.likesCount || 0}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.interactionButton}
                onPress={() => handleCongratulate(item.id, item.userId)}
              >
                <Icon
                  name="party-popper"
                  size={20}
                  color={item.congratulatedBy?.includes(currentUserId) ? '#CCCCCC' : '#FFBA00'}
                />
                <Text style={styles.interactionText}>{item.congratsCount || 0}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.interactionButton}
                onPress={() => handleEncourage(item.id, item.userId)}
              >
                <Icon
                  name="hand-heart"
                  size={20}
                  color={item.encouragedBy?.includes(currentUserId) ? '#CCCCCC' : '#FFBA00'}
                />
                <Text style={styles.interactionText}>{item.encourageCount || 0}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts found.</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePostScreen')}
      >
        <Icon name="plus" size={24} color="#0C3B2E" />
      </TouchableOpacity>
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
    paddingTop: 0,
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
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionText: {
    fontSize: 14,
    color: '#FFBA00',
    marginLeft: 4,
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
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFBA00',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default TimelineScreen;