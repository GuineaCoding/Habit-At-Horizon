import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, RefreshControl} from 'react-native';
import { WebView } from 'react-native-webview';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import YoutubePlayer from 'react-native-youtube-iframe';
import CustomAppBar from '../../components/CustomAppBar';
import { useRefreshService } from '../../components/pullRefreshScreenService';

const LessonScreen = ({ route, navigation }) => {
  const { boardId, lessonId } = route.params;
  const [lesson, setLesson] = useState(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const fetchLesson = async () => {
    const lessonRef = firestore()
      .collection('boards')
      .doc(boardId)
      .collection('lessons')
      .doc(lessonId);

    const snapshot = await lessonRef.get();
    if (snapshot.exists) {
      setLesson(snapshot.data());
    } else {
      setLesson(null);
    }
  };

  const { refreshing, onRefresh } = useRefreshService(fetchLesson);

  useEffect(() => {
    fetchLesson();
  }, [boardId, lessonId]);

  const getYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|\/embed\/|youtu\.be\/)([^"&?\/\s]{11}))/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const renderContent = (item, index) => {
    switch (item.type) {
      case 'heading':
        return (
          <Text key={index} style={styles.heading}>
            {item.value}
          </Text>
        );
      case 'paragraph':
        return (
          <Text key={index} style={styles.paragraph}>
            {item.value}
          </Text>
        );
      case 'list':
        return (
          <Text key={index} style={styles.listItem}>
            • {item.value}
          </Text>
        );
      case 'iframe':
        return (
          <View key={index} style={styles.contentItem}>
            {item.title && <Text style={styles.contentTitle}>{item.title}</Text>}
            <WebView
              style={styles.webview}
              source={{ uri: item.value }}
            />
          </View>
        );
      case 'youtube':
        console.log('YouTube URL:', item.value);
        const videoId = getYouTubeVideoId(item.value);
        console.log('Extracted videoId:', videoId);

        if (!videoId) {
          console.error('Invalid YouTube URL or videoId:', item.value);
          return (
            <View key={index} style={styles.youtubeContainer}>
              <Text style={styles.errorText}>Invalid YouTube video URL</Text>
            </View>
          );
        }

        return (
          <View key={index} style={styles.contentItem}>
            {item.title && <Text style={styles.contentTitle}>{item.title}</Text>}
            <YoutubePlayer
              height={200}
              videoId={videoId}
              onError={(error) => console.error('YouTube playback error:', error)}
            />
          </View>
        );
      default:
        return (
          <Text key={index} style={styles.paragraph}>
            {item.value}
          </Text>
        );
    }
  };

  if (!lesson) {
    return (
      <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
        <Text style={styles.loadingText}>Loading lesson details...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar
        title={lesson.title}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FFBA00']}
            tintColor="#FFBA00"
          />
        }
      >
        <Text style={styles.description}>{lesson.description}</Text>
        {lesson.imageUrl && (
          <TouchableOpacity onPress={() => setIsImageModalVisible(true)}>
            <Image source={{ uri: lesson.imageUrl }} style={styles.image} />
          </TouchableOpacity>
        )}
        {lesson.content && lesson.content.map(renderContent)}
      </ScrollView>
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setIsImageModalVisible(false)}
          >
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: lesson.imageUrl }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
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
  loadingText: {
    color: '#FFBA00',
    fontSize: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    color: '#FFFFFF',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#FFBA00',
  },
  paragraph: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  listItem: {
    fontSize: 16,
    marginLeft: 20,
    marginBottom: 5,
    color: '#FFFFFF',
  },
  webview: {
    height: 400,
    marginVertical: 20,
    borderRadius: 8,
  },
  youtubeContainer: {
    height: 200,
    marginVertical: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#FFBA00',
    padding: 10,
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: '#0C3B2E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
  contentItem: {
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFBA00',
    marginBottom: 10,
  },
});

export default LessonScreen;