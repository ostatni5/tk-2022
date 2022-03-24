import express, { Request, Response, Application } from 'express';

const app: Application = express();

app.get('/', (req: Request, res: Response): void => {
	res.status(200).send('Hello Typescript with Node.js!');
});

export default app;
