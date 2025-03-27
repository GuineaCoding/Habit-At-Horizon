import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Modal, TextInput, ActivityIndicator } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import CustomAppBar from '../../components/CustomAppBar';

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
      const newBoard = {
        name: boardName,
        createdBy: userId,
        members: {
          [userId]: 'admin'
        },
        createdAt: firestore.FieldValue.serverTimestamp()
      };

      await firestore().collection('familyBoards').add(newBoard);
      setShowCreateModal(false);
      setBoardName('');
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const handleAcceptInvitation = async (boardId) => {
    try {
      const boardRef = firestore().collection('familyBoards').doc(boardId);
      
      // Add user as member and remove from pending
      await boardRef.update({
        [`members.${userId}`]: 'member',
        [`pendingMembers.${userId}`]: firestore.FieldValue.delete()
      });
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  const handleDeclineInvitation = async (boardId) => {
    try {
      const boardRef = firestore().collection('familyBoards').doc(boardId);
      
      // Remove user from pending members
      await boardRef.update({
        [`pendingMembers.${userId}`]: firestore.FieldValue.delete()
      });
    } catch (error) {
      console.error('Error declining invitation:', error);
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
            <TouchableOpacity 
              style={styles.boardCard}
              onPress={() => navigation.navigate('BoardDetailScreen', { boardId: item.id })}
            >
              <Text style={styles.boardName}>{item.name}</Text>
              <Text style={styles.boardInfo}>Members: {Object.keys(item.members).length}</Text>
            </TouchableOpacity>
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
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Board</Text>
            <TextInput
              style={styles.input}
              placeholder="Board name"
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
                style={styles.createButton}
                onPress={createBoard}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  boardCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFBA00',
  },
  boardName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  boardInfo: {
    fontSize: 14,
    color: '#FFBA00',
    marginTop: 4,
  },
  invitationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFBA00',
  },
  invitationTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  invitationText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
    marginBottom: 12,
  },
  invitationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  invitationButton: {
    padding: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#FFBA00',
    marginLeft: 8,
  },
  declineButton: {
    backgroundColor: '#6D9773',
    marginRight: 8,
  },
  emptyText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFBA00',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1A4A3C',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFBA00',
  },
  modalTitle: {
    color: '#FFBA00',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#6D9773',
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#FFBA00',
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0C3B2E',
    fontWeight: 'bold',
  },
  tabBar: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  tabIndicator: {
    backgroundColor: '#FFBA00',
  },
  tabLabel: {
    fontWeight: 'bold',
  },
});

export default FamilyBoardScreen;