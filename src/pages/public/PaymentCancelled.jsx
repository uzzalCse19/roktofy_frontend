import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50">
      <h1 className="text-4xl font-bold text-yellow-500 mb-4"> Payment Cancelled</h1>
      <p className="text-lg text-gray-600 mb-6">
        You cancelled the payment. No transaction was completed.
      </p>
      <Link
        to="/donate"
        className="px-5 py-2.5 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition duration-200"
      >
        Try Again
      </Link>
    </div>
  );
};

export default PaymentCancelled;
