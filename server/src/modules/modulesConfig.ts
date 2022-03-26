import traverse from './traverseModule/traverse';
import example from './exampleModule/example';

export type ModuleType = keyof typeof modulesConfig;

export const modulesConfig = {
	traverse,
	example
} as const;

export function isModuleType(value: string | undefined): value is ModuleType {
	if (typeof value === 'undefined') return false;

	return value in [...Object.keys(modulesConfig)];
}
