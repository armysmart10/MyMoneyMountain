// client/src/firestore.js
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
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
    id: doc.id,
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

// Historical Monthly Data Helper
export const fetchHistoricalMonthlyData = async (userId, range) => {
  // Assumes that monthly snapshots are stored in the subcollection 'monthlySnapshots'
  // Each document's ID can represent the month (e.g., "2023-01") and includes a 'netWorth' field.
  const querySnapshot = await getDocs(collection(db, `users/${userId}/monthlySnapshots`));
  let snapshots = querySnapshot.docs.map(docSnap => ({
    ...docSnap.data(),
    month: docSnap.id  // The document ID represents the month.
  }));
  // Sort snapshots chronologically; adjust this as needed (for production, use proper date comparisons).
  snapshots.sort((a, b) => a.month.localeCompare(b.month));
  if (range !== "max") {
    const num = parseInt(range, 10);
    snapshots = snapshots.slice(-num);
  }
  return snapshots;
};

// Historical Daily Net Worth Helper
export const fetchHistoricalDailyNetWorth = async (userId, days) => {
  // Assumes daily snapshots are stored in the subcollection 'dailySnapshots'
  // Each document's ID represents the day (e.g., "2023-02-27") and includes a 'netWorth' field.
  const querySnapshot = await getDocs(collection(db, `users/${userId}/dailySnapshots`));
  let snapshots = querySnapshot.docs.map(docSnap => ({
    ...docSnap.data(),
    date: docSnap.id  // The document ID represents the date.
  }));
  // Sort snapshots chronologically; adjust this as needed.
  snapshots.sort((a, b) => a.date.localeCompare(b.date));
  snapshots = snapshots.slice(-days);
    return snapshots;
  };