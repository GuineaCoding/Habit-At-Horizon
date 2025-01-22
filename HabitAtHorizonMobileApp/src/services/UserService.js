import firestore from '@react-native-firebase/firestore';

export const findUserByUsername = async (username) => {
    const usersRef = firestore().collection('users');
    const querySnapshot = await usersRef.where('username', '==', username).get();
    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() }; 
    } else {
        throw new Error('No user found with that username');
    }
};