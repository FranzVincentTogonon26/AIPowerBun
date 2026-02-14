const conversations = new Map<string, string[]>();

export const conversationRepository = {
   getLastResponseId(conversationId: string): string[] {
      return conversations.get(conversationId) ?? [];
   },

   setLastResponseId(conversationId: string, history: string[]) {
      return conversations.set(conversationId, history);
   },
};
