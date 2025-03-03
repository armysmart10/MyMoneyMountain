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

  // Fetch live accounts data and compute live net worth
  useEffect(() => {
    if (currentUser && currentUser.uid) {
      fetchAccounts(currentUser.uid)
        .then((data) => {
          setAccounts(data);
          let totalAssets = 0;
          let totalLiabilities = 0;
          data.forEach((account) => {
            const bal = parseFloat(account.balance) || 0;
            // Assume "Loans" accounts are liabilities; all others are assets.
            if (account.account_type === 'Loans') {
              totalLiabilities += bal;
            } else {
              totalAssets += bal;
            }
          });
          setNetWorth(totalAssets - totalLiabilities);
        })
        .catch((err) => console.error("Error fetching accounts:", err));
    }
  }, [currentUser]);

  // Fetch historical monthly snapshot data and merge with live data for current month
  useEffect(() => {
    if (currentUser && currentUser.uid) {
      fetchHistoricalMonthlyData(currentUser.uid, selectedRange)
        .then((data) => {
          // Determine current month in "YYYY-MM" format
          const currentMonth = new Date().toISOString().slice(0,7);
          // Compute live values from current accounts
          let liveAssets = 0;
          let liveLiabilities = 0;
          accounts.forEach(account => {
            const bal = parseFloat(account.balance) || 0;
            if (account.account_type === 'Loans') {
              liveLiabilities += bal;
            } else {
              liveAssets += bal;
            }
          });
          const liveNetWorth = liveAssets - liveLiabilities;
          const liveDataPoint = { month: currentMonth, assets: liveAssets, liabilities: liveLiabilities, netWorth: liveNetWorth };

          // Check if the last historical data point is for the current month;
          // if so, replace it; otherwise, append liveDataPoint.
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

  // Fetch historical daily snapshot data and merge with live data for current day
  useEffect(() => {
    if (currentUser && currentUser.uid) {
      fetchHistoricalDailyNetWorth(currentUser.uid, 45)
        .then((data) => {
          const today = new Date();
          const currentDate = `${today.getMonth()+1}/${today.getDate()}`;
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
        <p>{accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
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
