import axios from 'axios';

const API_BASE_URL = 'https://deals-api.replit.app';

const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error setting up request:', error.message);
  }
  throw error;
};

export const addDeal = async (deal) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/deals`, deal);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getAllDeals = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/deals`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateDeal = async (id, updates) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/deals/${id}`, updates);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteExpiredDeals = async () => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/deals/expired`);
    return response.data.deletedCount;
  } catch (error) {
    return handleApiError(error);
  }
};

export const generateDummyData = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/deals/dummy`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getDealById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/deals/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};