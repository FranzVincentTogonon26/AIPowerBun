import dotenv from 'dotenv';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import type { Request, Response } from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const AI = new GoogleGenAI({
   apiKey: process.env.GEMINI_API_KEY,
});

// Middleware handler for json()
app.use(express.json());

const conversations = new Map<string, string[]>();

app.post('/api/chat', async (req: Request, res: Response) => {
   const { prompt, conversationId } = req.body;

   const history = conversations.get(conversationId) ?? [];

   history.push(`User: ${prompt}`);

   const response = await AI.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history.join('\n'),
   });

   const text = response.text ?? '';

   history.push(`Assistant: ${text}`);

   conversations.set(conversationId, history);

   res.json({
      message: response.text,
   });
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
