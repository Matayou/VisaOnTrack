import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} VisaOnTrack. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;