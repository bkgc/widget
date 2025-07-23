import axios from "axios";
import { getApiUrl } from "../widget";

const telefono = "+56992168066";
const baseURL = getApiUrl();

const api = axios.create({
  baseURL,
  headers: {
    "X-Telefono": telefono,
  },
});

export const getWidgetByAgentName = async (id: string) => {
  const response = await api.get(`/widget/${id}`);
  return response.data;
};

export const getFiles = async (agentName: string) => {
  const response = await api.get(`agents/${agentName}/config-widget`);
  return response;
};

export const sendMessageToAI = async (agentName: string, threadId: string, message: string) => {
  const response = await api.post("agents/ask", { message, thread_id: threadId, agent_name: agentName });
  return response.data;
};