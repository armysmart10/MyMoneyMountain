import React from 'react';
import './Features.css';

const Features = () => {
  return (
    <section className="features">
      <div className="container">
        <div className="feature">
          <h2>Total Net Worth</h2>
          <p>$250,000</p>
        </div>
        <div className="feature">
          <h2>Investment Growth</h2>
          <p>+12% YTD</p>
        </div>
        <div className="feature">
          <h2>Monthly Spending</h2>
          <p>$3,000</p>
        </div>
      </div>
    </section>
  );
};

export default Features;
