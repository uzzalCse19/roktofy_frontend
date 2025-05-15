import React from 'react';
import { Link } from 'react-router-dom';

const ConvincingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-grow"></div> 
      <div className="pb-40 px-6 sm:px-8 lg:px-12"> 
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-red-600 mb-6">
            Join Us in Saving Lives
          </h1>
          <p className="text-xl text-gray-800 mb-5">
            Your generous contribution empowers us to host more blood donation camps, 
            respond swiftly to emergencies, and support critical medical procedures.
          </p>
          <p className="text-lg text-gray-600 mb-8">
            Every donation counts. With your help, we can make a greater impact 
            and bring hope to those in need.
          </p>
          <Link
            to="/donate"
            className="bg-red-600 text-white text-lg px-8 py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out inline-block text-center"
          >
            Donate Money
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConvincingPage;