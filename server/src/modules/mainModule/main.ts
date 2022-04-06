import express, { Application } from 'express';
import PictureRequest from '../../classes/pictureRequest';
import bodyParser from 'body-parser';
import { directoryImagesGenerator } from './filesFinder';
import { ModuleConfig, ModuleRoutes } from '../../classes/moduleConfig';
import { getHandler, promiseReduce } from '../../utils/request.utils';
import { serialize } from 'bson';

const BUFFER_SIZE = 10;

const mainModule: Application = express();

const options = {
	//default options
	inflate: true,
	limit: '100kb',
	type: 'application/octet-stream',
};

mainModule.use(bodyParser.raw(options));

mainModule.post('/', getHandler(handleRequest, serialize));

async function handleRequest(payload: Buffer): Promise<string[]> {
	const request = new PictureRequest(payload);
	const picturePromises: Promise<any>[] = [];

	const pictureGenerator = directoryImagesGenerator(request.path, true);

	let pictureBuffer: string[] = [];

	let picture = pictureGenerator.next();

	while (!picture.done) {
		pictureBuffer.push(picture.value);

		if (pictureBuffer.length >= BUFFER_SIZE) {
			picturePromises.push(fetcher(request.moduleConfig, new Array(...pictureBuffer)));
			pictureBuffer = [];
		}

		picture = pictureGenerator.next();
	}

	return (await Promise.all(picturePromises)).flat();
}

// reduce to one promise
const fetcher = (configs: ModuleConfig[], pictures: string[]) =>
	promiseReduce(
		configs.map((config) => {
			return {
				route: ModuleRoutes[config.name],
				config: config,
			};
		}),
		pictures,
	);

export default mainModule;
