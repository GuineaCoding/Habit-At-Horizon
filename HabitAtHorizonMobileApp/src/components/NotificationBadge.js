import React, { useState, useEffect } from 'react';
import { Badge } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const NotificationBadge = ({ collectionName, conditionField, conditionValue, countField, countCondition }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!conditionValue) {
      console.log('Condition value is missing. Cannot query Firestore.');
      return;
    }

    console.log(`Querying ${collectionName} where ${conditionField} == ${conditionValue}`);

    const query = firestore()
      .collection(collectionName)
      .where(conditionField, '==', conditionValue)
      .where(countField, '==', countCondition);

    const unsubscribe = query.onSnapshot(
      (snapshot) => {
        const totalCount = snapshot.size;
        console.log(`Total unseen notifications: ${totalCount}`);
        setCount(totalCount);
      },
      (error) => {
        console.error('Error fetching snapshot:', error);
      }
    );

    return () => unsubscribe();
  }, [collectionName, conditionField, conditionValue, countField, countCondition]);

  console.log(`Rendering badge with count: ${count}`);

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