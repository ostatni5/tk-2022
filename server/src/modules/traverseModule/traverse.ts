import express, { Request, Response, Application } from 'express';
import { deserialize, serialize } from 'bson';
import PictureRequest from '../../classes/pictureRequest';
import bodyParser from 'body-parser';
import { directoryImagesGenerator } from './filesFinder';
import { ModuleConfig, ModuleRoutes } from '../../classes/moduleConfig';
import fetchPictures from '../../utils/fetchPictures';

const BUFFER_SIZE = 10;

const traverseModule: Application = express();

const options = {
	//default options
	inflate: true,
	limit: '100kb',
	type: 'application/octet-stream'
};

traverseModule.use(bodyParser.raw(options));

traverseModule.post('/', async (req: any, res: Response): Promise<void> => {
	console.log(deserialize(req.body));
	const pictureRequest = new PictureRequest(req.body);
	const buffer = { pictures: await handleRequest(pictureRequest) };
	res.status(200).send(serialize(buffer));
	console.log(buffer);
});

async function handleRequest(request: PictureRequest): Promise<string[]> {
	const picturePromises: Promise<any>[] = [];

	const pictureGenerator = directoryImagesGenerator(request.path, true);

	let pictureBuffer: string[] = [];

	let picture = pictureGenerator.next();

	while (!picture.done) {
		if (pictureBuffer.length < BUFFER_SIZE) {
			pictureBuffer.push(picture.value);
		} else {
			picturePromises.push(fetcher(pictureBuffer, request.moduleConfig));
			pictureBuffer = [];
		}

		picture = pictureGenerator.next();
	}

	return (await Promise.all(picturePromises)).flat();
}

function fetcher(pictures: string[], configs: ModuleConfig[]) {
	let fetchConfigs = configs.map((config) => {
		return {
			route: getRouteForConfig(config),
			config: config
		};
	});

	// reduce to one promise
	return fetchConfigs.reduce(
		(prev, curr) =>
			prev.then((val) => fetchPictures(curr.route, { paths: val, options: curr.config })),
		(async () => {
			return pictures;
		})()
	);
}

function getRouteForConfig(config: ModuleConfig): string {
	return ModuleRoutes[config.name];
}

export default traverseModule;
