import traverse from './traverseModule/traverse';
import example from './exampleModule/example';

export type ModuleType = keyof typeof moduleManager;

export const moduleManager = {
	traverse,
	example
} as const;

export function isModuleType(value: string | undefined): value is ModuleType {
	if (typeof value === 'undefined') return false;
	return Object.keys(moduleManager).includes(value);
}
