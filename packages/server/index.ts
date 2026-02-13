import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hellownghgh')
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})