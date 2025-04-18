import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import LinearGradient from 'react-native-linear-gradient';
import YoutubePlayer from 'react-native-youtube-iframe';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomAppBar from '../../components/CustomAppBar';
import auth from '@react-native-firebase/auth';

import { timelineScreenStyle as styles } from './styles';

const TimelineScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);
  const currentUserId = auth().currentUser?.uid;
  const postsPerPage = 10;

  // Real-time listener for posts
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(postsPerPage)
      .onSnapshot(snapshot => {
        const updatedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          likedBy: doc.data().likedBy || [],
          congratulatedBy: doc.data().congratulatedBy || [],
          encouragedBy: doc.data().encouragedBy || []
        }));
        setPosts(updatedPosts);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setLoading(false);
      }, error => {
        console.error('Snapshot error:', error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const fetchMorePosts = async () => {
    if (loadingMore || allPostsLoaded) return;
    
    setLoadingMore(true);
    try {
      const snapshot = await firestore()
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .startAfter(lastVisible)
        .limit(postsPerPage)
        .get();

      if (snapshot.docs.length > 0) {
        const newPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          likedBy: doc.data().likedBy || [],
          congratulatedBy: doc.data().congratulatedBy || [],
          encouragedBy: doc.data().encouragedBy || []
        }));
        
        setPosts(prev => [...prev, ...newPosts]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        
        if (snapshot.docs.length < postsPerPage) {
          setAllPostsLoaded(true);
        }
      } else {
        setAllPostsLoaded(true);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const deletePost = async (postId, imageUrl) => {
    try {
      if (imageUrl && imageUrl.startsWith('https://firebasestorage.googleapis.com/')) {
        try {
          const matches = imageUrl.match(/b\/(.+)\/o/);
          if (matches && matches[1]) {
            const imagePath = decodeURIComponent(matches[1]);
            const imageRef = storage().ref(imagePath);
            
            const exists = await imageRef.getMetadata().then(() => true).catch(() => false);
            
            if (exists) {
              await imageRef.delete();
            } else {
              console.log('Image already deleted or not found, proceeding with post deletion');
            }
          }
        } catch (storageError) {
          console.log('Error deleting image, proceeding with post deletion:', storageError);
        }
      }
  
      await firestore().collection('posts').doc(postId).delete();
      
      Alert.alert('Success', 'Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', error.message || 'Failed to delete post');
    }
  };

  const confirmDelete = (postId, imageUrl) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deletePost(postId, imageUrl),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const sendNotification = async (postCreatorId, type, message) => {
    if (!currentUserId || !postCreatorId || currentUserId === postCreatorId) return;

    try {
      await firestore().collection('notifications').add({
        userId: postCreatorId,
        type,
        message,
        timestamp: firestore.FieldValue.serverTimestamp(),
        seen: false,
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const updateInteraction = async (postId, field, arrayField, postCreatorId, actionType) => {
    try {
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id !== postId) return post;
        
        const currentArray = post[arrayField] || [];
        const isActive = currentArray.includes(currentUserId);
        const countChange = isActive ? -1 : 1;
        const updatedArray = isActive
          ? currentArray.filter(id => id !== currentUserId)
          : [...currentArray, currentUserId];

        return {
          ...post,
          [field]: (post[field] || 0) + countChange,
          [arrayField]: updatedArray
        };
      }));

      const postRef = firestore().collection('posts').doc(postId);
      const currentArray = posts.find(p => p.id === postId)?.[arrayField] || [];
      const isActive = currentArray.includes(currentUserId);
      
      const updateData = {
        [field]: firestore.FieldValue.increment(isActive ? -1 : 1),
        [arrayField]: isActive
          ? firestore.FieldValue.arrayRemove(currentUserId)
          : firestore.FieldValue.arrayUnion(currentUserId)
      };

      await postRef.update(updateData);

      // Send notification if it's a new interaction
      if (!isActive) {
        const currentUser = auth().currentUser;
        const username = currentUser?.displayName || 'a user';
        const messageMap = {
          like: `Your post was liked by ${username}`,
          congratulate: `Your post was congratulated by ${username}`,
          encourage: `Your post was encouraged by ${username}`
        };
        await sendNotification(postCreatorId, actionType, messageMap[actionType]);
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      // Revert optimistic update on error
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id !== postId) return post;
        return {
          ...post,
          [field]: post[field] || 0,
          [arrayField]: post[arrayField] || []
        };
      }));
    }
  };

  const handleLike = (postId, postCreatorId) => 
    updateInteraction(postId, 'likesCount', 'likedBy', postCreatorId, 'like');

  const handleCongratulate = (postId, postCreatorId) => 
    updateInteraction(postId, 'congratsCount', 'congratulatedBy', postCreatorId, 'congratulate');

  const handleEncourage = (postId, postCreatorId) => 
    updateInteraction(postId, 'encourageCount', 'encouragedBy', postCreatorId, 'encourage');

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color="#FFBA00" />
        </View>
      );
    }

    if (!allPostsLoaded && posts.length >= postsPerPage) {
      return (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={fetchMorePosts}
          disabled={loadingMore}
        >
          <Text style={styles.loadMoreText}>Load More</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  if (loading && posts.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0C3B2E" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Timeline" showBackButton={true} />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            {/* Post header with delete button (only for creator) */}
            <View style={styles.postHeader}>
              <Text style={styles.postTitle}>{item.title}</Text>
              {item.userId === currentUserId && (
                <TouchableOpacity 
                  onPress={() => confirmDelete(item.id, item.imageUrl)}
                  style={styles.deleteButton}
                >
                  <Icon name="delete" size={20} color="#FF4444" />
                </TouchableOpacity>
              )}
            </View>

            {item.description && (
              <Text style={styles.postDescription}>{item.description}</Text>
            )}

            {item.imageUrl && (
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.postImage}
                resizeMode="cover"
                onError={() => console.log('Failed to load image')}
              />
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
                  color={(item.likedBy || []).includes(currentUserId) ? '#CCCCCC' : '#FFBA00'}
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
                  color={(item.congratulatedBy || []).includes(currentUserId) ? '#CCCCCC' : '#FFBA00'}
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
                  color={(item.encouragedBy || []).includes(currentUserId) ? '#CCCCCC' : '#FFBA00'}
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
        ListFooterComponent={renderFooter}
        onEndReached={fetchMorePosts}
        onEndReachedThreshold={0.5}
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

export default TimelineScreen;