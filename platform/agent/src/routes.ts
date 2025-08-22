import { Router } from 'express';
import { ChatOpenAI } from '@langchain/openai';
import { AgentService } from './agent';
import { MemoryService } from './memory';
import sirenApi from './siren';
import { SirenClient } from '@trysiren/node';


export function createRoutes(llm: ChatOpenAI): Router {
  const router = Router();
  const memoryService = new MemoryService();
  const agentService = new AgentService(llm, memoryService);
  const sirenClient = new SirenClient({
    apiToken: process.env.SIREN_API_KEY!,
    // baseUrl: process.env.SIREN_API_BASE_URL!
});

  // Initialize the agent service
  let agentInitialized = false;
  const initializeAgent = async () => {
    if (!agentInitialized) {
      await agentService.initialize();
      agentInitialized = true;
      console.log('🤖 Agent initialized with structured chat pattern');
    }
  };

  // Main chat endpoint
  router.post('/chat', async (req, res) => {
    try {
      const { message, conversationId = 'default' } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Ensure agent is initialized
      await initializeAgent();

      // Use the agent to process the message
      const result = await agentService.invoke(message, conversationId);

      res.json({
        response: result.output,
        conversationId,
        success: result.success,
        intermediateSteps: result.intermediateSteps.map((step: any) => ({
          action: step.action?.tool || 'unknown',
          input: step.action?.toolInput || {},
          output: step.observation || ''
        })),
        ...(result.error && { error: result.error })
      });

    } catch (error) {
      console.error('Error in chat endpoint:', error);
      res.status(500).json({ 
        error: 'Something went wrong',
        success: false
      });
    }
  })

  // Health check
  router.get('/health', (req, res) => {
    res.json({ 
      status: 'OK',
      agentInitialized
    });
  });


  router.post("/webhook", async (req, res) => {
    try {
        console.log("Webhook received:", req.body);

        const { webhookType, status, message, chatData, notificationId, workflowExecutionId, channel } = req.body;

        if (webhookType === "INBOUND_MESSAGE" && chatData?.workflowExecutionId) {
            console.log("INBOUND_MESSAGE", message);
            console.log("INBOUND_MESSAGE", chatData);
            if (message) {
                const convId = memoryService.getConversationIdByWorkflowId(workflowExecutionId);
                const userData = memoryService.getUserData(convId);
                console.log("Incoming message:", message);
                const msg = userData?.escalatedMessages.find((m: any) => m.ts === message.thread_ts);
                if (msg) {
                    console.log("Found message FROM SLACK:", msg);
                }
            }

            return res.status(200).json({ success: true });
        }

        if (webhookType === "NOTIFICATION_STATUS" && channel === "SLACK") {
            // console.log(workflowExecutionId, userChat.status);
            const convId = memoryService.getConversationIdByWorkflowId(workflowExecutionId);
            const userData = memoryService.getUserData(convId);
            if (userData.workflowExecutionId === workflowExecutionId) {
                const replies = await sirenClient.message.getReplies(notificationId);
                const msg = replies[0];
                console.log("Found message:", userData, msg);
                memoryService.addEscalatedMessage(convId, msg);
            }
        }

        // Handle CHAT_STARTED status
        if (status === "CHAT_STARTED" && chatData?.workflowExecutionId) {
          const convId = memoryService.getConversationIdByWorkflowId(workflowExecutionId);
          console.log("Conversation ID:", convId);
          const userData = memoryService.getUserData(convId);
            if (userData.workflowExecutionId === chatData.workflowExecutionId) {
                userData.chatNodeId = chatData.chatNodeId;
                userData.status = "started";
            }
            memoryService.setUserData(convId, userData);
        }

        res.status(200).json({
            success: true,
            message: "Webhook processed successfully",
        });
    } catch (error) {
        console.error("Error in webhook handler:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
});

  return router;
}