import { StyleSheet } from 'react-native';

export const createMentorProfileScreenStyles = StyleSheet.create({

    container: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        padding: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#FFBA00',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#6D9773',
        borderRadius: 8,
        padding: 15,
        backgroundColor: '#FFFFFF',
        color: '#000000',
    },
    disabledInput: {
        borderWidth: 1,
        borderColor: '#6D9773',
        borderRadius: 8,
        padding: 15,
        backgroundColor: '#E0E0E0',
        color: '#000000',
    },
    button: {
        backgroundColor: '#FFBA00',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        color: '#0C3B2E',
        fontWeight: 'bold',
    },
    loadingText: {
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 20,
    },
});



export const mentorListPageStyle = StyleSheet.create({

    container: {
        flex: 1,
    },
    listContainer: {
        padding: 16,
    },
    mentorItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginBottom: 12,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
        resizeMode: 'cover',
    },
    profileCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    profileLetter: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    mentorInfo: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#0C3B2E',
    },
    username: {
        fontSize: 14,
        color: '#6D9773',
        marginBottom: 8,
    },
    bio: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    expertise: {
        fontSize: 14,
        color: '#B46617',
        marginBottom: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        fontSize: 12,
        color: '#FFFFFF',
        backgroundColor: '#6D9773',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
        marginBottom: 8,
    },
});


export const mentorProfileCreationStartScreenStyle = StyleSheet.create({

    container: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        padding: 20,
        alignItems: 'center',
    },
    icon: {
        marginBottom: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFBA00',
        marginBottom: 10,
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
    },
    subHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFBA00',
        marginBottom: 10,
        textAlign: 'center',
    },
    benefitsContainer: {
        marginBottom: 20,
    },
    benefitText: {
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#FFBA00',
        padding: 15,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        elevation: 3,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0C3B2E',
    },
});

export const mentorProfileViewScreenStyle = StyleSheet.create({

    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        borderWidth: 3,
        borderColor: '#FFBA00',
        resizeMode: 'cover',
    },
    profileCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        borderWidth: 3,
        borderColor: '#FFBA00',
    },
    profileLetter: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    profileInfo: {
        flex: 1,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    username: {
        fontSize: 16,
        color: '#FFBA00',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFBA00',
        marginBottom: 8,
    },
    bio: {
        fontSize: 14,
        color: '#FFFFFF',
        lineHeight: 20,
    },
    expertise: {
        fontSize: 14,
        color: '#FFFFFF',
        lineHeight: 20,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    tag: {
        fontSize: 12,
        color: '#FFFFFF',
        backgroundColor: 'rgba(109, 151, 115, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    experienceLevel: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    link: {
        fontSize: 14,
        color: '#FFBA00',
        marginBottom: 8,
        textDecorationLine: 'underline',
    },
    noProfileText: {
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 20,
    },
});



export const mentorshipScreenStyle = StyleSheet.create({

    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFBA00',
        textAlign: 'center',
        marginBottom: 30,
    },
    listContainer: {
        flexGrow: 1,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFBA00',
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    icon: {
        marginRight: 16,
        color: '#0C3B2E',
    },
    listText: {
        fontSize: 18,
        color: '#0C3B2E',
        fontWeight: '600',
    },
});