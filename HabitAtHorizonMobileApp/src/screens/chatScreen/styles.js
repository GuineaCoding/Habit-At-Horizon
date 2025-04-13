import { StyleSheet } from 'react-native';

export const chatScreenStyle = StyleSheet.create({

    container: {
        flex: 1,
    },
    messagesContainer: {
        padding: 10,
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        maxWidth: '80%',
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#ECECEC',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        maxWidth: '80%',
    },
    messageText: {
        fontSize: 16,
        color: '#000',
    },
    timestamp: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#1A4A3C',
        borderTopWidth: 1,
        borderTopColor: '#6D9773',
    },
    input: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 10,
        marginRight: 10,
        color: '#000',
    },
    sendButton: {
        backgroundColor: '#FFBA00',
        padding: 10,
        borderRadius: 20,
    },
    sendButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export const notificationsScreenStyle = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        elevation: 2,
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    notificationMessage: {
        fontSize: 14,
        color: '#555555',
        marginTop: 4,
    },
    notificationTimestamp: {
        fontSize: 12,
        color: '#777777',
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
});

export const userListScreenStyle = StyleSheet.create({

    container: {
        flex: 1,
    },
    listContent: {
        padding: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        color: '#000000',
    },
    searchResultsContainer: {
        padding: 10,
    },
    searchResultsTitle: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    userItem: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#1A4A3C',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#6D9773',
    },
    userName: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    userRole: {
        fontSize: 14,
        color: '#FFBA00',
    },
});