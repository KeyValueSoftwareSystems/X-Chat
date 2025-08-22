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

        Tool Use Instructions:
         - Use 'send_chat_message' tool to send a message to customer support ONLY if you think we need to escalate the chat to customer support. (Otherwise don't use this tool)
         - Always provide the user's message and workflowExecutionId as input to the 'send_chat_message' tool.
         - Make sure to provide proper message (with context) when passing the user's message to the 'send_chat_message' tool.
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
                verbose: true,
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

                const workflowResponse = await sirenApi.triggerWorkflow({
                    workflowName: process.env.CHAT_WORKFLOW_NAME!,
                    data: {},
                    notify: {
                        slack: process.env.CHAT_WORKFLOW_SLACK_CHANNEL!,
                    },
                });
                console.log("Workflow triggered successfully:", workflowResponse);
                this.memoryService.addWorkflowIdConversationIdMapping(workflowResponse.data.workflowExecutionId, conversationId);
                this.memoryService.setUserData(conversationId, {
                    workflowExecutionId: workflowResponse.data.workflowExecutionId,
                    chatNodeId: process.env.CHAT_NODE_ID!,
                });
            }
            // Add user message to conversation history
            this.memoryService.addMessage(conversationId, "user", input);

            // Get conversation history for context
            const history = this.memoryService.getConversationHistory(conversationId);

            // Create input with history context
            const userChat = this.memoryService.getUserData(conversationId);
            const agentInput = history ? `Previous conversation:\n${history} workflowExecutionId: ${userChat.workflowExecutionId} \n\nCurrent message: ${input}` : input;
            
            // Execute the agent
            const result = await this.agentExecutor.invoke({
                input: agentInput,
            });

            // // If escalated then add to messages
            // for (const step of result.intermediateSteps) {
            //     if (step.action === "send_chat_message") {
            //         try {
            //             const toolOutput = JSON.parse(step.output);
            //             if (toolOutput.status === "escalated") {
            //                 // Store the escalated message
            //                 this.memoryService.addEscalatedMessage(conversationId, step.input.message);
            //                 console.log("📢 Message escalated and stored:", step.input.message);
            //             }
                        
            //         } catch (error) {
            //             console.error("Error parsing tool output:", error);
            //         }
            //     }
            // }

            // Add assistant response to conversation history
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
