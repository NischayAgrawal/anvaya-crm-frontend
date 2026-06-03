import axios from "axios";

const BASE_URL = "https://anvaya-crm-backend-seven.vercel.app/";

export const getComments = async (leadId) => {
  const response = await axios.get(`${BASE_URL}/leads/${leadId}/comments`);
  return response.data;
};

export const createComment = async (leadId, commentData) => {
  const response = await axios.post(
    `${BASE_URL}/leads/${leadId}/comments`,
    commentData,
  );

  return response.data;
};
