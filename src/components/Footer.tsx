import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} VisaOnTrack. All rights reserved.
          </div>
          <nav className="flex space-x-4">
            <Link href="/privacy" className="text-gray-500 hover:text-gray-700 text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-700 text-sm">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;