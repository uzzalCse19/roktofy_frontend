
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api", 
});

apiClient.interceptors.request.use(
  (config) => {
    const tokens = JSON.parse(localStorage.getItem("authTokens")); 
    if (tokens?.access) {
      config.headers.Authorization = `JWT ${tokens.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default apiClient;

export const getEvents = () => apiClient.get('/blood-events/');
export const createEvent = (data) => apiClient.post('/blood-events/', data);
export const acceptEvent = (id) => apiClient.post(`/blood-events/${id}/accept/`);
export const getMyEvents = () => apiClient.get('/blood-events/my-events/'); // You might need to implement this endpoint


