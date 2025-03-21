import { StyleSheet } from 'react-native';

export const createGoalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFBA00',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    color: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#6D9773',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#6D9773',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  createButton: {
    backgroundColor: '#B46617',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
  },
  dateButton: {
    backgroundColor: '#FFBA00',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  dateButtonText: {
    color: '#0C3B2E',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addMilestoneButton: {
    backgroundColor: '#6D9773',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addMilestoneButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  milestoneList: {
    marginTop: 10,
  },
  milestoneItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  milestoneDeadline: {
    fontSize: 14,
    color: '#6D9773',
  },
});

export const goalDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFBA00',
  },
  category: {
    fontSize: 16,
    color: '#B46617',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFFFFF',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#6D9773',
  },
  progressText: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 20,
  },
  milestonesHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  milestoneItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  milestoneDeadline: {
    fontSize: 14,
    color: '#B46617',
    marginTop: 5,
  },
  milestoneStatus: {
    fontSize: 14,
    color: '#FFBA00',
    marginTop: 5,
  },
  completeButton: {
    backgroundColor: '#B46617',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  completeGoalButton: {
    backgroundColor: '#FFBA00',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  completeGoalButtonText: {
    color: '#0C3B2E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export const mainGoalPageStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  goalItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0C3B2E',
  },
  goalCategory: {
    fontSize: 14,
    color: '#6D9773',
    marginTop: 5,
  },
  goalStatus: {
    fontSize: 14,
    color: '#B46617',
    marginTop: 5,
  },
  emptyText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#6D9773',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  addButtonText: {
    fontSize: 30,
    color: '#FFFFFF',
  },
  progressButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#B46617',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
  },
  progressButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tabBar: {
    backgroundColor: '#6D9773',
  },
  indicator: {
    backgroundColor: '#FFBA00',
  },
  tabLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
