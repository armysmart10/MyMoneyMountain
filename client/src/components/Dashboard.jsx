import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { fetchAccounts, fetchHistoricalMonthlyData, fetchHistoricalDailyNetWorth } from '../firestore';
import './Dashboard.css';

const Dashboard = ({ currentUser }) => {
  const [accounts, setAccounts] = useState([]);
  const [netWorth, setNetWorth] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [selectedRange, setSelectedRange] = useState("12");

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      fetchAccounts(currentUser.uid)
        .then((data) => {
          setAccounts(data);
          let totalAssets = 0, totalLiabilities = 0;
          data.forEach((account) => {
            const bal = parseFloat(account.balance) || 0;
            if (account.account_type === 'Loans')
              totalLiabilities += bal;
            else
              totalAssets += bal;
          });
          setNetWorth(totalAssets - totalLiabilities);
        })
        .catch(err => console.error("Error fetching accounts:", err));
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      fetchHistoricalMonthlyData(currentUser.uid, selectedRange)
        .then(data => setMonthlyData(data))
        .catch(err => console.error("Error fetching monthly data:", err));
    }
  }, [currentUser, selectedRange]);

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      fetchHistoricalDailyNetWorth(currentUser.uid, 45)
        .then(data => setDailyData(data))
        .catch(err => console.error("Error fetching daily net worth:", err));
    }
  }, [currentUser]);

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
