import main from './mainModule/main';
import example from './exampleModule/example';
import metadata from './metadataModule/metadata';

export type ModuleType = keyof typeof moduleManager;

export const moduleManager = {
	main,
	example,
	metadata,
} as const;

export function isModuleType(value: string | undefined): value is ModuleType {
	if (typeof value === 'undefined') return false;
	return Object.keys(moduleManager).includes(value);
}
