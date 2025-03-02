import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { fetchAccounts } from '../firestore';
import './Dashboard.css';

const Dashboard = ({ currentUser }) => {
  const [accounts, setAccounts] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [selectedRange, setSelectedRange] = useState("3");

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      fetchAccounts(currentUser.uid)
        .then((data) => {
          setAccounts(data);
          initializeMonthlyData();
          initializeDailyData();
        })
        .catch((err) => console.error("Error fetching accounts:", err));
    }
  }, [currentUser]);

  const initializeMonthlyData = () => {
    let data = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 0; i < 12; i++) {
      data.push({
        month: months[i],
        assets: Math.round(Math.random() * 5000 + 15000),
        liabilities: Math.round(Math.random() * 2000 + 5000)
      });
    }
    setMonthlyData(data);
  };

  const initializeDailyData = () => {
    let data = [];
    const today = new Date();
    for (let i = 44; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
      const netWorth = Math.round(Math.random() * 5000 + 15000) - Math.round(Math.random() * 2000 + 5000);
      data.push({ date: formattedDate, netWorth });
    }
    setDailyData(data);
  };

  const handleRangeChange = (e) => {
    const range = e.target.value;
    setSelectedRange(range);
    // For demonstration, we simulate the range by slicing last N months
    if (range === "3") {
      setMonthlyData(prev => prev.slice(prev.length - 3));
    } else if (range === "6") {
      setMonthlyData(prev => prev.slice(prev.length - 6));
    } else if (range === "12" || range === "max") {
      initializeMonthlyData();
    }
  };

  const currentNetWorth = monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].assets - monthlyData[monthlyData.length - 1].liabilities : 0;

  return (
    <main className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="net-worth">
        <h3>Current Net Worth: ${currentNetWorth.toFixed(2)}</h3>
      </div>
      <div className="chart-section">
        <h3>Monthly Assets vs. Liabilities</h3>
        <div className="range-selector">
          <label>Select Range: </label>
          <select value={selectedRange} onChange={handleRangeChange}>
            <option value="3">3 months</option>
            <option value="6">6 months</option>
            <option value="12">1 year</option>
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
            <Bar dataKey="assets" fill="#0088FE" />
            <Bar dataKey="liabilities" fill="#FF8042" />
            <Line type="monotone" dataKey={(data) => data.assets - data.liabilities} stroke="#82ca9d" dot={false} name="Net Worth Trend" />
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
            <Line type="monotone" dataKey="netWorth" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
};

export default Dashboard;
