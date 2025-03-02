import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export const addAccount = async (userId, accountName, accountType, balance) => {
  try {
    const docRef = await addDoc(collection(db, `users/${userId}/accounts`), {
      account_name: accountName,
      account_type: accountType,
      balance: balance,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding account:", error);
    throw error;
  }
};

export const fetchAccounts = async (userId) => {
  const querySnapshot = await getDocs(collection(db, `users/${userId}/accounts`));
  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
};

export const addTransaction = async (userId, accountId, transactionData) => {
  try {
    const docRef = await addDoc(collection(db, `users/${userId}/accounts/${accountId}/transactions`), transactionData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};

export const fetchTransactions = async (userId, accountId) => {
  const querySnapshot = await getDocs(collection(db, `users/${userId}/accounts/${accountId}/transactions`));
  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    accountId: accountId,
  }));
};

export const deleteTransaction = async (userId, accountId, transactionId) => {
  try {
    await deleteDoc(doc(db, `users/${userId}/accounts/${accountId}/transactions`, transactionId));
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

export const deleteAccount = async (userId, accountId) => {
  try {
    await deleteDoc(doc(db, `users/${userId}/accounts`, accountId));
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};
