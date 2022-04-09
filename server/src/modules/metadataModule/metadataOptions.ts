import { ModuleOptions } from '../../classes/moduleOptions';

export default interface MetadataOptions extends ModuleOptions {
	dateAfter?: Date;
	dateBefore?: Date;
}
