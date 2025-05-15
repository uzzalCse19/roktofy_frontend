import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
      <h1 className="text-4xl font-bold text-green-600 mb-4"> Payment Successful!</h1>
      <p className="text-lg text-gray-700 mb-6">Thank you for your donation. Your transaction was completed successfully.</p>
      <Link to="/" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
        Go to Home
      </Link>
    </div>
  );
};

export default PaymentSuccess;
