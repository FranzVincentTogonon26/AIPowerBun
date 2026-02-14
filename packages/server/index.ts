import dotenv from 'dotenv';
import express from 'express';
import z from 'zod';
import { GoogleGenAI } from '@google/genai';
import type { Request, Response } from 'express';
import { conversationRepository } from './repositories/conversation.repository';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const AI = new GoogleGenAI({
   apiKey: process.env.GEMINI_API_KEY,
});

app.use(express.json());

// const conversations = new Map<string, string[]>();

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required. ')
      .max(1000, 'Promt is too long ( Max 1000 characters ).'),
   conversationId: z.string().uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
   const parseResult = chatSchema.safeParse(req.body);

   if (!parseResult.success) {
      res.status(400).json({
         message: parseResult.error.format(),
      });
      return;
   }

   try {
      const { prompt, conversationId } = req.body;
      // const history = conversations.get(conversationId) ?? [];
      const history = conversationRepository.getLastResponseId(conversationId);

      history.push(`User: ${prompt}`);

      const response = await AI.models.generateContent({
         model: 'gemini-3-flash-preview',
         contents: history.join('\n'),
      });

      const text = response.text ?? '';

      history.push(`Assistant: ${text}`);
      // conversations.set(conversationId, history);
      conversationRepository.setLastResponseId(conversationId, history);

      res.status(200).json({
         message: response.text,
      });
   } catch (error) {
      res.status(500).json({
         message: 'Failed to generate a response',
      });
   }
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
