import { ModuleConfig, ModuleName } from '../../classes/moduleConfig';

export default interface MetadataOptions extends ModuleConfig {
	name: ModuleName;
	dateAfter?: Date;
	dateBefore?: Date;
	exposureTime?: number;
	fNumber?: number;
	focalLength?: number;
	flash: number;
	pixelXDimMin?: number;
	pixelXDimMax?: number;
	pixelYDimMin?: number;
	pixelYDimMax?: number;
}
