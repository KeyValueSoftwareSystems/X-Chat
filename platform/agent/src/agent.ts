import { BaseLanguageModel } from 'langchain/base_language';
import { AgentExecutor, createStructuredChatAgent } from 'langchain/agents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { pull } from 'langchain/hub';
import { tools } from './tools';
import { MemoryService } from './memory';

export interface AgentResult {
  output: string;
  intermediateSteps: any[];
  success: boolean;
  error?: string;
}

export class AgentService {
  private agentExecutor: AgentExecutor | null = null;
  private memoryService: MemoryService;

  constructor(private llm: any) {
    this.memoryService = new MemoryService();
  }

  async initialize() {
    try {
      // Pull the structured chat agent prompt from the hub
      const prompt = await pull<ChatPromptTemplate>(
        'hwchase17/structured-chat-agent'
      );

      // Create the structured chat agent
      const agent = await createStructuredChatAgent({
        llm: this.llm,
        tools,
        prompt,
      });

      // Create the agent executor
      this.agentExecutor = new AgentExecutor({
        agent,
        tools,
        verbose: process.env.NODE_ENV === 'development',
        maxIterations: 5,
        returnIntermediateSteps: true,
      });

      console.log('🤖 Agent initialized successfully');
    } catch (error) {
      console.error('Failed to initialize agent:', error);
      throw error;
    }
  }



  async invoke(input: string, conversationId: string = 'default'): Promise<AgentResult> {
    if (!this.agentExecutor) {
      throw new Error('Agent not initialized. Call initialize() first.');
    }

    try {
      // Add user message to conversation history
      this.memoryService.addMessage(conversationId, 'user', input);

      // Get conversation history for context
      const history = this.memoryService.getConversationHistory(conversationId);
      
      // Create input with history context
      const agentInput = history 
        ? `Previous conversation:\n${history}\n\nCurrent message: ${input}`
        : input;

      // Execute the agent
      const result = await this.agentExecutor.invoke({
        input: agentInput
      });

      // Add assistant response to conversation history
      this.memoryService.addMessage(conversationId, 'assistant', result.output);

      return {
        output: result.output,
        intermediateSteps: result.intermediateSteps || [],
        success: true
      };
    } catch (error) {
      console.error('Agent execution error:', error);
      return {
        output: 'I apologize, but I encountered an error while processing your request. Please try again.',
        intermediateSteps: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}