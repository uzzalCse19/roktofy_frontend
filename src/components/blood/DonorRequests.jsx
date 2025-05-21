import { useEffect, useState } from "react";
import apiClient from "../../services/http";

const DonorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await apiClient.get("/blood-requests/for_donor/");
        setRequests(res.data);
      } catch (err) {
        setError("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    const confirmAction = confirm(
      `Are you sure you want to ${action.toUpperCase()} this request?`
    );
    if (!confirmAction) return;

    setActionLoadingId(id);
    try {
      await apiClient.post(`/blood-requests/${id}/${action}/`);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      alert(`Request ${action}ed successfully`);
    } catch (err) {
      alert("Action failed. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading...</p>;

  if (error)
    return (
      <p className="text-center text-red-500 mt-10 font-semibold">{error}</p>
    );

  if (requests.length === 0)
    return (
      <p className="text-center text-gray-500 mt-10">
        No blood requests available.
      </p>
    );

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-white shadow-md rounded-lg p-5 border border-gray-200"
        >
          <p className="font-semibold text-lg mb-2">
            Requested By: {req.requester_email}
          </p>
          <p>
            <span className="font-semibold">Blood Type:</span> {req.blood_type}
          </p>
          <p>
            <span className="font-semibold">Hospital:</span> {req.hospital}
          </p>
          <p>
            <span className="font-semibold">Location:</span> {req.location}
          </p>
          <p>
            <span className="font-semibold">Urgency:</span> {req.urgency}
          </p>

          <div className="mt-4 flex space-x-3">
            <button
              onClick={() => handleAction(req.id, "accept")}
              disabled={actionLoadingId === req.id}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition disabled:opacity-50"
            >
              {actionLoadingId === req.id ? "Processing..." : "Accept"}
            </button>
            <button
              onClick={() => handleAction(req.id, "cancel")}
              disabled={actionLoadingId === req.id}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition disabled:opacity-50"
            >
              {actionLoadingId === req.id ? "Processing..." : "Cancel"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DonorRequests;
