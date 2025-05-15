import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFailed = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4"> Payment Failed!</h1>
      <p className="text-lg text-gray-700 mb-6">Something went wrong. Please try again later.</p>
      <Link to="/donate" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
        Try Again
      </Link>
    </div>
  );
};

export default PaymentFailed;
