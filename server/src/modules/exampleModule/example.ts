import express, { Request, Response, Application } from 'express';
const exampleModule: Application = express();
const cors = require('cors');

//this is default response for all routes
exampleModule.get('/', (req: Request, res: Response): void => {
	res.status(404).json({ msg: 'This is the response from the server!' });
});

//this is a route with enabled cors
exampleModule.get('/cors', cors(), (req: Request, res: Response): void => {
	res.status(200).json({ msg: 'This is CORS-enabled for a Single Route' });
});

//this will enable cors for all routes in this module
exampleModule.use(cors());

export default exampleModule;
