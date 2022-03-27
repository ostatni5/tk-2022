import express, { Request, Response, Application } from 'express';
import { deserialize, serialize } from 'bson';
import PictureRequest from '../../classes/pictureRequest';
import bodyParser from 'body-parser';

const traverseModule: Application = express();

const options = {
	//default options
	inflate: true,
	limit: '100kb',
	type: 'application/octet-stream'
};

traverseModule.use(bodyParser.raw(options));

traverseModule.post('/', (req: any, res: Response): void => {
	console.log(deserialize(req.body));
	const pictureRequest = new PictureRequest(req.body);
	const buffer = { pictures: handleRequest(pictureRequest) };
	res.status(200).send(serialize(buffer));
	console.log(buffer);
});

function handleRequest(request: PictureRequest): string[] {
	let pictures: string[] = getPictures(request.path);

	return pictures;
}
function getPictures(path: string): string[] {
	return [path];
}

export default traverseModule;