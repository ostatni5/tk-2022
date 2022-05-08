import { deserialize } from 'bson';
import { ModuleOptions } from './moduleOptions.interface';

export default class PictureRequest {
	path: string;
	moduleOptions: ModuleOptions[];

	constructor(buffer: Buffer) {
		const { path, moduleOptions } = deserialize(buffer);
		this.path = path;
		this.moduleOptions = moduleOptions;
	}
}
