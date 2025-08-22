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
  router.get('/chat', async (req, res) => {
    try {
      // const { message, conversationId = 'default' } = req.body;
      const message = "Send  amessage to curomer support regarding replacement of the product"
      const conversationId = "default"
      
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
            if (message) {
                // if (!conversations.has(userChat.userId)) {
                //     conversations.set(userChat.userId, []);
                // }
                
                // const msg = userChat.messages.find((m) => m.ts === message.thread_ts);
                // console.log("Found message:",userChat, msg);
                const convId = memoryService.getConversationIdByWorkflowId(workflowExecutionId);
                const userData = memoryService.getUserData(convId);
                const msg = userData?.messages.find((m: any) => m.ts === message.thread_ts);
                if (msg) {
                    // conversations.get(userChat.userId).push({
                    //     role: "assistant",
                    //     content: message.text,
                    //     timestamp: new Date().toISOString(),
                    //     source: "agent",
                    // });

                    // sirenClient.message.send({
                    //     recipientValue: userChat.email,
                    //     channel: "EMAIL",
                    //     templateName: "email",
                    //     templateVariables: {
                    //         query: msg.text,
                    //         solution: message.text,
                    //     },
                    // });
                    // Send to client via SSE if connected
                    // sendToUser(userChat.userId, {
                    //     type: "new_message",
                    //     role: "assistant",
                    //     isSupport: true, // Mark as support message
                    //     content: "Your query has been resolved. Please check your email for the solution.",
                    //     timestamp: new Date().toISOString(),
                    // });
                }
            }

            return res.status(200).json({ success: true });
        }

        if (webhookType === "NOTIFICATION_STATUS" && channel === "SLACK") {
            // console.log(workflowExecutionId, userChat.status);
            const convId = memoryService.getConversationIdByWorkflowId(workflowExecutionId);
            const userData = memoryService.getUserData(convId);
            if (userData.workflowExecutionId === workflowExecutionId && userData.status === "started") {
                const replies = await sirenClient.message.getReplies(notificationId);
                const msg = replies[0];
                console.log("Found message:", userData, msg);
                // fidn the message from userMegssae.messgaes
                const index = userData.messages.findIndex((m: any) => m.text === msg.text);
                if (index !== -1) {
                    userData.messages[index].ts = msg.ts;
                }
            }
        }

        // Handle CHAT_STARTED status
        if (status === "CHAT_STARTED" && chatData?.workflowExecutionId) {
          const convId = memoryService.getConversationIdByWorkflowId(workflowExecutionId);
          const userData = memoryService.getUserData(convId);
            if (userData.workflowExecutionId === chatData.workflowExecutionId && userData.status === "pending") {
                userData.chatNodeId = chatData.chatNodeId;
                await sirenApi.sendChatMessage({
                  chatNodeId: userData.chatNodeId,
                  workflowExecutionId: userData.workflowExecutionId,
                  body: userData.messages[userData.messages.length - 1].text,
                });
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