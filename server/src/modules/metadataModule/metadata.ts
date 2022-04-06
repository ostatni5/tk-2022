import bodyParser from 'body-parser';
import express, { Application } from 'express';
import { asyncFilter } from '../../utils/async.utils';
import { getImageExif, parseExifDate } from '../../utils/metadata.utils';
import { getHandler } from '../../utils/request.utils';
import { filterRange, filterValue, } from './metadata.filters';
import MetadataOptions from './metadataOptions';
import MetadataRequest from './metadataRequest';

const metadataModule: Application = express();

const exifFileTypes = ['jpg', 'tiff'];

metadataModule.use(bodyParser.json());

metadataModule.post('/', getHandler(handleRequest));

async function handleRequest(payload: MetadataRequest): Promise<string[]> {
	const request = payload;
	const result = await asyncFilter(request.paths, (path) => filterMetadata(path, request.options));
	return result;
}

async function filterMetadata(path: string, options: MetadataOptions): Promise<boolean> {
	// Valid format guard
	const fileType = path.split('.').slice(-1)[0];
	if (!exifFileTypes.includes(fileType)) {
		return false;
	}

	const imgData: any = await getImageExif(path);

	// Here we add filters as guards
	const dateCreated = parseExifDate(imgData.exif.CreateDate);
	const dateAfter = options?.dateAfter ? new Date(options.dateAfter): null;
	const dateBefore = options?.dateBefore ? new Date(options.dateBefore): null;
	if (!filterRange(dateCreated, dateAfter, dateBefore)) return false;

	if (!filterValue(imgData.exif.Model, options.cameraModel)) return false;



	return true;
}

export default metadataModule;
