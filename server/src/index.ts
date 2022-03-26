import { modulesConfig, isModuleType } from './modules/modulesConfig';

const PORT = process.env.PORT || 8000;

const nodeType = isModuleType(process.env?.NODE_TYPE) ? process.env.NODE_TYPE : 'traverse';

const app = modulesConfig?.[nodeType];

app.listen(PORT, (): void => {
	console.log(`Server Running here 👉 http://localhost:${PORT}`);
});
