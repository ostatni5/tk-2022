import { Request, Response } from 'express';
import app from './app';
import cors from 'cors';

const PORT = process.env.PORT || 8000;

app.listen(PORT, (): void => {
	console.log(`Server Running here 👉 http://localhost:${PORT}`);
});

app.get('/cors', cors(), (req: Request, res: Response): void => {
	res.json({ msg: 'This is CORS-enabled for a Single Route' });
});
