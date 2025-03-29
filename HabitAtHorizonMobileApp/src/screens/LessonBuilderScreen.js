import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import * as ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import CustomAppBar from '../components/CustomAppBar';

const LessonBuilderScreen = ({ route, navigation }) => {
  const { boardId, lessonId } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lessonId) {
      const fetchLesson = async () => {
        try {
          const lessonDoc = await firestore()
            .collection('boards')
            .doc(boardId)
            .collection('lessons')
            .doc(lessonId)
            .get();

          if (lessonDoc.exists) {
            const lessonData = lessonDoc.data();
            setTitle(lessonData.title);
            setDescription(lessonData.description);
            setContent(lessonData.content || []);
            setImageUri(lessonData.imageUrl || null);
          }
        } catch (error) {
          console.error('Error fetching lesson:', error);
          Alert.alert('Error', 'Could not fetch lesson data.');
        }
      };

      fetchLesson();
    }
  }, [boardId, lessonId]);

  const addElement = (type) => {
    const newElement = { id: Date.now(), type, value: '', title: '' }; 
    setContent([...content, newElement]);
  };

  const handleImageUpload = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    ImagePicker.launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error:', response.error);
        Alert.alert('Error', 'Failed to pick image.');
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
        addElement('image');
      }
    });
  };

  const deleteImage = () => {
    setImageUri(null);
    setContent(content.filter((item) => item.type !== 'image'));
  };

  const formatUrl = (url) => {
    let cleanedUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '');
    
    if (!url.startsWith('http')) {
      return `https://www.${cleanedUrl}`;
    }
    if (url.startsWith('http://')) {
      return `https://${cleanedUrl}`;
    }
    return url;
  };

  const saveLesson = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    for (const item of content) {
      if ((item.type === 'youtube' || item.type === 'iframe') && !item.title) {
        Alert.alert('Error', 'Please add a title/description for all YouTube videos and iframes.');
        return;
      }
    }

    setIsLoading(true);

    try {
      let imageUrl = imageUri;

      if (imageUri && !imageUri.startsWith('http')) {
        const uploadUri = imageUri;
        const filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
        const reference = storage().ref(`lesson-images/${filename}`);

        await reference.putFile(uploadUri);
        imageUrl = await reference.getDownloadURL();
      }

      const formattedContent = content.map(item => {
        if (item.type === 'iframe' && item.value) {
          return {...item, value: formatUrl(item.value)};
        }
        return item;
      });

      const lessonData = {
        title,
        description,
        content: formattedContent,
        imageUrl,
        createdAt: new Date(),
      };

      if (lessonId) {
        await firestore()
          .collection('boards')
          .doc(boardId)
          .collection('lessons')
          .doc(lessonId)
          .update(lessonData);
      } else {
        await firestore()
          .collection('boards')
          .doc(boardId)
          .collection('lessons')
          .add(lessonData);
      }

      Alert.alert('Success', 'Lesson saved successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving lesson:', error);
      Alert.alert('Error', 'Could not save the lesson.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContentItem = (item) => {
    switch (item.type) {
      case 'heading':
      case 'paragraph':
      case 'list':
        return (
          <View key={item.id} style={styles.contentItem}>
            <Text style={styles.contentType}>{item.type}</Text>
            <TextInput
              style={styles.input}
              placeholder={`Enter ${item.type}`}
              placeholderTextColor="#888"
              value={item.value}
              onChangeText={(text) => {
                setContent(
                  content.map((c) =>
                    c.id === item.id ? { ...c, value: text } : c
                  )
                );
              }}
              multiline
            />
          </View>
        );
      case 'image':
        return (
          <View key={item.id} style={styles.contentItem}>
            <Text style={styles.contentType}>Image</Text>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity
              style={styles.deleteImageButton}
              onPress={deleteImage}
            >
              <Text style={styles.deleteImageButtonText}>Delete Image</Text>
            </TouchableOpacity>
          </View>
        );
      case 'youtube':
        return (
          <View key={item.id} style={styles.contentItem}>
            <Text style={styles.contentType}>YouTube Video</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter title/description"
              placeholderTextColor="#888"
              value={item.title}
              onChangeText={(text) => {
                setContent(
                  content.map((c) =>
                    c.id === item.id ? { ...c, title: text } : c
                  )
                );
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter YouTube Video ID"
              placeholderTextColor="#888"
              value={item.value}
              onChangeText={(text) => {
                setContent(
                  content.map((c) =>
                    c.id === item.id ? { ...c, value: text } : c
                  )
                );
              }}
            />
          </View>
        );
      case 'iframe':
        return (
          <View key={item.id} style={styles.contentItem}>
            <Text style={styles.contentType}>Website URL</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter title/description"
              placeholderTextColor="#888"
              value={item.title}
              onChangeText={(text) => {
                setContent(
                  content.map((c) =>
                    c.id === item.id ? { ...c, title: text } : c
                  )
                );
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter website URL (e.g., wix.com)"
              placeholderTextColor="#888"
              value={item.value}
              onChangeText={(text) => {
                setContent(
                  content.map((c) =>
                    c.id === item.id ? { ...c, value: text } : c
                  )
                );
              }}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar
        title={lessonId ? 'Edit Lesson' : 'Create Lesson'}
        showBackButton={true}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          style={styles.input}
          placeholder="Lesson Title"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor="#888"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <View style={styles.contentActions}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addElement('heading')}
          >
            <Text style={styles.addButtonText}>Add Heading</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addElement('paragraph')}
          >
            <Text style={styles.addButtonText}>Add Paragraph</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addElement('list')}
          >
            <Text style={styles.addButtonText}>Add List</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleImageUpload}
          >
            <Text style={styles.addButtonText}>Add Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addElement('iframe')}
          >
            <Text style={styles.addButtonText}>Add Website</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addElement('youtube')}
          >
            <Text style={styles.addButtonText}>Add YouTube Video</Text>
          </TouchableOpacity>
        </View>
        {content.map((item) => renderContentItem(item))}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: '#FFBA00' }]}
          onPress={saveLesson}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Lesson'}
          </Text>
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
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#6D9773',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#0C3B2E',
    fontSize: 16,
  },
  contentActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#FFBA00',
    padding: 10,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    marginVertical: 5,
  },
  addButtonText: {
    color: '#0C3B2E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentItem: {
    marginBottom: 15,
  },
  contentType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFBA00',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  deleteImageButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  deleteImageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LessonBuilderScreen;