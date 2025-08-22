import { BaseLanguageModel } from "langchain/base_language";
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import { tools } from "./tools";
import { MemoryService } from "./memory";

export interface AgentResult {
    output: string;
    intermediateSteps: any[];
    success: boolean;
    error?: string;
}

import { SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";
import { SystemMessage } from "langchain/schema";
import sirenApi from "./siren";

// Example KB JSON (you can fetch/load dynamically)
const KB = {
    store: {
        name: "Acme Electronics",
        domain: "acme.com",
        supportHours: "9am - 6pm IST",
        returnPolicy: "30 days no-questions return policy",
    },
};

export const buildCustomPrompt = async () => {
    const basePrompt = await pull<ChatPromptTemplate>("hwchase17/structured-chat-agent");

    return ChatPromptTemplate.fromMessages([
        new SystemMessage(
            `You are a customer service agent for ${KB.store.name} (${KB.store.domain}).
       Only use the information provided in the Knowledge Base (KB) JSON below.
       
       Knowledge Base (KB):
       ${JSON.stringify(KB, null, 2)}
  
  
       Instructions:
       - If the user asks to connect with customer support:
         
         - call the 'send_chat_message' tool and pass the user’s message and userChatData.
         - If the user asks to send an email, call the 'send_message' tool with:
           {{{
                recipientValue: {{email}},
                channel: "EMAIL",
                templateName: "Customer-Support-Agent",
                templateVariables: {
                    subject: {{subject}},
                    content: {{content}},
                },
            }}}.
      `
        ),
        ...basePrompt.promptMessages,
    ]);
};

export class AgentService {
    private agentExecutor: AgentExecutor | null = null;
    // private memoryService: MemoryService;

    constructor(private llm: any, private memoryService: MemoryService) {
        this.memoryService = memoryService;
    }

    async initialize() {
        try {
            // Pull the structured chat agent prompt from the hub
            const prompt = await buildCustomPrompt();

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
                verbose: process.env.NODE_ENV === "development",
                maxIterations: 5,
                returnIntermediateSteps: true,
            });

            console.log("🤖 Agent initialized successfully");
        } catch (error) {
            console.error("Failed to initialize agent:", error);
            throw error;
        }
    }

    async invoke(input: string, conversationId: string = "default"): Promise<AgentResult> {
        if (!this.agentExecutor) {
            throw new Error("Agent not initialized. Call initialize() first.");
        }

        try {
            if (!this.memoryService.hasUserData(conversationId)) {
                console.log("No user data found for conversationId:", conversationId);

                const wfResponse = await sirenApi.triggerWorkflow({
                    workflowName: process.env.CHAT_WORKFLOW_NAME!,
                    data: {},
                    notify: {
                        slack: process.env.CHAT_WORKFLOW_SLACK_CHANNEL!,
                    },
                });
                console.log("Workflow triggered successfully:", wfResponse);
                this.memoryService.setUserData(conversationId, {
                    workflowExecutionId: wfResponse.data.workflowExecutionId,
                });
            }
            // Add user message to conversation history
            this.memoryService.addMessage(conversationId, "user", input);

            // Get conversation history for context
            const history = this.memoryService.getConversationHistory(conversationId);

            // Create input with history context
            const agentInput = history ? `Previous conversation:\n${history} and userChatData:\n${this.memoryService.getUserData(conversationId)}\n\nCurrent message: ${input}` : input;

            // Execute the agent
            const result = await this.agentExecutor.invoke({
                input: agentInput,
            });

            // result// Add assistant response to conversation history
            this.memoryService.addMessage(conversationId, "assistant", result.output);

            return {
                output: result.output,
                intermediateSteps: result.intermediateSteps || [],
                success: true,
            };
        } catch (error) {
            console.error("Agent execution error:", error);
            return {
                output: "I apologize, but I encountered an error while processing your request. Please try again.",
                intermediateSteps: [],
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
}
