import { moduleManager, isModuleType } from './modules/modulesConfig';

const PORT = process.env.PORT || 8000;

const nodeType = isModuleType(process.env.NODE_TYPE) ? process.env.NODE_TYPE : 'traverse';

const app = moduleManager?.[nodeType];

app.listen(PORT, (): void => {
	console.log(`Server ${nodeType} Running here 👉 http://localhost:${PORT}`);
});
