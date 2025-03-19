import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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