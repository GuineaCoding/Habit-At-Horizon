import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';
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
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const goToMyPersonalSpace = () => {
    navigation.navigate('PersonalSpaceScreen');
  };

  const goToMentoring = () => {
    navigation.navigate('MentorshipScreen');
  };

  const goToMenteeScreen = () => {
    navigation.navigate('MenteesDashboardScreen');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Home Screen" titleStyle={styles.appbarTitle} />
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              icon="menu"
              color="#FFFFFF"
              onPress={openMenu}
            />
          }>
          <Menu.Item onPress={handleLogout} title="Logout" titleStyle={styles.menuItemText} />
        </Menu>
      </Appbar.Header>
      <View style={styles.listContainer}>
        <TouchableOpacity style={[styles.listItem, { backgroundColor: '#6D9773' }]} onPress={goToMyPersonalSpace}>
          <Text style={styles.listText}>My Personal Space</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.listItem, { backgroundColor: '#B46617' }]} onPress={goToMentoring}>
          <Text style={styles.listText}>Mentoring Space</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.listItem, { backgroundColor: '#FFBA00' }]} onPress={goToMenteeScreen}>
          <Text style={styles.listText}>Mentee Space</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C3B2E',
  },
  appbar: {
    backgroundColor: '#0C3B2E',
  },
  appbarTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  listItem: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    alignItems: 'center',
  },
  listText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  menuItemText: {
    color: '#0C3B2E',
  },
});

export default HomeScreen;