import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
        navigation.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        });
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

  
    const goToMyPersonalSpace = () => {
        navigation.navigate('MyPersonalSpace'); 
    };

    const goToMentoring = () => {
        navigation.navigate('MentorshipScreen'); 
    };

    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Home Screen" />
          <Appbar.Action icon="menu" color="black" onPress={openMenu} />
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={<Text style={{ color: 'white', marginRight: 20 }}>Menu</Text>}>
            <Menu.Item onPress={handleLogout} title="Logout" />
          </Menu>
        </Appbar.Header>
        <View style={styles.listContainer}>
          <TouchableOpacity style={styles.listItem} onPress={goToMyPersonalSpace}>
            <Text style={styles.listText}>My Personal Space</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={goToMentoring}>
            <Text style={styles.listText}>Mentoring Space</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={goToMentoring}>
            <Text style={styles.listText}>Mentee Space</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    listContainer: {
      marginTop: 20,
    },
    listItem: {
      padding: 15,
      backgroundColor: '#E0E0E0',
      borderBottomWidth: 1,
      borderColor: '#CCCCCC',
    },
    listText: {
      fontSize: 18,
    },
});

export default HomeScreen;
