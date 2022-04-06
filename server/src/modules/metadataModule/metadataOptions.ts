import { ModuleConfig, ModuleName } from '../../classes/moduleConfig';

export default interface MetadataOptions extends ModuleConfig {
	name: ModuleName;
	dateAfter?: Date;
	dateBefore?: Date;
	cameraModel?: string;
	colorSpace?: string;
	exposureTime?: number;
	fNumber?: string;
	pixelXDimMin?: number;
	pixelXDimMax?: number;
	pixelYDimMin?: number;
	pixelYDimMax?: number;
}
