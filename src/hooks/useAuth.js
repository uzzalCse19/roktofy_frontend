import { useEffect, useState } from "react";
import apiClient from "../services/http";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [authTokens, setAuthTokens] = useState(() => {
    const token = localStorage.getItem("authTokens");
    return token ? JSON.parse(token) : null;
  });

  useEffect(() => {
    if (authTokens) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [authTokens]);

  const handleAPIError = (error, defaultMessage = "Something went wrong! Please try again.") => {
    console.error(error);

    if (error.response?.data) {
      const errorMessage = Object.values(error.response.data).flat().join("\n");
      setErrorMsg(errorMessage);
      return { success: false, message: errorMessage };
    }
    
    setErrorMsg(defaultMessage);
    return { success: false, message: defaultMessage };
  };

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/auth/users/me", {
        headers: { Authorization: `JWT ${authTokens?.access}` }
      });
      console.log(response.data);
      setUser(response.data);
      setErrorMsg("");
    } catch (error) {
      console.error("Error fetching user:", error);
      setErrorMsg("Failed to load user profile");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data) => {
    setErrorMsg("");
    try {
      setIsLoading(true);
      await apiClient.patch("/auth/users/me/", data, {
        headers: { Authorization: `JWT ${authTokens?.access}` }
      });
      await fetchUserProfile(); 
      return { success: true };
    } catch (error) {
      return handleAPIError(error, "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (data) => {
    setErrorMsg("");
    try {
      setIsLoading(true);
      await apiClient.post("/auth/users/set_password/", data, {
        headers: { Authorization: `JWT ${authTokens?.access}` }
      });
      return { success: true, message: "Password changed successfully" };
    } catch (error) {
      return handleAPIError(error, "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (userData) => {
    setErrorMsg("");
    try {
      setIsLoading(true);
      const response = await apiClient.post("/auth/jwt/create/", userData);
      setAuthTokens(response.data);
      localStorage.setItem("authTokens", JSON.stringify(response.data));
      await fetchUserProfile();
      return { success: true };
    } catch (error) {
      return handleAPIError(error, error.response?.data?.detail || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (userData) => {
    setErrorMsg("");
    try {
      setIsLoading(true);
      await apiClient.post("/auth/users/", userData);
      console.log(userData);
      return { 
        success: true,
        message: "Registration successful. Please check your email to activate your account."
      };
    } catch (error) {
      return handleAPIError(error, "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
  };
  const resendActivationEmail = async (email) => {
  setErrorMsg("");
  try {
    setIsLoading(true);
    await apiClient.post("/auth/users/resend_activation/", { email });
    return {
      success: true,
      message: "Activation email resent. Please check your inbox."
    };
  } catch (error) {
    return handleAPIError(error, "Failed to resend activation email.");
  } finally {
    setIsLoading(false);
  }
};

return {
  user,
  errorMsg,
  isLoading,
  authTokens,
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  changePassword,
  fetchUserProfile,
  resendActivationEmail, 
};

};

export default useAuth;