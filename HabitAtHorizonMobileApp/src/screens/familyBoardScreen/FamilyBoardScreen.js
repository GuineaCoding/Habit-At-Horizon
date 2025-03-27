import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Modal, TextInput, ActivityIndicator  } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import CustomAppBar from '../../components/CustomAppBar';

const FamilyBoardScreen = ({ navigation }) => {
  const [boards, setBoards] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = auth().currentUser?.uid;

  // Fetch user's boards
  useEffect(() => {
    const unsubscribe = firestore()
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

    return () => unsubscribe();
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

  return (
    <LinearGradient colors={['#0C3B2E', '#6D9773']} style={styles.container}>
      <CustomAppBar title="Family Boards" showBackButton={true} />

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

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
      >
        <Icon name="plus" size={24} color="#0C3B2E" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default FamilyBoardScreen;