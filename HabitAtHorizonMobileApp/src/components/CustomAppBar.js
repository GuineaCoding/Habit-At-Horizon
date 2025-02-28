import React, { useState, useEffect } from 'react';
import { Appbar, Menu, Badge } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet } from 'react-native';

const CustomAppBar = ({ title, showBackButton = false }) => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [unseenChatCount, setUnseenChatCount] = useState(0);
  const [unseenNotificationsCount, setUnseenNotificationsCount] = useState(0);
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

  const menuItems = [
    { title: 'My Personal Space', icon: 'account', onPress: () => navigation.navigate('PersonalSpaceScreen') },
    { title: 'Mentoring Space', icon: 'school', onPress: () => navigation.navigate('MentorshipScreen') },
    { title: 'Mentee Space', icon: 'account-group', onPress: () => navigation.navigate('MenteesDashboardScreen') },
    { title: 'Logout', icon: 'logout', onPress: handleLogout },
  ];

  useEffect(() => {
    if (!userId) return;

    const chatsRef = firestore()
      .collection('chats')
      .where('participantIds', 'array-contains', userId);

    const unsubscribeChats = chatsRef.onSnapshot((snapshot) => {
      let totalUnseen = 0;
      snapshot.forEach((doc) => {
        const chatId = doc.id;
        const messagesRef = firestore()
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .where('seen', '==', false)
          .where('senderId', '!=', userId);

        messagesRef.get().then((messagesSnapshot) => {
          totalUnseen += messagesSnapshot.size;
          setUnseenChatCount(totalUnseen);
        });
      });
    });

    return () => unsubscribeChats();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const notificationsRef = firestore()
      .collection('notifications')
      .where('userId', '==', userId)
      .where('seen', '==', false);

    const unsubscribeNotifications = notificationsRef.onSnapshot((snapshot) => {
      setUnseenNotificationsCount(snapshot.size);
    });

    return () => unsubscribeNotifications();
  }, [userId]);

  return (
    <Appbar.Header style={styles.appbar}>
      {showBackButton && (
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#FFFFFF" />
      )}
      <Appbar.Content title={title} titleStyle={styles.appbarTitle} />

      <Appbar.Action
        icon="message"
        color="#FFFFFF"
        onPress={() => navigation.navigate('UserListScreen')}
        style={styles.icon}
      />
      {unseenChatCount > 0 && (
        <Badge style={styles.badge}>{unseenChatCount}</Badge>
      )}

      <Appbar.Action
        icon="bell"
        color="#FFFFFF"
        onPress={() => navigation.navigate('NotificationsScreen')}
        style={styles.icon}
      />
      {unseenNotificationsCount > 0 && (
        <Badge style={styles.badge}>{unseenNotificationsCount}</Badge>
      )}

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
  icon: {
    marginHorizontal: 8, 
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF3B30', 
    color: '#FFFFFF',
  },
  menuContent: {
    backgroundColor: '#1A4A3C', 
  },
  menuItemTitle: {
    color: '#FFFFFF', 
  },
});

export default CustomAppBar;