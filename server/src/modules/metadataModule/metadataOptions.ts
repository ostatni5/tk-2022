import { ModuleConfig, ModuleName } from '../../classes/moduleConfig';

export default interface MetadataOptions extends ModuleConfig {
	dateAfter?: Date;
	dateBefore?: Date;
}
