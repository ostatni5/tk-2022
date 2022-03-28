export interface ModuleConfig {
	name: ModuleName;
}

export type ModuleName = keyof typeof ModuleRoutes;

export const ModuleRoutes ={
	'metadata': 'http://localhost:8083/',
}
