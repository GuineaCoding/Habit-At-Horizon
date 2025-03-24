import React, { useState, useEffect } from 'react';
import { Badge } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const NotificationBadge = ({ userId }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) return; 

    const unsubscribe = firestore()
      .collection('notifications')
      .where('userId', '==', userId)
      .where('seen', '==', false)
      .onSnapshot(
        (snapshot) => {
          const newCount = snapshot.empty ? 0 : snapshot.size;
          setCount(newCount);
        },
        (error) => console.error('Notification error:', error)
      );

    return () => unsubscribe();
  }, [userId]);

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