import React, { useEffect, useState } from 'react';
import apiClient from '../../services/http';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const { data } = await apiClient.get('/payment/history/');
        setPayments(data);
      } catch (error) {
        console.error('Error fetching payment history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-4 border-t-transparent border-red-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Payment History</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left font-bold uppercase tracking-wide">Date & Time</th>
              <th className="px-6 py-3 text-left font-bold uppercase tracking-wide">Transaction ID</th>
              <th className="px-6 py-3 text-left font-bold uppercase tracking-wide">Amount</th>
              <th className="px-6 py-3 text-left font-bold uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.length > 0 ? (
              payments.map(({ transaction_id, timestamp, amount, status }) => (
                <tr key={transaction_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{new Date(timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{transaction_id}</td>
                  <td className="px-6 py-4 text-gray-700">৳{amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        status === 'success'
                          ? 'bg-green-100 text-green-700'
                          : status === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-6 text-center text-gray-500">
                  No payment records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
