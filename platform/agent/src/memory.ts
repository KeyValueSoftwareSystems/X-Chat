export interface SimpleMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class MemoryService {
  private conversations: Record<string, SimpleMessage[]> = {};
  private maxMessages: number = 20;

  constructor(maxMessages: number = 20) {
    this.maxMessages = maxMessages;
  }

  getConversationHistory(conversationId: string): string {
    const messages = this.conversations[conversationId] || [];
    return messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
  }

  addMessage(conversationId: string, role: 'user' | 'assistant', content: string): void {
    if (!this.conversations[conversationId]) {
      this.conversations[conversationId] = [];
    }

    const message: SimpleMessage = {
      role,
      content,
      timestamp: new Date()
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
}
