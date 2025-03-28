import { StyleSheet } from 'react-native';

export const BoardDetailScreenStyle = StyleSheet.create({
  // Main container styles
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tab view styles
  tabContainer: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#0C3B2E',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#6D9773',
  },
  tabIndicator: {
    backgroundColor: '#FFBA00',
    height: 3,
  },
  tabLabel: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  // List container styles
  listContainer: {
    padding: 16,
  },
  emptyText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },

  // Task item styles
  taskCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFBA00',
  },
  completedTask: {
    opacity: 0.7,
    borderColor: '#6D9773',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitleContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  taskReward: {
    fontSize: 14,
    color: '#FFBA00',
    marginTop: 4,
    fontStyle: 'italic',
  },
  taskDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 8,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // Member item styles
  memberItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pendingMemberItem: {
    backgroundColor: 'rgba(255, 186, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#FFBA00',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  memberEmail: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  removeMemberButton: {
    padding: 8,
  },

  // Modal styles
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
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
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
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#0C3B2E',
    fontWeight: 'bold',
  },

  // Floating action button styles
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginBottom: 16,
  },
  taskFab: {
    backgroundColor: '#FFBA00',
  },
  inviteFab: {
    backgroundColor: '#6D9773',
  },
});

export const familyBoardStyles = StyleSheet.create({
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
    borderWidth: 1,
    borderColor: '#FFBA00',
    marginBottom: 12,
  },
  boardContent: {
    flex: 1,
  },
  boardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boardName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    flex: 1,
  },
  boardInfo: {
    fontSize: 14,
    color: '#FFBA00',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
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
    marginBottom: 4,
  },
  invitationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
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
  disabledButton: {
    opacity: 0.6,
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

export const taskViewStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  taskCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFBA00',
  },
  completedTask: {
    opacity: 0.7,
    borderColor: '#6D9773',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    flex: 1,
  },
  taskReward: {
    fontSize: 16,
    color: '#FFBA00',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  taskDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 24,
  },
  taskMeta: {
    marginBottom: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 12,
  },
  taskMetaText: {
    fontSize: 14,
    color: '#FFFFFF', 
    marginBottom: 4,
  },
  section: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFBA00',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  noteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  noteText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 4,
  },
  noteInfo: {
    color: '#FFFFFF', 
    fontSize: 12,
    opacity: 0.8,
  },
  emptyNotesText: {
    color: '#FFFFFF', 
    fontStyle: 'italic',
    marginBottom: 12,
    opacity: 0.8,
  },
  noteInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  noteInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 6,
    marginRight: 8,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  addNoteButton: {
    padding: 8,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFBA00', 
  },
  statusButtonText: {
    color: '#0C3B2E',
    fontWeight: 'bold',
    fontSize: 16,
  },
});