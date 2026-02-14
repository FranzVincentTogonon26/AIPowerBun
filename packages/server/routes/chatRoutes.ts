import express from 'express';
import { chatController } from '../controllers/chat.controller';

const router = express.Router();

router.post('/', sendMessage);

export default router;
