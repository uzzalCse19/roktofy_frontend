import React, { useEffect, useState } from "react";
import apiClient from "../../services/http";

const MyRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await apiClient.get("/blood-requests/");
        setRequests(response.data.results || []);
      } catch (error) {
        console.error("Failed to fetch blood requests", error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner text-red-600 w-10 h-10"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        My <span className="text-red-600">Blood Requests</span>
      </h2>

      {requests.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          No blood requests found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg p-6 border border-gray-200"
            >
              <p className="text-lg">
                <span className="font-semibold text-gray-700">Blood Type:</span>{" "}
                <span className="text-red-600 font-bold">{req.blood_type}</span>
              </p>
              <p className="text-lg">
                <span className="font-semibold text-gray-700">Units Needed:</span>{" "}
                {req.units_needed}
              </p>
              <p className="text-lg">
                <span className="font-semibold text-gray-700">Status:</span>{" "}
                <span className={`font-semibold ${req.status === "Pending" ? "text-yellow-600" : "text-green-600"}`}>
                  {req.status}
                </span>
              </p>
              <p className="text-lg">
                <span className="font-semibold text-gray-700">Needed By:</span>{" "}
                {new Date(req.needed_by).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequest;
