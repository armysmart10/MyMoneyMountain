// client/src/services/firestoreService.js
import { firestore, auth } from '../firebase';

const db = firestore;

export const addFinancialGoal = async (goal) => {
  const user = auth.currentUser;
  if (user) {
    const docRef = await db.collection('users').doc(user.uid).collection('goals').add(goal);
    return docRef;
  } else {
    throw new Error('User is not authenticated');
  }
};

export const getFinancialGoals = async () => {
  const user = auth.currentUser;
  if (user) {
    const snapshot = await db.collection('users').doc(user.uid).collection('goals').get();
    const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return goals;
  } else {
    throw new Error('User is not authenticated');
  }
};
