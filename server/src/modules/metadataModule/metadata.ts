import bodyParser from 'body-parser';
import express, { Application } from 'express';
import { asyncFilter } from '../../utils/async.utils';
import { getImageExif, parseExifDate } from '../../utils/metadata.utils';
import { getHandler } from '../../utils/request.utils';
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

	const imgData = await getImageExif(path);

	// Here we add filters as guards
	return filterDate(imgData, options);
}

function filterDate(imgData: any, options: MetadataOptions): boolean {
	if (!('CreateDate' in imgData.exif)) {
		return false;
	}
	const dateCreated = parseExifDate(imgData.exif.CreateDate);

	if (
		options.dateAfter !== undefined &&
		dateCreated.getTime() < new Date(options.dateAfter).getTime()
	)
		return false;

	if (
		options.dateBefore !== undefined &&
		dateCreated.getTime() > new Date(options.dateBefore).getTime()
	)
		return false;

	return true;
}

export default metadataModule;
