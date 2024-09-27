import axios from 'axios';

const API_BASE_URL = 'https://deals-api.replit.app';

export const addDeal = async (deal) => {
  const response = await axios.post(`${API_BASE_URL}/api/deals`, deal);
  return response.data;
};

export const getAllDeals = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/deals`);
  return response.data;
};

export const updateDeal = async (id, updates) => {
  const response = await axios.put(`${API_BASE_URL}/api/deals/${id}`, updates);
  return response.data;
};

export const deleteExpiredDeals = async () => {
  const response = await axios.delete(`${API_BASE_URL}/api/deals/expired`);
  return response.data.deletedCount;
};

export const generateDummyData = async () => {
  const response = await axios.post(`${API_BASE_URL}/api/deals/dummy`);
  return response.data;
};

export const getDealById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/api/deals/${id}`);
  return response.data;
};