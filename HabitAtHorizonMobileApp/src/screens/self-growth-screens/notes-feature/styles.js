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