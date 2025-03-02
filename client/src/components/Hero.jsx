import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <h1>Take Control of Your Financial Future</h1>
        <p>
          Track your net worth, monitor investments, and plan for retirement with ease.
        </p>
        <a href="#" className="btn btn-primary hero-btn">Get Started</a>
      </div>
    </section>
  );
};

export default Hero;
