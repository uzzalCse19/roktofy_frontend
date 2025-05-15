import apiClient from '../http';

export const donationService = {
  getDonorList: async () => {
    const response = await apiClient.get('/donor-list/');
    console.log(response.data)
    return response.data;
  },
  requestBlood: async (donorId) => {
    const response = await apiClient.post('/blood-requests/', { donor_id: donorId });
    return response.data;
  }
};