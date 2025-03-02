import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
// import Budget from './components/Budget';
import './App.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div>
        <Navbar currentUser={currentUser} />
        <Routes>
          <Route path="/" element={currentUser ? <Dashboard /> : <Home />} />
          <Route path="/register" element={currentUser ? <Navigate to="/" /> : <Register />} />
          <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/accounts" element={currentUser ? <Accounts currentUser={currentUser} /> : <Navigate to="/login" />} /> 
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

const Home = () => (
  <main>
    <Hero />
    <CTA />
    <Features />
  </main>
);

export default App;
