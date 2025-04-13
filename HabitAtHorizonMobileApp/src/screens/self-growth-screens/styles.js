import { StyleSheet } from 'react-native';

export const createMenteeScreen = StyleSheet.create({
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
    input: {
        borderWidth: 1,
        borderColor: '#6D9773',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#FFFFFF',
        color: '#000000',
    },
    bioInput: {
        borderWidth: 1,
        borderColor: '#6D9773',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#FFFFFF',
        color: '#000000',
        height: 100,
        textAlignVertical: 'top',
    },
    checkboxContainer: {
        marginTop: 8,
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    checkboxText: {
        fontSize: 16,
        color: '#FFFFFF',
        marginLeft: 8,
    },
    button: {
        backgroundColor: '#FFBA00',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0C3B2E',
    },
    loadingText: {
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 20,
    },
});
export const menteeListScreen = StyleSheet.create({

    container: {
        flex: 1,
    },
    listContainer: {
        padding: 16,
    },
    menteeItem: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 16,
        marginBottom: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 186, 0, 0.2)',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
        borderWidth: 2,
        borderColor: '#FFBA00',
    },
    profileCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 2,
        borderColor: '#FFBA00',
    },
    profileLetter: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    menteeInfo: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFBA00',
        marginBottom: 2,
    },
    username: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.8,
        marginBottom: 8,
    },
    bio: {
        fontSize: 14,
        color: '#FFFFFF',
        marginBottom: 8,
        opacity: 0.9,
    },
    section: {
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 12,
        color: '#FFBA00',
        marginBottom: 4,
        fontWeight: '600',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        fontSize: 12,
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 186, 0, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 186, 0, 0.5)',
    },
    moreTag: {
        fontSize: 12,
        color: '#FFBA00',
        paddingVertical: 4,
    },
    emptyText: {
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});


export const menteeProfileCreationStartScreenStyle = StyleSheet.create({

    container: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        padding: 20,
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFBA00',
        marginBottom: 20,
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
        marginBottom: 20,
        textAlign: 'center',
    },
    benefitsContainer: {
        marginBottom: 20,
        width: '100%',
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    benefitIcon: {
        marginRight: 10,
    },
    benefitText: {
        fontSize: 16,
        color: '#FFFFFF',
        flex: 1,
    },
    button: {
        backgroundColor: '#FFBA00',
        padding: 15,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0C3B2E',
    },
});

export const MenteeProfileViewScreenStyle = StyleSheet.create({

    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    profileImageContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#FFBA00',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 16,
        marginBottom: 4,
    },
    username: {
        fontSize: 16,
        color: '#6D9773',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        width: '100%',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0C3B2E',
        marginBottom: 12,
    },
    bio: {
        fontSize: 14,
        color: '#0C3B2E',
        textAlign: 'center',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    tag: {
        backgroundColor: '#6D9773',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 12,
        color: '#FFFFFF',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0C3B2E',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 14,
        color: '#6D9773',
    },
    dateText: {
        fontSize: 14,
        color: '#0C3B2E',
        marginBottom: 8,
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    link: {
        fontSize: 14,
        color: '#0077B5',
        marginLeft: 8,
    },
});
export const personalSpaceScreenStyle = StyleSheet.create({

    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFBA00',
        padding: 15,
        borderRadius: 10,
        width: '90%',
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    icon: {
        marginRight: 10,
    },
    buttonText: {
        color: '#0C3B2E',
        fontSize: 18,
        fontWeight: '600',
    },
});

export const progressScreenStyle = StyleSheet.create({

    container: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFBA00',
        marginBottom: 20,
        textAlign: 'center',
    },
    infoContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        color: 'white',
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFBA00',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export const topListScreenStyle = StyleSheet.create({

    container: {
        flex: 1,
    },
    listContainer: {
        padding: 16,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
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
    rankContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    rank: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0C3B2E',
        marginLeft: 8,
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0C3B2E',
    },
    username: {
        fontSize: 14,
        color: '#6D9773',
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    points: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#B46617',
        marginLeft: 8,
    },
    loadingText: {
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
    },
});