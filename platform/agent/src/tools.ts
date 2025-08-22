import "dotenv/config";
import { SirenAgentToolkit } from "@trysiren/agent-toolkit/langchain";
import sirenApi from "./siren";
import { DynamicStructuredTool, DynamicTool } from "langchain/tools";
import { SirenClient } from "@trysiren/node";
import { z } from "zod";

const sireClient = new SirenClient({
    apiToken: process.env.SIREN_API_KEY!,
    // baseUrl: process.env.SIREN_API_BASE_URL!
});

// Initialize Siren toolkit
const sirenToolkit = new SirenAgentToolkit({
    apiKey: process.env.SIREN_API_KEY!,
    configuration: {
        actions: {
            messaging: {
                create: true,
                // read: true,
            },
            templates: {
                read: true,
                create: true,
                update: true,
                delete: true,
            },

            workflows: {
                trigger: true,
                // schedule: true,
            },
        },
    },
});

// Get Siren tools
const sirenTools = sirenToolkit.getTools();

export const sendChatMessageTool = new DynamicStructuredTool({
    name: "send_chat_message",
    description: "Tool to escale chat to customer support, required inputs are user's message and workflowExecutionId",
    schema: z.object({
        message: z.string(),
        workflowExecutionId: z.string(),
    }),
    func: async ({message, workflowExecutionId}) => {
        console.log("💬 Sending chat message:", message, workflowExecutionId);
        try {
            const response = await sirenApi.sendChatMessage({
                chatNodeId: process.env.CHAT_NODE_ID!,
                workflowExecutionId: workflowExecutionId,
                body: message,
            });

            console.log("💬 Message sent successfully:", response.data);
            return JSON.stringify({ status: "escalated", response: response.data });
        } catch (error: any) {
            console.error("❌ Failed to send message:", error);

            return JSON.stringify({ status: "failed", error: error.message });
        }
    },
});

export const tools: any[] = [sendChatMessageTool, ...sirenTools];
