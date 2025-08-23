import { Router } from "express";
import { ChatOpenAI } from "@langchain/openai";
import { AgentService } from "./agent";
import { MemoryService } from "./memory";
import sirenApi from "./siren";
import { RecipientChannel, SirenClient } from "@trysiren/node";

export function createRoutes(llm: ChatOpenAI): Router {
    const router = Router();
    const memoryService = new MemoryService();
    const sseConnections = new Map();
    const agentService = new AgentService(llm, memoryService, sseConnections);

    const sirenClient = new SirenClient({
        apiToken: process.env.SIREN_API_KEY!,
        baseUrl: process.env.SIREN_API_BASE_URL!,
    });

    // Initialize the agent service
    let agentInitialized = false;
    const initializeAgent = async () => {
        if (!agentInitialized) {
            await agentService.initialize();
            agentInitialized = true;
            console.log("🤖 Agent initialized with structured chat pattern");
        }
    };

    // Main chat endpoint
    router.post("/chat", async (req, res) => {
        try {
            const { message, conversationId = "default" } = req.body;

            if (!message) {
                return res.status(400).json({ error: "Message is required" });
            }

            let userChat: any = {}
            if (memoryService.hasUserData(conversationId)) {
                userChat = memoryService.getUserData(conversationId);
            }

            const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
            if (emailRegex.test(message)) {
                const match = message.match(emailRegex);
                if (match) {
                    userChat.email = match[0];
                    userChat.awaitingEmail = false;
                    const ack = `Thanks! We'll send updates to ${userChat.email}.`;
                    memoryService.setUserData(conversationId, {
                        email: match[0],
                        awaitingEmail: false,
                        ...userChat,
                    });
                    memoryService.addMessage(conversationId, "assistant", ack);
                    return res.json({
                        success: true,
                        response: ack,
                        conversationId,
                        email: match[0],
                    });
                } else {
                    const prompt = "Please share a valid email address (for example: name@example.com) so our support team can follow up.";
                    memoryService.addMessage(conversationId, "assistant", prompt);
                    return res.json({
                        success: false,
                        message: prompt,
                        conversationId,
                        email: null,
                        response: "Provide a valid email address.",
                    });
                }
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
                    action: step.action?.tool || "unknown",
                    input: step.action?.toolInput || {},
                    output: step.observation || "",
                })),
                ...(result.error && { error: result.error }),
            });
        } catch (error) {
            console.error("Error in chat endpoint:", error);
            res.status(500).json({
                error: "Something went wrong",
                success: false,
            });
        }
    });

    // Health check
    router.get("/health", (req, res) => {
        res.json({
            status: "OK",
            agentInitialized,
        });
    });

    router.post("/trigger", async (req, res) => {
        try {
            const { userId: conversationId } = req.body;

            if (!conversationId) {
                return res.status(400).json({ error: "userId is required" });
            }

            const existingChat = memoryService.getUserData(conversationId);
            if (existingChat) {
                return res.json({ message: "Chat already started", conversationId });
            }

            console.log(
                "Triggering workflow for conversation",
                conversationId,
                process.env.CHAT_WORKFLOW_NAME,
                process.env.CHAT_WORKFLOW_SLACK_CHANNEL
            );
            const workflowResponse = await sirenApi.triggerWorkflow({
                workflowName: process.env.CHAT_WORKFLOW_NAME!,
                data: {},
                notify: {
                    slack: process.env.CHAT_WORKFLOW_SLACK_CHANNEL!,
                },
            });
            console.log("Workflow triggered for conversation", conversationId, workflowResponse.data);
            if (!workflowResponse.data) {
                throw new Error("Workflow trigger failed to return data.");
            }

            memoryService.setUserData(conversationId, {
                workflowExecutionId: workflowResponse.data.workflowExecutionId,
                chatNodeId: process.env.CHAT_NODE_ID!,
            });
            memoryService.addWorkflowIdConversationIdMapping(workflowResponse.data.workflowExecutionId, conversationId);

            console.log(`Workflow triggered for conversation ${conversationId}: ${workflowResponse.data.workflowExecutionId}`);

            res.json({
                success: true,
                message: "Workflow triggered successfully.",
                conversationId,
                workflowExecutionId: workflowResponse.data.workflowExecutionId,
            });
        } catch (error) {
            console.error("Error in trigger endpoint:", error);
            res.status(500).json({
                error: "Failed to trigger workflow",
                success: false,
            });
        }
    });

    router.get("/events/:userId", (req, res) => {
        const { userId } = req.params;

        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        });

        // Store this connection
        sseConnections.set(userId, res);

        // Remove connection on close
        req.on("close", () => {
            sseConnections.delete(userId);
        });

        // Send a ping to keep connection alive
        const pingInterval = setInterval(() => {
            if (!sseConnections.has(userId)) {
                clearInterval(pingInterval);
                return;
            }
            res.write("event: ping\ndata: {}\n\n");
        }, 30000);
    });

    function sendToUser(userId: string, data: any) {
        const connection = sseConnections.get(userId);
        if (connection) {
            connection.write(`data: ${JSON.stringify(data)}\n\n`);
        }
    }

    router.post("/webhook", async (req, res) => {
        try {
            console.log("Webhook received:", req.body);

            const { webhookType, status, message, chatData, notificationId, workflowExecutionId, channel } = req.body;

            if (workflowExecutionId) {
                const convId = memoryService.getConversationIdByWorkflowId(workflowExecutionId);
                if (!convId) {
                    console.log(`No conversation ID found for workflow ${workflowExecutionId}`);
                } else {
                    if (webhookType === "INBOUND_MESSAGE" && chatData?.workflowExecutionId) {
                        if (message) {
                            const userData = memoryService.getUserData(convId);
                            if (userData) {
                                console.log("Incoming message:", message);
                                const msg = userData.escalatedMessages?.find((m: any) => m.ts === message.thread_ts);
                                console.log("Escalated message", msg);
                                if (msg && !msg.mailSend) {
                                    sendToUser(convId, {
                                        type: "new_message",
                                        role: "assistant",
                                        isSupport: true, // Mark as support message
                                        content: "Your query has been resolved. Please check your email for the solution.",
                                        timestamp: new Date().toISOString(),
                                    });

                                    const subjectResponse = await llm.invoke(
                                        `Create a subject for the email based on the following message: query ${msg.text} and solution ${message.text} whcih should be send back to the user, Should be a single line subject.`
                                    );
                                    const contentResponse = await llm.invoke(
                                        `Create a content for the email based on the following message: query ${msg.text} and solution ${message.text}. Only send the content of the email, do not include any additional text and variable. No salutations or closing.`
                                    );

                                    const subject = subjectResponse.content.toString().replace(/"/g, "").trim();
                                    const content = contentResponse.content.toString().trim();
                                    console.log("sending email with subject", subject, "and content", content);

                                    const userEmail = userData.email;
                                    if (userEmail) {
                                        msg.mailSend = true;
                                        memoryService.removeAnEscalatedMessage(convId, msg);
                                        memoryService.addEscalatedMessage(convId, msg);
                                        await sirenClient.message.send({
                                            recipientValue: userEmail,
                                            channel: RecipientChannel.EMAIL,
                                            templateName: "Customer-Support-Agent",
                                            templateVariables: {
                                                subject: subject,
                                                content: content,
                                            },
                                        });
                                    }
                                }
                            }
                        }
                        return res.status(200).json({ success: true });
                    }

                    if (webhookType === "NOTIFICATION_STATUS" && channel === "SLACK") {
                        const userData = memoryService.getUserData(convId);
                        if (userData && userData.workflowExecutionId === workflowExecutionId) {
                            const replies = await sirenClient.message.getReplies(notificationId);
                            const msg = replies[0];
                            console.log("Found message:", userData, msg);
                            memoryService.addEscalatedMessage(convId, msg);
                        }
                    }

                    if (status === "CHAT_STARTED" && chatData?.workflowExecutionId) {
                        const userData = memoryService.getUserData(convId);
                        if (userData && userData.workflowExecutionId === chatData.workflowExecutionId) {
                            userData.chatNodeId = chatData.chatNodeId;
                            userData.status = "started";
                            memoryService.setUserData(convId, userData);
                        }
                    }
                }
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
