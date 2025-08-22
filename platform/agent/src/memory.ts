export interface SimpleMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
interface JsonObject {
    [key: string]: JsonValue;
}

export class MemoryService {
    private conversations: Record<string, SimpleMessage[]> = {};
    private userData: Record<string, any> = {};
    private maxMessages: number = 20;
    private wfIdCovIdMap: Record<string, string> = {};

    constructor(maxMessages: number = 20) {
        this.maxMessages = maxMessages;
    }

    addWorkflowIdConversationIdMapping(workflowExecutionId: string, conversationId: string): void {
        this.wfIdCovIdMap[workflowExecutionId] = conversationId;
    }

    getConversationIdByWorkflowId(workflowExecutionId: string): string {
        return this.wfIdCovIdMap[workflowExecutionId];
    }

    getConversationHistory(conversationId: string): string {
        const messages = this.conversations[conversationId] || [];
        return messages.map((msg) => `${msg.role}: ${msg.content}`).join("\n");
    }

    addMessage(conversationId: string, role: "user" | "assistant", content: string): void {
        if (!this.conversations[conversationId]) {
            this.conversations[conversationId] = [];
        }

        const message: SimpleMessage = {
            role,
            content,
            timestamp: new Date(),
        };

        this.conversations[conversationId].push(message);

        // Keep only recent messages
        if (this.conversations[conversationId].length > this.maxMessages) {
            this.conversations[conversationId] = this.conversations[conversationId].slice(-this.maxMessages);
        }
    }

    clearConversation(conversationId: string): void {
        delete this.conversations[conversationId];
    }

    getConversationMessages(conversationId: string): SimpleMessage[] {
        return this.conversations[conversationId] || [];
    }

    getAllConversations(): Record<string, SimpleMessage[]> {
        return { ...this.conversations };
    }

    getConversationIds(): string[] {
        return Object.keys(this.conversations);
    }

    hasConversation(conversationId: string): boolean {
        return conversationId in this.conversations;
    }

    getMessageCount(conversationId: string): number {
        return this.conversations[conversationId]?.length || 0;
    }

    /**
     * Store arbitrary JSON data with an optional TTL (in seconds)
     * @param key Unique identifier for the data
     * @param value Data to store (must be JSON-serializable)
     * @param ttlInSeconds Optional time-to-live in seconds
     */
    setUserData<T = any>(key: string, data: T, ttlInSeconds?: number): void {
        this.userData[key] = data;
        this.cleanupExpiredData();
    }

    /**
     * Retrieve stored data by key
     * @param key Unique identifier for the data
     * @returns The stored value or undefined if not found/expired
     */
    getUserData<T = any>(key: string): T | undefined {
        this.cleanupExpiredData();
        const data = this.userData[key];
        return data as T;
    }

    /**
     * Check if a key exists in the user data store
     * @param key Key to check
     * @returns boolean indicating if the key exists and is not expired
     */
    hasUserData(key: string): boolean {
        this.cleanupExpiredData();
        return key in this.userData;
    }

    /**
     * Remove data from the store
     * @param key Key to remove
     */
    deleteUserData(key: string): void {
        delete this.userData[key];
    }

    /**
     * Clear all user data
     */
    clearAllUserData(): void {
        this.userData = {};
    }

    /**
     * Get all stored data keys
     * @returns Array of all keys in the user data store
     */
    getUserDataKeys(): string[] {
        this.cleanupExpiredData();
        return Object.keys(this.userData);
    }

    /**
     * Set escalated messages for a conversation
     * @param conversationId The conversation ID
     * @param messages Array of escalated messages to store
     */
    setEscalatedMessages(conversationId: string, messages: string[]): void {
        const userData = this.getUserData(conversationId) || {};
        userData.escalatedMessages = messages;
        this.setUserData(conversationId, userData);
    }

    /**
     * Add an escalated message for a conversation
     * @param conversationId The conversation ID
     * @param message The escalated message to add
     */
    addEscalatedMessage(conversationId: string, message: any): void {
        const userData = this.getUserData(conversationId) || {};
        if (!userData.escalatedMessages) {
            userData.escalatedMessages = [];
        }
        userData.escalatedMessages.push(message);
        this.setUserData(conversationId, userData);
    }

    /**
     * Get escalated messages for a conversation
     * @param conversationId The conversation ID
     * @returns Array of escalated messages or empty array if none exist
     */
    getEscalatedMessages(conversationId: string): string[] {
        const userData = this.getUserData(conversationId);
        return userData?.escalatedMessages || [];
    }

    /**
     * Clean up expired data entries
     */
    private cleanupExpiredData(): void {
        const now = Date.now();
        for (const [key, data] of Object.entries(this.userData)) {
            if (data.expiresAt && data.expiresAt <= now) {
                delete this.userData[key];
            }
        }
    }
}
