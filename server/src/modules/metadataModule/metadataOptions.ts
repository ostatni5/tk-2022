import { ModuleOptions } from '../../classes/moduleOptions';

export default interface MetadataOptions extends ModuleOptions {
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
