import axios from "axios";

const BASE_URL = "https://anvaya-crm-backend-seven.vercel.app";

export const getAgents = async () => {
  const response = await axios.get(`${BASE_URL}/agents`);

  return response.data;
};

export const createAgent = async (agentData) => {
  const response = await axios.post(`${BASE_URL}/agents`, agentData);
  return response.data;
};
