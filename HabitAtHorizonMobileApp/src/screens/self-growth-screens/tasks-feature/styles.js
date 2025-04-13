import { StyleSheet } from 'react-native';

export const createTaskScreen = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      padding: 20,
      paddingBottom: 40,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: '#6D9773',
    },
    input: {
      flex: 1,
      height: 50,
      color: '#000000',
      fontSize: 16,
      paddingHorizontal: 10,
    },
    inputIcon: {
      marginRight: 10,
    },
    picker: {
      flex: 1,
      height: 50,
      color: '#000000',
    },
    yellowButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFBA00',
      padding: 15,
      borderRadius: 8,
    },
    smallYellowButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFBA00',
      padding: 12,
      borderRadius: 8,
      marginLeft: 10,
      minWidth: 80,
    },
    largeYellowButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFBA00',
      padding: 15,
      borderRadius: 8,
      marginTop: 20,
    },
    yellowButtonText: {
      color: '#0C3B2E',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    smallYellowButtonText: {
      color: '#0C3B2E',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 5,
    },
    largeYellowButtonText: {
      color: '#0C3B2E',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    buttonIcon: {
      marginRight: 5,
    },
    subtaskInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    subtaskList: {
      marginBottom: 20,
    },
    subtaskItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#6D9773',
    },
    subtaskText: {
      fontSize: 16,
      color: '#000000',
      flex: 1,
    },
    completedSubtask: {
      textDecorationLine: 'line-through',
      color: '#888',
    },
    deleteSubtask: {
      color: '#FF0000',
      fontSize: 14,
      fontWeight: 'bold',
      marginLeft: 15,
    },
  });

  export const taskDetailsScreenStyle = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      padding: 20,
      paddingBottom: 40,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: '#6D9773',
    },
    input: {
      flex: 1,
      height: 50,
      color: '#000000',
      fontSize: 16,
      paddingHorizontal: 10,
    },
    inputIcon: {
      marginRight: 10,
    },
    picker: {
      flex: 1,
      height: 50,
      color: '#000000',
    },
    yellowButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFBA00',
      padding: 15,
      borderRadius: 8,
      marginBottom: 15,
    },
    updateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#6D9773',
      padding: 15,
      borderRadius: 8,
      marginBottom: 15,
    },
    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#E74C3C',
      padding: 15,
      borderRadius: 8,
    },
    yellowButtonText: {
      color: '#0C3B2E',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    updateButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    deleteButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    buttonIcon: {
      marginRight: 5,
    },
  });


  export const taskListScreenStyle = StyleSheet.create({
    container: {
      flex: 1,
    },
    flatListContent: {
      padding: 10,
    },
    taskItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#6D9773',
      backgroundColor: '#FFFFFF',
      marginVertical: 5,
      borderRadius: 10,
      elevation: 3,
    },
    overdueTask: {
      backgroundColor: '#FFE5E5', 
      borderLeftWidth: 5,
      borderLeftColor: '#FF6B6B', 
    },
    taskDetails: {
      flex: 1,
    },
    taskTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#0C3B2E',
    },
    taskDueDate: {
      fontSize: 14,
      color: '#666',
    },
    taskPriority: {
      fontSize: 14,
      fontWeight: '600',
    },
    taskCategory: {
      fontSize: 14,
      color: '#666',
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
    buttonsContainer: {
      flexDirection: 'row',
    },
    smallButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  export const viewTaskScreenStyle = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    card: {
      backgroundColor: 'rgba(26, 74, 60, 0.7)',
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#FFBA00',
    },
    description: {
      fontSize: 16,
      color: '#FFFFFF',
      marginBottom: 20,
      lineHeight: 24,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    detailIcon: {
      marginRight: 15,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFBA00',
      marginBottom: 2,
    },
    sectionValue: {
      fontSize: 16,
      color: '#FFFFFF',
    },
    subtaskItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(109, 151, 115, 0.5)',
    },
    subtaskIcon: {
      marginRight: 10,
    },
    subtaskText: {
      fontSize: 16,
      color: '#FFFFFF',
      flex: 1,
    },
    completedSubtask: {
      textDecorationLine: 'line-through',
      color: '#AAAAAA',
    },
    emptyText: {
      fontSize: 16,
      color: '#FFFFFF',
      textAlign: 'center',
      marginVertical: 10,
      fontStyle: 'italic',
    },
    completeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFBA00',
      padding: 15,
      borderRadius: 8,
      marginBottom: 15,
    },
    completeButtonText: {
      color: '#0C3B2E',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#E74C3C',
      padding: 15,
      borderRadius: 8,
    },
    deleteButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    buttonIcon: {
      marginRight: 5,
    },
  });