import { StyleSheet } from 'react-native';

export const createPostScreenStyle = StyleSheet.create({

    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 20,
    },
    loadingText: {
        color: '#FFBA00',
        fontSize: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 18,
        marginBottom: 20,
        color: '#FFFFFF',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#FFBA00',
    },
    paragraph: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 10,
        color: '#FFFFFF',
        lineHeight: 24,
    },
    listItem: {
        fontSize: 16,
        marginLeft: 20,
        marginBottom: 5,
        color: '#FFFFFF',
    },
    webview: {
        height: 400,
        marginVertical: 20,
        borderRadius: 8,
    },
    youtubeContainer: {
        height: 200,
        marginVertical: 20,
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    fullScreenImage: {
        width: '100%',
        height: '100%',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: '#FFBA00',
        padding: 10,
        borderRadius: 8,
    },
    modalCloseButtonText: {
        color: '#0C3B2E',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 20,
    },
    contentItem: {
        marginBottom: 20,
    },
    contentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFBA00',
        marginBottom: 10,
    },
});

export const testViewScreenStyle = StyleSheet.create({

    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 20,
    },
    questionContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#0C3B2E',
    },
    questionDetail: {
        fontSize: 16,
        marginBottom: 10,
        color: '#6D9773',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
    },
    checked: {
        backgroundColor: '#FFBA00',
    },
    checkboxText: {
        fontSize: 16,
        color: '#0C3B2E',
    },
    input: {
        minHeight: 80,
        borderWidth: 1,
        borderColor: '#6D9773',
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 5,
        textAlignVertical: 'top',
        color: '#0C3B2E',
        backgroundColor: '#FFFFFF',
    },
    submitButton: {
        backgroundColor: '#FFBA00',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    submitButtonText: {
        color: '#0C3B2E',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#FF0000',
        fontSize: 16,
        textAlign: 'center',
    },
});