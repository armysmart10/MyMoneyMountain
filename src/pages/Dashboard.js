import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Home, BarChart, Settings, LogIn } from "lucide-react";
import { Button } from "../components/ui/button";
import { login, logout, getUser, isAuthenticated } from "../services/auth0"; // Moved to Auth0 authentication
import Sidebar from "../components/Sidebar";

const Dashboard = ({ user }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/financial-data")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching financial data:", error));
  }, []);

  const menuItems = [
    { label: "Dashboard", icon: <Home size={18} /> },
    { label: "Investments", icon: <BarChart size={18} /> },
    { label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex w-full h-screen">
      <Sidebar menuItems={menuItems} handleLogout={logout} />
      <div className="flex-1 p-6">
        <h2 className="text-xl font-bold mb-4">Welcome, {user?.name || "User"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold">Net Worth</h3>
              <p className="text-2xl font-bold text-green-500">$150,000</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold">Monthly Cash Flow</h3>
              <ResponsiveContainer width="100%" height="100%" className="h-40 md:h-60">
                <LineChart data={data}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Login = ({ setUser }) => {
  const handleLogin = async () => {
    await login();
    const user = await getUser();
    setUser(user);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Button onClick={handleLogin} className="text-xl">
        Sign in with Auth0
      </Button>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (await isAuthenticated()) {
        const userData = await getUser();
        setUser(userData);
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
    </Router>
  );
};

export default App;
