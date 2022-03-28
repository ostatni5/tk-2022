import { deserialize } from 'bson';
import {ModuleConfig} from './moduleConfig';

export default class PictureRequest {
	path: string;
	moduleConfig: ModuleConfig[];
	constructor(buffer: Buffer) {
		const { path, moduleConfig } = deserialize(buffer);
		this.path = path;
		this.moduleConfig = moduleConfig;
	}
}
