export interface ModuleOptions {
	name: ModuleName;
}

export type ModuleName = keyof typeof ModuleRoutes;

export const ModuleRoutes = {
	metadata: 'http://localhost:8083/',
	text: 'http://localhost:8085/',
	people: 'http://localhost:8087/',
	weather: 'http://localhost:8086/',
	body: 'http://localhost:8090/',
	style: 'http://localhost:8091/',
};
