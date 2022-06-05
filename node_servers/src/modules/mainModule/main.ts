import express, { Application } from 'express';
import PictureRequest from '../../classes/pictureRequest';
import bodyParser from 'body-parser';
import { directoryImagesGenerator } from './filesFinder';
import { ModuleOptions, ModuleRoutes } from '../../classes/moduleOptions.interface';
import { getHandler, promiseReduce } from '../../utils/request.utils';
import { serialize } from 'bson';
import cors from 'cors';
import fs from 'fs';

const BUFFER_SIZE = 10;

const mainModule: Application = express();

const options = {
	//default options
	inflate: true,
	limit: '100kb',
	type: 'application/octet-stream',
};

mainModule.use(bodyParser.raw(options));

mainModule.use(
	cors({
		origin: 'http://localhost:3000',
	}),
);

mainModule.post('/', getHandler(handleRequest, serialize));

mainModule.get('/image/*', (req, res) => {
	const imageURL = decodeURI(req.url.replace('/image/', ''));
	const img = fs.readFileSync(imageURL);
	res.status(200).end(img, 'binary');
});

async function handleRequest(payload: Buffer): Promise<string[]> {
	const request = new PictureRequest(payload);
	const picturePromises: Promise<any>[] = [];
	console.log(request);

	const pictureGenerator = directoryImagesGenerator(request.path, true);

	let pictureBuffer: string[] = [];

	let picture = pictureGenerator.next();

	while (!picture.done) {
		for (let i = 0; i < BUFFER_SIZE && !picture.done; i++) {
			pictureBuffer.push(picture.value);
			picture = pictureGenerator.next();
		}

		picturePromises.push(fetcher(request.moduleOptions, new Array(...pictureBuffer)));
		pictureBuffer = [];
	}

	return (await Promise.all(picturePromises)).flat();
}

// reduce to one promise
const fetcher = (moduleOptions: ModuleOptions[], pictures: string[]) =>
	promiseReduce(
		moduleOptions.map((options) => {
			return {
				route: ModuleRoutes[options.name],
				options,
			};
		}),
		pictures,
	);

export default mainModule;
