import 'dotenv/config';
import { SirenAgentToolkit } from '@trysiren/agent-toolkit/langchain';
import sirenApi from './siren';
import { DynamicTool} from 'langchain/tools';
import { SirenClient } from '@trysiren/node';

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


export const sendChatMessageTool = new DynamicTool({
  name: "send_chat_message",
  description: "Send a chat message to an already active workflow execution.",
  func: async (input: string, userChat: any) => {
    let refreshed = false;

    try {
      const response = await sirenApi.sendChatMessage({
        chatNodeId: userChat.chatNodeId,
        workflowExecutionId: userChat.workflowExecutionId,
        body: input,
      });

      console.log("💬 Message sent successfully:", response.data);
      return JSON.stringify({ status: "sent", response: response.data });

    } catch (error: any) {
      console.error("❌ Failed to send message:", error);

      // if (!refreshed) {
      //   refreshed = true;
      //   const wfResponse = await sireClient.workflow.trigger({
      //     workflowName: process.env.CHAT_WORKFLOW_NAME!,
      //     data: {},
      //     notify: {
      //       slack: process.env.CHAT_WORKFLOW_SLACK_CHANNEL!,
      //     },
      //   });

      //   console.log("Workflow retriggered successfully:", wfResponse.data);

      //   // Update global state
      //   // userChat.workflowExecutionId = wfResponse.data.workflowExecutionId;
      //   // userChat.chatNodeId = wfResponse.data.chatNodeId;

      //   return JSON.stringify({
      //     status: "workflow_retriggered",
      //     workflowExecutionId: userChat.workflowExecutionId,
      //     chatNodeId: userChat.chatNodeId,
      //   });
      // }

      return JSON.stringify({ status: "failed", error: error.message });
    }
  },
});

export const tools: any[] = [sendChatMessageTool, ...sirenTools];
