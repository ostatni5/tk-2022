import { ModuleConfig, ModuleName } from '../../classes/moduleConfig';

export default interface MetadataOptions extends ModuleConfig {
	name: ModuleName;
	dateAfter?: Date;
	dateBefore?: Date;
}
