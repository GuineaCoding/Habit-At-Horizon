import { StyleSheet } from 'react-native';

// Styles for MenteeBoardsList
export const menteeBoardsListStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        padding: 20,
    },
    boardItem: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    boardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0C3B2E',
    },
    boardCreator: {
        fontSize: 14,
        color: '#6D9773',
        marginTop: 5,
    },
    loadingText: {
        color: '#FFBA00',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    emptyText: {
        color: '#FFBA00',
        fontSize: 16,
        textAlign: 'center',
    },
});

// Styles for MenteeCheckedTestScreen
export const menteeCheckedTestScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    passStatus: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    responseContainer: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    questionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    feedback: {
        fontSize: 16,
        marginTop: 5,
    },
});