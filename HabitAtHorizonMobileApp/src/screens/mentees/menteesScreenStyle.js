import { StyleSheet } from 'react-native';

// Styles for MenteeBoardsList
export const menteeBoardsListStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#FFFFFF',
        marginTop: 20,
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyTitle: {
        color: '#FFBA00',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
    },
    emptySubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
    listContainer: {
        padding: 15,
    },
    boardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6D9773',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#6D9773',
    },
    boardIcon: {
        marginRight: 15,
    },
    boardTextContainer: {
        flex: 1,
    },
    boardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    boardCreator: {
        fontSize: 14,
        color: '#FFBA00',
        marginBottom: 5,
    },
    boardDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
    }
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

// Styles for MenteeLessonBoardsScreen
export const menteeLessonBoardsScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0C3B2E',
    },
    tabView: {
        flex: 1,
    },
    gradientContainer: {
        flex: 1,
    },
    scene: {
        flex: 1,
    },
    tabBar: {
        backgroundColor: '#6D9773',
        elevation: 0,
        shadowOpacity: 0,
    },
    tabLabel: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textTransform: 'none',
    },
    tabIndicator: {
        backgroundColor: '#FFBA00',
        height: 3,
    },
    listContainer: {
        padding: 15,
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 12,
        backgroundColor: 'rgba(109, 151, 115, 0.8)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    icon: {
        marginRight: 15,
        color: '#FFBA00',
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    cardContent: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    statusText: {
        fontSize: 14,
        color: '#FFBA00',
        fontStyle: 'italic',
    },
    messageItem: {
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        maxWidth: '80%',
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#FFBA00',
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#6D9773',
    },
    messageUsername: {
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 4,
        color: '#0C3B2E',
    },
    messageText: {
        fontSize: 14,
        color: '#0C3B2E',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#0C3B2E',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    input: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        color: '#0C3B2E',
    },
    sendButton: {
        backgroundColor: '#FFBA00',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 16,
        textAlign: 'center',
    },
});

// Styles for MenteesDashboardScreen

export const menteesDashboardScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#FFBA00',
        borderRadius: 8,
        padding: 15,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#0C3B2E',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonEnhanced: {
        paddingVertical: 20,
        marginBottom: 30,
    },
    buttonSubtext: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
    },
    featuresContainer: {
        width: '100%',
        marginTop: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    featureEmoji: {
        fontSize: 24,
        marginRight: 15,
    },
    featureText: {
        color: 'white',
        fontSize: 16,
        flex: 1,
    }
});



// Styles for MenteeTestResultScreen
export const menteeTestResultScreenStyles = StyleSheet.create({
    container: {
        flex: 1, 
    },
    content: {
        padding: 20, 
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFBA00', 
        marginBottom: 20,
        textAlign: 'center', 
    },
    feedback: {
        fontSize: 16,
        color: '#FFFFFF', 
        marginBottom: 20,
        lineHeight: 24, 
    },
    responseContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFBA00', 
    },
    questionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFBA00', 
        marginBottom: 10,
    },
});