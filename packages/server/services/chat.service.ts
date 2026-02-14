import { GoogleGenAI } from '@google/genai';
import { conversationRepository } from '../repositories/conversation.repository';

const AI = new GoogleGenAI({
   apiKey: process.env.GEMINI_API_KEY,
});

type ChatResponse = {
   id: string | undefined;
   message: string | undefined;
};

export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const history =
         conversationRepository.getLastResponseId(conversationId) ?? [];

      history.push(`User: ${prompt}`);

      const response = await AI.models.generateContent({
         model: 'gemini-3-flash-preview',
         contents: history.join('\n'),
      });

      const text = response.text ?? '';

      history.push(`Assistant: ${text}`);

      conversationRepository.setLastResponseId(conversationId, history);

      return {
         id: response.responseId,
         message: response.text,
      };
   },
};
