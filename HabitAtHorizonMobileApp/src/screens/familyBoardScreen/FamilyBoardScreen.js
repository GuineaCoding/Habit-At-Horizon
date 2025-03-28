import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import CustomAppBar from '../../components/CustomAppBar';
import { familyBoardStyles as styles } from './FamilyBoardStyle';

const FamilyBoardScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'boards', title: 'Boards' },
    { key: 'invitations', title: 'Invitations' },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [loading, setLoading] = useState(true);
  const [invitations, setInvitations] = useState([]);
  const [boards, setBoards] = useState([]);
  const userId = auth().currentUser?.uid;

  // Fetch user's boards
  useEffect(() => {
    const unsubscribeBoards = firestore()
      .collection('familyBoards')
      .where(`members.${userId}`, '!=', null)
      .onSnapshot(snapshot => {
        const boardsData = [];
        snapshot.forEach(doc => {
          boardsData.push({ id: doc.id, ...doc.data() });
        });
        setBoards(boardsData);
        setLoading(false);
      });

    return () => unsubscribeBoards();
  }, [userId]);

  // Fetch user's invitations
  useEffect(() => {
    if (!userId) return;

    const unsubscribeInvitations = firestore()
      .collection('familyBoards')
      .where(`pendingMembers.${userId}`, '==', true)
      .onSnapshot(snapshot => {
        const invites = [];
        snapshot.forEach(doc => {
          invites.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setInvitations(invites);
      });

    return () => unsubscribeInvitations();
  }, [userId]);

  const createBoard = async () => {
    if (!boardName.trim()) return;

    try {
      // Get current user's data
      const userDoc = await firestore()
        .collection('users')
        .doc(userId)
        .get();
      
      const userData = userDoc.data();

      const newBoard = {
        name: boardName,
        createdBy: userId,
        creatorName: userData?.name || 'User',
        creatorUsername: userData?.username || `user_${userId.slice(0, 4)}`,
        members: {
          [userId]: 'admin'
        },
        membersData: {
          [userId]: {
            username: userData?.username || `user_${userId.slice(0, 4)}`,
            name: userData?.name || 'User',
            email: userData?.email || '',
          }
        },
        createdAt: firestore.FieldValue.serverTimestamp()
      };

      await firestore().collection('familyBoards').add(newBoard);
      setShowCreateModal(false);
      setBoardName('');
      Alert.alert('Success', 'Board created successfully!');
    } catch (error) {
      console.error('Error creating board:', error);
      Alert.alert('Error', 'Failed to create board');
    }
  };

  const deleteBoard = async (boardId) => {
    try {
      await firestore().collection('familyBoards').doc(boardId).delete();
      Alert.alert('Success', 'Board deleted successfully');
    } catch (error) {
      console.error('Error deleting board:', error);
      Alert.alert('Error', 'Failed to delete board');
    }
  };

  const confirmDeleteBoard = (boardId, boardName) => {
    Alert.alert(
      'Delete Board',
      `Are you sure you want to delete "${boardName}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteBoard(boardId),
        },
      ],
      { cancelable: true }
    );
  };

  const handleAcceptInvitation = async (boardId) => {
    try {
      const boardRef = firestore().collection('familyBoards').doc(boardId);
      
      // Add user as member and remove from pending
      await boardRef.update({
        [`members.${userId}`]: 'member',
        [`pendingMembers.${userId}`]: firestore.FieldValue.delete()
      });
      Alert.alert('Success', 'Invitation accepted!');
    } catch (error) {
      console.error('Error accepting invitation:', error);
      Alert.alert('Error', 'Failed to accept invitation');
    }
  };

  const handleDeclineInvitation = async (boardId) => {
    try {
      const boardRef = firestore().collection('familyBoards').doc(boardId);
      
      // Remove user from pending members
      await boardRef.update({
        [`pendingMembers.${userId}`]: firestore.FieldValue.delete()
      });
      Alert.alert('Success', 'Invitation declined');
    } catch (error) {
      console.error('Error declining invitation:', error);
      Alert.alert('Error', 'Failed to decline invitation');
    }
  };

  const BoardsTab = () => (
    <View style={styles.tabContainer}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFBA00" />
        </View>
      ) : (
        <FlatList
          data={boards}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.boardCard}>
              <TouchableOpacity 
                style={styles.boardContent}
                onPress={() => navigation.navigate('BoardDetailScreen', { 
                  boardId: item.id,
                  boardName: item.name 
                })}
              >
                <View style={styles.boardHeader}>
                  <Text style={styles.boardName}>{item.name}</Text>
                  {item.members[userId] === 'admin' && (
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => confirmDeleteBoard(item.id, item.name)}
                    >
                      <Icon name="delete" size={20} color="#FF0000" />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.boardInfo}>
                  Created by: {item.creatorName || item.creatorUsername || 'User'}
                </Text>
                <Text style={styles.boardInfo}>Members: {Object.keys(item.members).length}</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No boards found. Create one!</Text>
          }
        />
      )}
    </View>
  );

  const InvitationsTab = () => (
    <View style={styles.tabContainer}>
      <FlatList
        data={invitations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.invitationCard}>
            <Text style={styles.invitationTitle}>Invitation to: {item.name}</Text>
            <Text style={styles.invitationText}>
              Created by: {item.creatorName || item.creatorUsername || 'User'}
            </Text>
            <Text style={styles.invitationText}>You've been invited to join this family board</Text>
            <View style={styles.invitationButtons}>
              <TouchableOpacity 
                style={[styles.invitationButton, styles.declineButton]}
                onPress={() => handleDeclineInvitation(item.id)}
              >
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.invitationButton, styles.acceptButton]}
                onPress={() => handleAcceptInvitation(item.id)}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No pending invitations</Text>
        }
      />
    </View>
  );

  const renderScene = SceneMap({
    boards: BoardsTab,
    invitations: InvitationsTab,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor="#FFBA00"
      inactiveColor="#FFFFFF"
    />
  );

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Family Boards" showBackButton={true} />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
      />

      {/* Create Board Modal */}
      <Modal
        visible={showCreateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Board</Text>
            <TextInput
              style={styles.input}
              placeholder="Board name"
              placeholderTextColor="#ffffff"
              value={boardName}
              onChangeText={setBoardName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.createButton, !boardName.trim() && styles.disabledButton]}
                onPress={createBoard}
                disabled={!boardName.trim()}
              >
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating Action Button - Only show on Boards tab */}
      {index === 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowCreateModal(true)}
        >
          <Icon name="plus" size={24} color="#0C3B2E" />
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

export default FamilyBoardScreen;