import React from 'react';
import './CTA.css';

const CTA = () => {
  return (
    <section className="cta">
      <h2>Call to Action</h2>
      <p>Join us and start managing your finances effectively.</p>
      {/* Use a valid URL for the href attribute */}
      <a href="/register" className="btn btn-primary">Get Started</a>
    </section>
  );
};

export default CTA;
