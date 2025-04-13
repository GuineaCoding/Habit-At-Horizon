import { StyleSheet } from 'react-native';

export const createPostScreenStyle = StyleSheet.create({

    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 16,
    },
    usernameText: {
        fontSize: 18,
        color: '#FFFFFF',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#FFBA00',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        fontSize: 16,
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    longInput: {
        borderWidth: 1,
        borderColor: '#FFBA00',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        fontSize: 16,
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        textAlignVertical: 'top',
        height: 150,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 186, 0, 0.2)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    uploadButtonText: {
        fontSize: 16,
        color: '#FFBA00',
        marginLeft: 8,
    },
    uploadedImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    createPostButton: {
        backgroundColor: '#FFBA00',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    createPostButtonText: {
        fontSize: 18,
        color: '#0C3B2E',
        fontWeight: 'bold',
    },
    progressContainer: {
        height: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        marginBottom: 16,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FFBA00',
    },
    progressText: {
        position: 'absolute',
        alignSelf: 'center',
        color: '#FFFFFF',
        fontSize: 12,
    },
});

export const timelineScreenStyle = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postContainer: {
        borderWidth: 1,
        borderColor: '#FFBA00',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        flex: 1,
    },
    deleteButton: {
        padding: 4,
        marginLeft: 8,
    },
    postDescription: {
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 8,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: '#DDD', // Fallback color if image fails to load
    },
    postMetadata: {
        fontSize: 12,
        color: '#FFBA00',
        marginTop: 4,
    },
    interactionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
    },
    interactionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    interactionText: {
        fontSize: 14,
        color: '#FFBA00',
        marginLeft: 4,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    footerContainer: {
        padding: 10,
        alignItems: 'center',
    },
    loadMoreButton: {
        padding: 10,
        backgroundColor: '#FFBA00',
        borderRadius: 5,
        margin: 10,
        alignItems: 'center',
    },
    loadMoreText: {
        color: '#0C3B2E',
        fontWeight: 'bold',
    },
});