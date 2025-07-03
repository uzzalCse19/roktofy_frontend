import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/http";

const Hero = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDonateClick = async () => {
    setIsLoading(true);
    setMessage("");
    setMessageType("");

    try {
      await apiClient.get('/auth/users/');
      const profileCheck = await apiClient.get('/api/check-profile/');

      if (profileCheck.data.is_profile_complete) {
        setMessage("Congratulations! You are already a donor.");
        setMessageType("success");
        setTimeout(() => navigate('/donors'), 3000);
      } else {
        setMessage("Please complete your donor profile first.");
        setMessageType("warning");
        setTimeout(() => navigate('/donor-profile'), 3000);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage("Please register and create a donor account.");
        setMessageType("warning");
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setMessage("An error occurred. Please try again.");
        setMessageType("error");
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const alertStyles = {
    success: "alert alert-success text-white bg-green-600",
    warning: "alert alert-warning text-white bg-yellow-500",
    error: "alert alert-error text-white bg-red-600"
  };

  const alertIcons = {
    success: (
  
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
    warning: (
      // Warning Icon
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      // Error Icon (X)
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    )
  };

  return (
    // <div className="hero bg-base-200 min-h-screen flex items-center">
      <div className="hero bg-base-200 min-h-[65vh] flex items-center">

      <div className="hero-content w-full max-w-2xl mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Your Blood Can Bring<br />
            <span className="text-red-600">A Life-Saving Smile</span>
          </h1>

          <div className="space-y-6 text-lg md:text-xl">
            <p className="text-gray-700">
              A single donation can change a life. Your generosity gives hope,
              offers a second chance, and brings joy to those in need.
            </p>
            <p className="text-2xl font-semibold text-gray-800 italic">
              "Be the hero someone needs today"
            </p>
          </div>

          <div className="pt-4 space-y-4">
            <button
              onClick={handleDonateClick}
              disabled={isLoading}
              className="btn btn-primary px-10 py-4 text-xl font-bold rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Checking...
                </>
              ) : (
                "DONATE NOW"
              )}
            </button>

            {message && (
              <div className={`${alertStyles[messageType]} transition-all duration-300 ease-in-out shadow-lg flex items-center justify-center gap-2`}>
                {alertIcons[messageType]}
                <span className="text-lg">{message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
