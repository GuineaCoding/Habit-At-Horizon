import { StyleSheet } from 'react-native';

export const createNoteStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#FFFFFF',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  pickerItem: {
    color: '#000000',
  },
  button: {
    backgroundColor: '#FFBA00',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#0C3B2E',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export const editNoteStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFBA00',
    marginBottom: 10,
  },
  input: {
    fontSize: 14,
    padding: 15,
    borderWidth: 1,
    borderColor: '#6D9773',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  contentInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#FFBA00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#0C3B2E',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export const noteListStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 10,
  },
  noteItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    elevation: 3,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0C3B2E',
  },
  noteCategory: {
    fontSize: 14,
    color: '#666',
  },
  noteTags: {
    fontSize: 14,
    color: '#666',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFBA00',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    fontSize: 30,
    color: '#0C3B2E',
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  tagItem: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  selectedTagItem: {
    backgroundColor: '#FFBA00',
  },
  tagText: {
    fontSize: 16,
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'white',
  },
});

export const noteViewStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFBA00',
    marginBottom: 10,
  },
  titleContainer: {
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contentContainer: {
    padding: 15,
    borderColor: '#6D9773',
  },
  content: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  sectionContent: {
    fontSize: 16,
    color: '#FFFFFF',
    padding: 10,
  },
  button: {
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export const noteViewScreenStyle = StyleSheet.create({
 
    container: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: '#FFFFFF',
      fontSize: 16,
      marginTop: 10,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      color: '#FFFFFF',
      fontSize: 16,
      marginTop: 10,
    },
    contentContainer: {
      padding: 20,
      paddingBottom: 40,
    },
    noteCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    section: {
      marginBottom: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#0C3B2E',
      marginLeft: 8,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#0C3B2E',
      marginBottom: 5,
    },
    content: {
      fontSize: 16,
      color: '#333',
      lineHeight: 24,
    },
    metaContainer: {
      marginTop: 15,
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
      paddingTop: 15,
    },
    metaItem: {
      marginBottom: 15,
    },
    metaTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#0C3B2E',
      marginLeft: 8,
    },
    metaContent: {
      fontSize: 14,
      color: '#555',
      marginLeft: 28,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginLeft: 28,
    },
    tag: {
      backgroundColor: '#E0F2F1',
      borderRadius: 15,
      paddingHorizontal: 12,
      paddingVertical: 5,
      marginRight: 8,
      marginBottom: 8,
    },
    tagText: {
      fontSize: 12,
      color: '#00796B',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      borderRadius: 8,
      flex: 1,
      marginHorizontal: 5,
    },
    editButton: {
      backgroundColor: '#FFBA00',
    },
    deleteButton: {
      backgroundColor: '#E74C3C',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
});

export const noteListScreenStyle = StyleSheet.create({

  container: {
    flex: 1,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
  },
  priorityIndicator: {
    width: 5,
    backgroundColor: '#6D9773',
  },
  noteContent: {
    flex: 1,
    padding: 15,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0C3B2E',
    marginBottom: 5,
  },
  notePreview: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  noteMeta: {
    marginTop: 5,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#6D9773',
    marginLeft: 5,
  },
  noteActions: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  archiveButton: {
    backgroundColor: '#6D9773',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
  },
  tagsContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  tagsListContainer: {
    paddingBottom: 5,
  },
  filteredNotesContainer: {
    marginTop: 5,
  },
  filteredNotesTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    paddingHorizontal: 0,
  },
  filteredNotesListContainer: {
    paddingTop: 0,
    paddingBottom: 80,
  },
  tagItem: {
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
    paddingHorizontal: 8,  
    paddingVertical: 6,   
    margin: 4,          
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,          
    flex: 1,             
    maxWidth: '25%',      
  },
  selectedTagItem: {
    backgroundColor: '#FFBA00',
  },
  tagText: {
    color: '#0C3B2E',
    fontSize: 12,       
    flexShrink: 1,       
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFBA00',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});