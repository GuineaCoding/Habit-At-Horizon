import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import CustomAppBar from '../../components/CustomAppBar';

import { notificationsScreenStyle as styles } from './styles';

const NotificationItem = ({ item }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (item.seen) {
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 5000, 
          useNativeDriver: true,
        }).start();
      }, 5000);

      return () => clearTimeout(timer); 
    }
  }, [item.seen]);

  return (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTimestamp}>
          {item.timestamp?.toDate().toLocaleString()}
        </Text>
      </View>
      {!item.seen && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <Icon name="fiber-new" size={24} color="#FF3B30" />
        </Animated.View>
      )}
    </TouchableOpacity>
  );
};

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth().currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      console.log('[NotificationsScreen] User ID is missing. Cannot fetch notifications.');
      setLoading(false);
      return;
    }

    console.log(`[NotificationsScreen] Fetching notifications for user: ${userId}`);

    const notificationsRef = firestore()
      .collection('notifications')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc');

    const unsubscribe = notificationsRef.onSnapshot(
      (snapshot) => {
        if (!snapshot) {
          console.log('[NotificationsScreen] Snapshot is null.');
          setLoading(false);
          return;
        }

        if (snapshot.empty) {
          console.log('[NotificationsScreen] No notifications found.');
          setNotifications([]);
          setLoading(false);
          return;
        }

        const notificationsList = [];
        snapshot.forEach((doc) => {
          notificationsList.push({ id: doc.id, ...doc.data() });
        });

        console.log('[NotificationsScreen] Notifications fetched:', notificationsList);
        setNotifications(notificationsList);
        setLoading(false);
      },
      (error) => {
        console.error('[NotificationsScreen] Error fetching notifications:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      markNotificationsAsSeen();
    });

    return unsubscribe;
  }, [navigation]);

  const markNotificationsAsSeen = async () => {
    if (!userId) {
      console.log('[NotificationsScreen] User ID is missing. Cannot mark notifications as seen.');
      return;
    }

    try {
      const notificationsRef = firestore()
        .collection('notifications')
        .where('userId', '==', userId)
        .where('seen', '==', false);

      const snapshot = await notificationsRef.get();

      if (!snapshot || snapshot.empty) {
        console.log('[NotificationsScreen] No unseen notifications to mark as seen.');
        return;
      }

      const batch = firestore().batch();
      snapshot.forEach((doc) => {
        batch.update(doc.ref, { seen: true });
      });

      await batch.commit();
      console.log('[NotificationsScreen] All notifications marked as seen.');
    } catch (error) {
      console.error('[NotificationsScreen] Error marking notifications as seen:', error);
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
      <CustomAppBar title="Notifications" showBackButton={true} onBackPress={() => navigation.goBack()} />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem item={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications found.</Text>
          </View>
        }
      />
    </LinearGradient>
  );
};

export default NotificationsScreen;