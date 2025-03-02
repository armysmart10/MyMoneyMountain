// client/src/firestore.js
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  runTransaction 
} from "firebase/firestore";
import { db } from "./firebase";

export const addAccount = async (userId, accountName, accountType, balance) => {
  try {
    const docRef = await addDoc(collection(db, `users/${userId}/accounts`), {
      account_name: accountName,
      account_type: accountType,
      balance: parseFloat(balance)
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
    id: doc.id
  }));
};

export const deleteAccount = async (userId, accountId) => {
  try {
    await deleteDoc(doc(db, `users/${userId}/accounts`, accountId));
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

export const fetchTransactions = async (userId, accountId) => {
  const querySnapshot = await getDocs(collection(db, `users/${userId}/accounts/${accountId}/transactions`));
  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    accountId: accountId
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

export const addTransactionAndUpdateBalance = async (userId, accountId, transactionData) => {
  try {
    const accountRef = doc(db, `users/${userId}/accounts`, accountId);
    await runTransaction(db, async (transaction) => {
      const accountDoc = await transaction.get(accountRef);
      if (!accountDoc.exists()) {
        throw new Error("Account does not exist!");
      }
      const currentBalance = parseFloat(accountDoc.data().balance);
      const outflow = parseFloat(transactionData.outflow) || 0;
      const inflow = parseFloat(transactionData.inflow) || 0;
      const newBalance = currentBalance - outflow + inflow;
      transaction.update(accountRef, { balance: newBalance });
      const transactionsRef = collection(db, `users/${userId}/accounts/${accountId}/transactions`);
      await addDoc(transactionsRef, transactionData);
    });
    return true;
  } catch (error) {
    console.error("Error in transaction operation:", error);
    throw error;
  }
};
