import React, { useState, useEffect } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import NotificationBadge from './NotificationBadge';

const CustomAppBar = ({ title, showBackButton = false }) => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const userId = auth().currentUser?.uid;

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleBellPress = () => {
    markNotificationsAsSeen(userId);
    navigation.navigate('NotificationsScreen');
  };

  const markNotificationsAsSeen = async (userId) => {
    try {
      const notificationsRef = firestore()
        .collection('notifications')
        .where('userId', '==', userId)
        .where('seen', '==', false);

      const snapshot = await notificationsRef.get();
      const batch = firestore().batch();

      snapshot.forEach((doc) => {
        batch.update(doc.ref, { seen: true });
      });

      await batch.commit();
      console.log('All notifications marked as seen.');
    } catch (error) {
      console.error('Error marking notifications as seen:', error);
    }
  };

  const menuItems = [
    { title: 'My Personal Space', icon: 'account', onPress: () => navigation.navigate('PersonalSpaceScreen') },
    { title: 'Mentoring Space', icon: 'school', onPress: () => navigation.navigate('MentorshipScreen') },
    { title: 'Mentee Space', icon: 'account-group', onPress: () => navigation.navigate('MenteesDashboardScreen') },
    { title: 'Logout', icon: 'logout', onPress: handleLogout },
  ];

  return (
    <Appbar.Header style={styles.appbar}>
      {showBackButton && (
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#FFFFFF" />
      )}
      <Appbar.Content title={title} titleStyle={styles.appbarTitle} />

      <View style={styles.iconContainer}>
        <Appbar.Action
          icon="message"
          color="#FFFFFF"
          onPress={() => navigation.navigate('UserListScreen')}
          style={styles.icon}
        />
      </View>

      <View style={styles.iconContainer}>
        <Appbar.Action
          icon="bell"
          color="#FFFFFF"
          onPress={handleBellPress}
          style={styles.icon}
        />
        <NotificationBadge
          collectionName="notifications"
          conditionField="userId"
          conditionValue={userId}
          countField="seen"
          countCondition={false} 
        />
      </View>

      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action icon="menu" color="#FFFFFF" onPress={openMenu} />
        }
        contentStyle={styles.menuContent}
      >
        {menuItems.map((item, index) => (
          <Menu.Item
            key={index}
            onPress={() => {
              item.onPress();
              closeMenu();
            }}
            title={item.title}
            titleStyle={styles.menuItemTitle}
            icon={item.icon}
          />
        ))}
      </Menu>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: '#0C3B2E',
    elevation: 4,
  },
  appbarTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconContainer: {
    position: 'relative',
    marginHorizontal: 8,
  },
  icon: {
    margin: 0,
  },
  menuContent: {
    backgroundColor: '#1A4A3C',
  },
  menuItemTitle: {
    color: '#FFFFFF',
  },
});

export default CustomAppBar;