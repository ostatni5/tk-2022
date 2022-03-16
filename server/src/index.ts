import express, { Request, Response, Application } from 'express';
const app: Application = require('./app');
const PORT = process.env.PORT || 8000;
const cors = require('cors');
app.listen(PORT, (): void => {
	console.log(`Server Running here 👉 http://localhost:${PORT}`);
});
app.get('/cors', cors(), (req: Request, res: Response): void => {
	res.json({ msg: 'This is CORS-enabled for a Single Route' });
});
