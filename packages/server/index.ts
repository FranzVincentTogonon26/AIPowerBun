import dotenv from 'dotenv';
import express from 'express';
import chatRoutes from './routes/chatRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use('/api/chat', chatRoutes);

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
