import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './Dashboard.css';

const Dashboard = ({ currentUser }) => {
  const [accounts, setAccounts] = useState([]);
  const [netWorth, setNetWorth] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [selectedRange, setSelectedRange] = useState("12");

  // Real-time listener for user accounts so that any change updates net worth instantly.
  useEffect(() => {
    if (currentUser && currentUser.uid) {
      const accountsRef = collection(db, `users/${currentUser.uid}/accounts`);
      const unsubscribe = onSnapshot(accountsRef, (snapshot) => {
        const accountsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setAccounts(accountsData);
        let totalAssets = 0;
        let totalLiabilities = 0;
        accountsData.forEach(account => {
          const balance = parseFloat(account.balance) || 0;
          // Assumption: accounts with type 'Loans' are liabilities; all others are assets.
          if (account.account_type === 'Loans') {
            totalLiabilities += balance;
          } else {
            totalAssets += balance;
          }
        });
        setNetWorth(totalAssets - totalLiabilities);
      });
      return unsubscribe;
    }
  }, [currentUser]);

  // Simulated monthly data. In production, you'd fetch historical aggregated data.
  useEffect(() => {
    let data = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // For demonstration, generate data for a full year based on current netWorth with a bit of variation.
    for (let i = 0; i < 12; i++) {
      data.push({
        month: months[i],
        netWorth: netWorth + Math.round(Math.random() * 1000 - 500)
      });
    }
    if (selectedRange !== "max") {
      const range = parseInt(selectedRange);
      data = data.slice(-range);
    }
    setMonthlyData(data);
  }, [netWorth, selectedRange]);

  // Simulated daily data for past 45 days. In production, these would come from historical snapshots.
  useEffect(() => {
    let data = [];
    const today = new Date();
    for (let i = 44; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
      data.push({
        date: formattedDate,
        netWorth: netWorth + Math.round(Math.random() * 500 - 250)
      });
    }
    setDailyData(data);
  }, [netWorth]);

  const handleRangeChange = (e) => {
    setSelectedRange(e.target.value);
  };

  return (
    <main className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="net-worth">
        <h3>Current Net Worth: ${netWorth.toFixed(2)}</h3>
        <p>{accounts.length} account{accounts.length !== 1 ? 's' : ''} in use.</p>
      </div>
      <div className="chart-section">
        <h3>Monthly Financial Overview</h3>
        <div className="range-selector">
          <label>Select Range: </label>
          <select value={selectedRange} onChange={handleRangeChange}>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">1 Year</option>
            <option value="max">Max</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="netWorth" fill="#0088FE" name="Net Worth" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-section">
        <h3>Daily Net Worth (Past 45 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="netWorth" stroke="#8884d8" activeDot={{ r: 8 }} name="Daily Net Worth" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
};

export default Dashboard;
