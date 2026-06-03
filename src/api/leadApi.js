import axios from "axios";

const BASE_URL = "https://anvaya-crm-backend-seven.vercel.app";

export const createLead = async (leadData) => {
  const response = await axios.post(`${BASE_URL}/leads`, leadData);
  return response.data;
};

export const getLeads = async (filters = {}) => {
  const response = await axios.get(`${BASE_URL}/leads`, { params: filters });
  return response.data;
};

export const getLeadById = async (leadId) => {
  const response = await axios.get(`${BASE_URL}/leads/${leadId}`);
  return response.data;
};

export const updateLead = async (id, leadData) => {
  const response = await axios.patch(`${BASE_URL}/leads/${id}`, leadData);
  return response.data;
};

export const deleteLead = async (leadId) => {
  const response = await axios.delete(`${BASE_URL}/leads/${leadId}`);
  return response.data;
};
