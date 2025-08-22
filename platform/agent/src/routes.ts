import { Router } from 'express';
import { ChatOpenAI } from '@langchain/openai';
import { AgentService } from './agent';


export function createRoutes(llm: ChatOpenAI): Router {
  const router = Router();
  const agentService = new AgentService(llm);

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

  return router;
}