import React, { useState, useMemo } from 'react';
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
// Define the items in the dropdown menu with navigation handlers
  const menuItems = useMemo(() => [
    { title: 'My Personal Space', icon: 'account', onPress: () => navigation.navigate('PersonalSpaceScreen') },
    { title: 'Mentoring Space', icon: 'school', onPress: () => navigation.navigate('MentorshipScreen') },
    { title: 'Mentee Space', icon: 'account-group', onPress: () => navigation.navigate('MenteesDashboardScreen') },
    { title: 'Logout', icon: 'logout', onPress: () => auth().signOut().catch(console.error) },
  ], [navigation]);

  // Marks all unseen notifications for the current user as seen in Firestore
  const markNotificationsAsSeen = async () => {
    try {
      const snapshot = await firestore()
        .collection('notifications')
        .where('userId', '==', userId)
        .where('seen', '==', false)
        .get();

      const batch = firestore().batch();
      snapshot.forEach(doc => batch.update(doc.ref, { seen: true }));
      await batch.commit();
    } catch (error) {
      console.error('Notification update error:', error);
    }
  };

  // Handles bell icon press by marking notifications as seen and navigating to Notifications screen
  const handleBellPress = () => {
    markNotificationsAsSeen();
    navigation.navigate('NotificationsScreen');
  };

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
        <NotificationBadge userId={userId} />
      </View>

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Appbar.Action icon="menu" color="#FFFFFF" onPress={() => setMenuVisible(true)} />
        }
        contentStyle={styles.menuContent}
      >
        {menuItems.map((item, index) => (
          <Menu.Item
            key={index}
            onPress={() => {
              item.onPress();
              setMenuVisible(false);
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