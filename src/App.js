import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { getUser, isAuthenticated, login, logout } from "./services/auth0";

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
        <Route path="/" element={user ? <Dashboard user={user} handleLogout={logout} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
    </Router>
  );
};

export default App;
