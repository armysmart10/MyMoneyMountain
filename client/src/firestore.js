import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from './firebase';

export const addAccount = async (userId, accountName, accountType, balance) => {
  try {
    await addDoc(collection(db, `users/${userId}/accounts`), {
      account_name: accountName,
      account_type: accountType,
      balance: balance,
    });
  } catch (e) {
    console.error("Error adding account: ", e);
  }
};

export const fetchAccounts = async (userId) => {
  const querySnapshot = await getDocs(collection(db, `users/${userId}/accounts`));
  const accounts = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return accounts;
};

// Add similar functions for adding and fetching transactions as needed
