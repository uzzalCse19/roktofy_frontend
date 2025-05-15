import http from '../http';

export const getBloodRequests = async () => {
  try {
    const response = await http.get('/blood-requests/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createBloodRequest = async (requestData) => {
  try {
    const response = await http.post('/blood-requests/', requestData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const acceptBloodRequest = async (requestId) => {
  try {
    const response = await http.post(`/blood-requests/${requestId}/accept/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getDashboardData = async () => {
  try {
    const response = await http.get('/dashboard/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};