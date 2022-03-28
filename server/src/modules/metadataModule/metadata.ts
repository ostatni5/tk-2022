import express, { Request, Response, Application } from 'express';
import { deserialize, serialize } from 'bson';
import bodyParser from 'body-parser';
import MetadataRequest from './metadataRequest';
import MetadataOptions from './metadataOptions';
import { parseExifDate, getImageExif } from '../../utils/metadata.utils';
import { asyncFilter } from '../../utils/async.utils';

const metadataModule: Application = express();

const exifFileTypes = ['jpg', 'tiff'];

const options = {
	//default options
	inflate: true,
	limit: '100kb',
	type: 'application/octet-stream'
};

metadataModule.use(bodyParser.raw(options));

metadataModule.post('/', async (req: any, res: Response): Promise<void> => {
	console.log(deserialize(req.body));
	const request = new MetadataRequest(req.body);
	const buffer = { pictures: await handleRequest(request) };
	res.status(200).send(serialize(buffer));
	console.log(buffer);
});

async function handleRequest(request: MetadataRequest): Promise<string[]> {
    const result = await asyncFilter(request.paths, path => filterMetadata(path, request.options))
	return result;
}

async function filterMetadata(path: string, options: MetadataOptions): Promise<boolean> {
    // Valid format guard
    const fileType = path.split('.').slice(-1)[0];
    if(!exifFileTypes.includes(fileType)){
       return false;
    }

    const imgData = await getImageExif(path)

    // Here we add filters as guards
    if(!filterDate(imgData, options))
        return false;


    return true;
}

function filterDate(imgData: any, options: MetadataOptions): boolean {
    if(!('CreateDate' in imgData.exif)){
        return false;
    }
    const dateCreated = parseExifDate(imgData.exif.CreateDate);

    if(options.dateAfter !== undefined &&
        dateCreated.getTime() < options.dateAfter.getTime())
        return false;
        
    if(options.dateBefore !== undefined &&
        dateCreated.getTime() > options.dateBefore.getTime())
        return false;

    return true;
}

export default metadataModule;
