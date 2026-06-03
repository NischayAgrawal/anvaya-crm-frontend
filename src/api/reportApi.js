import axios from "axios";

const BASE_URL = "https://anvaya-crm-backend-seven.vercel.app/";

export const getLastWeekClosedLeads = async () => {
  const response = await axios.get(`${BASE_URL}/report/last-week`);
  return response.data;
};

export const getPipelineReport = async () => {
  const response = await axios.get(`${BASE_URL}/report/pipeline`);
  return response.data;
};

export const getClosedLeadsByAgent = async () => {
  const response = await axios.get(`${BASE_URL}/report/closed-by-agent`);
  return response.data;
};
