import z from 'zod';
import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required. ')
      .max(1000, 'Promt is too long ( Max 1000 characters ).'),
   conversationId: z.string().uuid(),
});

export const chatController = {
   async sendMessage(req: Request, res: Response) {
      const parseResult = chatSchema.safeParse(req.body);

      if (!parseResult.success) {
         res.status(400).json({
            message: parseResult.error.format(),
         });
         return;
      }

      try {
         const { prompt, conversationId } = req.body;
         const response = await chatService.sendMessage(prompt, conversationId);

         res.status(200).json({
            message: response.message,
         });
      } catch (error) {
         res.status(500).json({
            message: 'Failed to generate a response',
         });
      }
   },
};
