import express, { Application } from 'express';
import PictureRequest from '../../classes/pictureRequest';
import bodyParser from 'body-parser';
import { directoryImagesGenerator } from './filesFinder';
import { ModuleConfig, ModuleRoutes } from '../../classes/moduleConfig';
import { getBsonHandler, promiseReduce } from '../../utils/request.utils';

const BUFFER_SIZE = 10;

const traverseModule: Application = express();

const options = {
	//default options
	inflate: true,
	limit: '100kb',
	type: 'application/octet-stream',
};

traverseModule.use(bodyParser.raw(options));

traverseModule.post('/', getBsonHandler(handleRequest));

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
				route: getRouteForConfig(config),
				config: config,
			};
		}),
		pictures,
	);

function getRouteForConfig(config: ModuleConfig): string {
	return ModuleRoutes[config.name];
}

export default traverseModule;
