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

// Styles for MenteeLessonBoardsScreen
export const menteeLessonBoardsScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabView: {
        flex: 1,
    },
    gradientContainer: {
        flex: 1,
    },
    scene: {
        flex: 1,
        padding: 20,
    },
    tabBar: {
        backgroundColor: '#0C3B2E',
    },
    tabLabel: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 20,
    },
    lessonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
    },
    testItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
    },
    icon: {
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    lessonTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0C3B2E',
    },
    lessonContent: {
        fontSize: 14,
        color: '#666',
    },
    testTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0C3B2E',
    },
    testContent: {
        fontSize: 14,
        color: '#666',
    },
    testName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0C3B2E',
    },
    testStatus: {
        fontSize: 14,
        color: '#666',
    },
    messageItem: {
        padding: 10,
        marginVertical: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
    },
    messageUsername: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0C3B2E',
    },
    messageText: {
        fontSize: 14,
        color: '#0C3B2E',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#6D9773',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        color: '#0C3B2E',
    },
    sendButton: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: '#FFBA00',
        borderRadius: 8,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

// Styles for MenteesDashboardScreen
export const menteesDashboardScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: '100%',
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#FFBA00',
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0C3B2E',
    },
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