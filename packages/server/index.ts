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

app.post('/api/chat', async (req: Request, res: Response) => {
   const { prompt } = req.body;
   const trimmedPrompt = prompt.substring(0, 15000);

   const response = await AI.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: trimmedPrompt,
   });

   res.json({
      message: response.text,
   });
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
