import React, { useState, useEffect } from 'react';
import { Badge } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const NotificationBadge = ({ userId }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      console.log('[NotificationBadge] User ID is missing. Cannot query Firestore.');
      return;
    }
  
    console.log(`[NotificationBadge] Logged-in user ID: ${userId}`);
  
    const query = firestore()
      .collection('notifications')
      .where('userId', '==', userId)
      .where('seen', '==', false);
  
    const unsubscribe = query.onSnapshot(
      (snapshot) => {
        if (snapshot.empty) {
          console.log('[NotificationBadge] No unseen notifications found.');
          setCount(0);
          return;
        }
  
        const totalCount = snapshot.size;
        console.log(`[NotificationBadge] Total unseen notifications: ${totalCount}`);
        setCount(totalCount);
      },
      (error) => {
        console.error('[NotificationBadge] Error fetching snapshot:', error);
      }
    );
  
    return () => {
      console.log('[NotificationBadge] Unsubscribing from Firestore listener.');
      unsubscribe();
    };
  }, [userId]); 

  console.log(`[NotificationBadge] Rendering badge with count: ${count}`);

  return count > 0 ? <Badge style={styles.badge}>{count}</Badge> : null;
};

const styles = {
  badge: {
    position: 'absolute',
    top: 5, 
    right: 5, 
    backgroundColor: '#FF3B30',
    color: '#FFFFFF',
  },
};

export default NotificationBadge;