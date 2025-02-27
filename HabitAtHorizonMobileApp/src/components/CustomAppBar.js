import React, { useState } from 'react';
import { Appbar, Menu, Badge } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { StyleSheet } from 'react-native';

const CustomAppBar = ({ title, showBackButton = false }) => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [unseenChatCount, setUnseenChatCount] = useState(3); 
  const [unseenNotificationsCount, setUnseenNotificationsCount] = useState(1);

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

  return (
    <Appbar.Header style={styles.appbar}>
      {showBackButton && (
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#FFFFFF" />
      )}
      <Appbar.Content title={title} titleStyle={styles.appbarTitle} />

      {/* Chat Icon with Badge */}
      <Appbar.Action
        icon="message"
        color="#FFFFFF"
        onPress={() => navigation.navigate('ChatScreen')}
        style={styles.icon}
      />
      {unseenChatCount > 0 && (
        <Badge style={styles.badge}>{unseenChatCount}</Badge>
      )}

      {/* Notification Icon with Badge */}
      <Appbar.Action
        icon="bell"
        color="#FFFFFF"
        onPress={() => navigation.navigate('NotificationsScreen')}
        style={styles.icon}
      />
      {unseenNotificationsCount > 0 && (
        <Badge style={styles.badge}>{unseenNotificationsCount}</Badge>
      )}

      {/* Dropdown Menu */}
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