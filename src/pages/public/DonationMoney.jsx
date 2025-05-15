import React from 'react';

const DonationMoney = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-6">Support Our Mission</h1>
        <p className="text-lg text-gray-700 mb-6">
          Your donation helps us organize more blood donation camps, provide faster emergency services, and support life-saving operations.
        </p>
        <p className="text-md text-gray-600 mb-8">
          Every penny you give makes a difference. Together, we can save more lives.
        </p>
        <button className="btn btn-primary text-lg px-8 py-3 font-semibold rounded shadow hover:shadow-lg">
          Donate Money
        </button>
      </div>
    </div>
  );
};

export default DonationMoney;
