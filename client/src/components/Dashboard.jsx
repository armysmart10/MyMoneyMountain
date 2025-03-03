import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import { fetchAccounts, fetchHistoricalMonthlyData, fetchHistoricalDailyNetWorth } from '../firestore';
import './Dashboard.css';

const Dashboard = ({ currentUser }) => {
  const [accounts, setAccounts] = useState([]);
  const [netWorth, setNetWorth] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [selectedRange, setSelectedRange] = useState("12");

  // Live account data and net worth
  useEffect(() => {
    if (currentUser && currentUser.uid) {
      fetchAccounts(currentUser.uid)
        .then((data) => {
          setAccounts(data);
          let totalAssets = 0;
          let totalLiabilities = 0;
          const liabilityTypes = ['Loans', 'Credit Card', 'Other-Liability'];
          data.forEach((account) => {
            const balance = parseFloat(account.balance) || 0;
            if (liabilityTypes.includes(account.account_type)) {
              totalLiabilities += balance;
            } else {
              totalAssets += balance;
            }
          });
          setNetWorth(totalAssets - totalLiabilities);
        })
        .catch((err) => console.error("Error fetching accounts:", err));
    }
  }, [currentUser]);

  // Monthly historical data merged with live data for the current month
  useEffect(() => {
    if (currentUser && currentUser.uid) {
      fetchHistoricalMonthlyData(currentUser.uid, selectedRange)
        .then((data) => {
          const currentMonth = new Date().toISOString().slice(0, 7);
          let liveAssets = 0;
          let liveLiabilities = 0;
          const liabilityTypes = ['Loans', 'Credit Card', 'Other-Liability'];
          accounts.forEach(account => {
            const balance = parseFloat(account.balance) || 0;
            if (liabilityTypes.includes(account.account_type)) {
              liveLiabilities += balance;
            } else {
              liveAssets += balance;
            }
          });
          const liveNetWorth = liveAssets - liveLiabilities;
          const liveDataPoint = { month: currentMonth, assets: liveAssets, liabilities: liveLiabilities, netWorth: liveNetWorth };
          if (data.length > 0) {
            if (data[data.length - 1].month === currentMonth) {
              data[data.length - 1] = liveDataPoint;
            } else {
              data.push(liveDataPoint);
            }
          } else {
            data.push(liveDataPoint);
          }
          setMonthlyData(data);
        })
        .catch(err => console.error("Error fetching monthly data:", err));
    }
  }, [currentUser, selectedRange, accounts]);

  // Daily historical data merged with live data for the current day (past 45 days)
  useEffect(() => {
    if (currentUser && currentUser.uid) {
      fetchHistoricalDailyNetWorth(currentUser.uid, 45)
        .then((data) => {
          const today = new Date();
          const currentDate = `${today.getMonth() + 1}/${today.getDate()}`;
          const liveDataPoint = { date: currentDate, netWorth: netWorth };
          if (data.length > 0) {
            if (data[data.length - 1].date === currentDate) {
              data[data.length - 1] = liveDataPoint;
            } else {
              data.push(liveDataPoint);
            }
          } else {
            data.push(liveDataPoint);
          }
          setDailyData(data);
        })
        .catch(err => console.error("Error fetching daily net worth:", err));
    }
  }, [currentUser, netWorth]);

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
            <Bar dataKey="assets" fill="#0088FE" name="Assets" />
            <Bar dataKey="liabilities" fill="#FF8042" name="Liabilities" />
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="netWorth" stroke="#82ca9d" dot={false} name="Net Worth Trend" />
          </LineChart>
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
