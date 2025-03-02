import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { fetchAccounts } from '../firestore';
import './Dashboard.css';

const Dashboard = ({ currentUser }) => {
  const [accounts, setAccounts] = useState([]);
  const [netWorth, setNetWorth] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [selectedRange, setSelectedRange] = useState("3");

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      fetchAccounts(currentUser.uid)
        .then((data) => {
          setAccounts(data);
        })
        .catch((err) => console.error("Error fetching accounts:", err));
    }
  }, [currentUser]);

  useEffect(() => {
    let totalAssets = 0;
    let totalLiabilities = 0;
    accounts.forEach((account) => {
      const balance = parseFloat(account.balance) || 0;
      if (account.account_type === 'Loans') {
        totalLiabilities += balance;
      } else {
        totalAssets += balance;
      }
    });
    setNetWorth(totalAssets - totalLiabilities);
    setChartData([
      { month: "Assets", value: totalAssets },
      { month: "Liabilities", value: totalLiabilities }
    ]);
  }, [accounts]);

  useEffect(() => {
    let data = [];
    const today = new Date();
    for (let i = 44; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
      const netValue = Math.round(Math.random() * 5000 + 15000) - Math.round(Math.random() * 2000 + 5000);
      data.push({ date: formattedDate, netWorth: netValue });
    }
    setDailyData(data);
  }, []);

  const handleRangeChange = (e) => {
    const range = e.target.value;
    setSelectedRange(range);
    if (range === "3") {
      // Simulate selecting last 3 months
      setChartData(chartData.slice(chartData.length - 3));
    } else if (range === "6") {
      setChartData(chartData.slice(chartData.length - 6));
    } else if (range === "12" || range === "max") {
      // Reinitialize to full data (for demonstration, we reset to a fixed array)
      setChartData([
        { month: "Assets", value: 20000 },
        { month: "Liabilities", value: 8000 }
      ]);
    }
  };

  return (
    <main className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="net-worth">
        <h3>Net Worth: ${netWorth.toFixed(2)}</h3>
        <p>Total Accounts: {accounts.length}</p>
      </div>
      <div className="chart-container">
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
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#0088FE" />
            <Line type="monotone" dataKey={(data) => data.month === "Assets" ? chartData[0].value - chartData[1].value : null} stroke="#82ca9d" dot={false} name="Net Worth Trend" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-container">
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
