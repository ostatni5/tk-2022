import { deserialize } from 'bson';
import ModuleConfig from './moduleConfig';

export default class PictureRequest {
	path: string;
	moduleConfig: ModuleConfig[];
	constructor(buffer: Buffer) {
		const { path, modules } = deserialize(buffer);
		this.path = path;
		this.moduleConfig = modules;
	}
}
