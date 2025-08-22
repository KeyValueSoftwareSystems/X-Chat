import axios, { AxiosRequestConfig } from "axios";

// Base URL for the API
const BASE_URL = `${process.env.SIREN_API_BASE_URL}/api`;

// API Key - should be stored in environment variables in production
const API_KEY = process.env.SIREN_API_KEY;

// Default headers for API requests
const defaultHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

/**
 * Generic API call to the Siren API
 */
async function callSirenApi<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  data?: Record<string, any> | null
): Promise<T> {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const config: AxiosRequestConfig = {
      method,
      url,
      headers: defaultHeaders,
      data: data ? JSON.stringify(data) : undefined,
    };

    console.log(`Making ${method} request to ${url}`);
    const response = await axios<T>(config);
    return response.data;
  } catch (error: any) {
    console.error("API call failed:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
}

/**
 * Interactive button interface
 */
export interface Button {
  text: string;
  actionId: string;
  value: string;
}

/**
 * Options for sending a chat message
 */
export interface SendChatMessageOptions {
  chatNodeId: string;
  workflowExecutionId: string;
  templateVariables?: Record<string, any>;
  body: string;
  subject?: string;
  buttons?: Button[];
}

/**
 * Options for triggering a workflow
 */
export interface TriggerWorkflowOptions {
  workflowName: string;
  data?: Record<string, any>;
  notify?: {
    slack?: string;
    email?: string;
  };
}

const sirenApi = {
  /**
   * Send a chat message with interactive buttons
   */
  sendChatMessage: async (
    options: SendChatMessageOptions
  ): Promise<Record<string, any>> => {
    const {
      chatNodeId,
      workflowExecutionId,
      templateVariables = {},
      body,
      subject = "",
      buttons = [],
    } = options;

    const messageData = {
      chatNodeId,
      workflowExecutionId,
      // templateVariables, // commented since original ignored it
      body,
      subject,
      buttons,
    };

    return callSirenApi("POST", "/v1/chat/message", messageData);
  },

  /**
   * Trigger a workflow
   */
  triggerWorkflow: async (
    options: TriggerWorkflowOptions
  ): Promise<Record<string, any>> => {
    const { workflowName, data = {}, notify } = options;

    const payload = {
      workflowName,
      data,
      ...(notify && { notify }),
    };

    return callSirenApi("POST", "/v2/workflows/trigger", payload);
  },
};

export default sirenApi;
