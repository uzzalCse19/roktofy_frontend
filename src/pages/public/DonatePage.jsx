import React from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/http';

const DonatePage = () => {
  const [loading, setLoading] = React.useState(false);
  const [amount, setAmount] = React.useState('');
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await apiClient.post("/payment/initiate/", { amount });
      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        alert("Payment Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = () => {
    navigate('/payment/history');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handlePayment}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold text-center text-red-600 mb-8">
          ❤️ Make a Donation
        </h2>

        <div className="mb-6">
          <label htmlFor="amount" className="block text-gray-700 font-semibold mb-2">
            Donation Amount (৳)
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
            min="1"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          aria-label="Proceed to Payment"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Proceed to Donate'
          )}
        </button>

        {/* 💡 Donation History Button */}
        <div className="mt-6">
          <h3 className="text-center text-gray-600 text-sm font-medium mb-2">
            Want to see your past donations?
          </h3>
          <button
            type="button"
            onClick={handleViewHistory}
            aria-label="View Donation History"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-lg border border-gray-300 transition duration-200 cursor-pointer"
          >
            🕘 My Donation History
          </button>
        </div>

        <p className="text-gray-500 text-xs mt-6 text-center">
          Your kind donation helps us continue life-saving work. Thank you! ❤️
        </p>
      </form>
    </div>
  );
};

export default DonatePage;
