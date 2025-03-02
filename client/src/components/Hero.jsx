import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <h1>Welcome to FinanceHub</h1>
      <p>Manage your finances seamlessly and efficiently.</p>
      {/* Use a valid URL for the href attribute */}
      <a href="/register" className="btn btn-primary">Get Started</a>
    </section>
  );
};

export default Hero;
