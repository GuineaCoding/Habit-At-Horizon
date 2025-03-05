import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const CreatePostScreen = ({ navigation }) => {
  const [postContent, setPostContent] = useState('');

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      Alert.alert('Error', 'Post content cannot be empty.');
      return;
    }

    const userId = auth().currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    try {
      await firestore().collection('posts').add({
        userId,
        content: postContent,
        likesCount: 0,
        commentsCount: 0,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Post created successfully!');
      setPostContent('');
      navigation.goBack(); 
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        value={postContent}
        onChangeText={setPostContent}
        multiline
      />
      <Button title="Create Post" onPress={handleCreatePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
});

export default CreatePostScreen;