import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, TouchableOpacity, Text, Image, ActivityIndicator, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker'; 
import CustomAppBar from '../../components/CustomAppBar'; 

const CreatePostScreen = ({ navigation }) => {
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsername = async () => {
    const userId = auth().currentUser?.uid;
    if (!userId) return;

    const userDoc = await firestore().collection('users').doc(userId).get();
    if (userDoc.exists) {
      setUsername(userDoc.data().username);
    }
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error:', response.error);
        Alert.alert('Error', 'Failed to pick image.');
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      }
    });
  };

  const handleCreatePost = async () => {
    if (!postTitle.trim()) {
      Alert.alert('Error', 'Post title cannot be empty.');
      return;
    }

    const userId = auth().currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    setLoading(true);

    try {
      const postData = {
        userId,
        username,
        title: postTitle,
        description: postDescription,
        imageUrl: imageUri || null,
        youtubeUrl: youtubeUrl || null,
        likesCount: 0,
        commentsCount: 0,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('posts').add(postData);

      Alert.alert('Success', 'Post created successfully!');
      setPostTitle('');
      setPostDescription('');
      setImageUri(null);
      setYoutubeUrl('');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>

      <CustomAppBar
        title="Create Post"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.usernameText}>Posting as: {username}</Text>

        <TextInput
          style={styles.input}
          placeholder="Post Title *"
          placeholderTextColor="#FFFFFF" 
          value={postTitle}
          onChangeText={setPostTitle}
        />

        <TextInput
          style={styles.longInput}
          placeholder="Description (optional)"
          placeholderTextColor="#FFFFFF" 
          value={postDescription}
          onChangeText={setPostDescription}
          multiline
          numberOfLines={6} 
        />

        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Icon name="image" size={24} color="#FFBA00" />
          <Text style={styles.uploadButtonText}>Upload Image</Text>
        </TouchableOpacity>

        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
        )}

        <TextInput
          style={styles.input}
          placeholder="Paste YouTube URL (optional)"
          placeholderTextColor="#FFFFFF" 
          value={youtubeUrl}
          onChangeText={setYoutubeUrl}
        />

        <TouchableOpacity
          style={styles.createPostButton}
          onPress={handleCreatePost}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.createPostButtonText}>Create Post</Text>
          )}
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
    flexGrow: 1,
    padding: 16,
  },
  usernameText: {
    fontSize: 18, 
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFBA00',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  longInput: {
    borderWidth: 1,
    borderColor: '#FFBA00',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#FFFFFF', 
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    textAlignVertical: 'top', 
    height: 150, 
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 186, 0, 0.2)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#FFBA00',
    marginLeft: 8,
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  createPostButton: {
    backgroundColor: '#FFBA00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createPostButtonText: {
    fontSize: 18,
    color: '#0C3B2E',
    fontWeight: 'bold',
  },
});

export default CreatePostScreen;