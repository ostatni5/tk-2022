import express, { Request, Response, Application } from 'express';
const traverseModule: Application = express();

traverseModule.get('/', (req: Request, res: Response): void => {
	res.status(200).send('This should be the response from the server!');
});

export default traverseModule;
