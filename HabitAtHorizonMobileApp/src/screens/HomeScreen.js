import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Appbar, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Home Screen" />
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action icon="menu" color="white" onPress={openMenu} />
          }>
          <Menu.Item onPress={handleLogout} title="Logout" />
        </Menu>
      </Appbar.Header>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.header}>Home Screen </Text>
          <Text>
            Test
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;
