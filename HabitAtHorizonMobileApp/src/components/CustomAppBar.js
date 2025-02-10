import React, { useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const CustomAppBar = ({ title, showBackButton = false, menuItems = [] }) => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

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

  return (
    <Appbar.Header style={styles.appbar}>
   
      {showBackButton && (
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#FFFFFF" />
      )}
      <Appbar.Content title={title} titleStyle={styles.appbarTitle} />
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action icon="menu" color="#FFFFFF" onPress={openMenu} />
        }>
        {menuItems.map((item, index) => (
          <Menu.Item key={index} onPress={item.onPress} title={item.title} />
        ))}
        <Menu.Item onPress={handleLogout} title="Logout" />
      </Menu>
    </Appbar.Header>
  );
};

const styles = {
  appbar: {
    backgroundColor: '#0C3B2E',
  },
  appbarTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
};

export default CustomAppBar;