const { onSchedule } = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.dailyNetWorthSnapshot = onSchedule("0 0 * * *", {
  timeZone: "America/Los_Angeles",
  region: "us-central1"
}, async (event) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // e.g., "2025-03-02"
    
    // Use for...of to await each user's snapshot write
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const accountsSnapshot = await db.collection("users").doc(userId).collection("accounts").get();
      let totalAssets = 0;
      let totalLiabilities = 0;

      accountsSnapshot.forEach(accountDoc => {
        const data = accountDoc.data();
        const balance = parseFloat(data.balance) || 0;
        if (data.account_type === "Loans") {
          totalLiabilities += balance;
        } else {
          totalAssets += balance;
        }
      });

      const netWorth = totalAssets - totalLiabilities;
      
      await db.collection("users").doc(userId)
        .collection("dailySnapshots").doc(formattedDate)
        .set({
          netWorth: netWorth,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
    }
    console.log("Daily snapshots written successfully.");
    return null;
  } catch (error) {
    console.error("Error writing daily snapshots:", error);
    throw error;
  }
});

exports.monthlyNetWorthSnapshot = onSchedule("0 0 1 * *", {
    timeZone: "America/Los_Angeles",
    region: "us-central1"
  }, async (event) => {
    try {
      const usersSnapshot = await db.collection("users").get();
      const currentDate = new Date();
      // Format current date as "YYYY-MM" for monthly snapshot
      const formattedMonth = currentDate.toISOString().slice(0, 7);
      
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const accountsSnapshot = await db.collection("users").doc(userId).collection("accounts").get();
        let totalAssets = 0;
        let totalLiabilities = 0;
        
        accountsSnapshot.forEach(accountDoc => {
          const data = accountDoc.data();
          const balance = parseFloat(data.balance) || 0;
          if (data.account_type === "Loans") {
            totalLiabilities += balance;
          } else {
            totalAssets += balance;
          }
        });
        
        const netWorth = totalAssets - totalLiabilities;
        await db.collection("users").doc(userId)
          .collection("monthlySnapshots").doc(formattedMonth)
          .set({
            netWorth: netWorth,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
          });
      }
      console.log("Monthly snapshots written successfully.");
      return null;
    } catch (error) {
      console.error("Error writing monthly snapshots:", error);
      throw error;
    }
  });